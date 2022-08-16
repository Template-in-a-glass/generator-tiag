

# Init Vite project
npm init -y vite@latest $APP_NAME-landing-page-ui-library -- --template react-ts
cd $APP_NAME-landing-page-ui-library
npm install

git init
git add .
git commit -m "Init vite project"

# Install estlint and vscode plugin and settings
mkdir .vscode
curl -o .vscode/extensions.json https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-ui-library/main/.vscode/extensions.json
curl -o .vscode/settings.json https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-ui-library/main/.vscode/settings.json

npm install @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-airbnb eslint-import-resolver-typescript eslint-plugin-etc eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-unicorn eslint-plugin-tailwindcss --save-dev

curl -o .eslintignore https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-ui-library/main/.eslintignore
curl -o .eslintrc.json https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-ui-library/main/.eslintrc.json
echo tailwind.config.js  >> .eslintignore
echo postcss.config.js  >> .eslintignore
npm pkg set scripts.lint="eslint ./src --ext .js,.jsx,.ts,.tsx"
npm pkg set scripts.format="eslint ./src --ext .js,.jsx,.ts,.tsx --fix"

git add .
git commit -m "Install estlint and vscode plugin and settings"

# Clean boilerplate
rm ./src/Main.tsx
rm ./src/App.css
rm ./src/App.tsx
rm ./src/index.css
rm -rvf ./src/assets
rm -rvf public
rm ./index.html

npm pkg delete scripts.dev
npm pkg delete scripts.preview

git add .
git commit -m "Clean boilerplate"

# Install storybook
npx --silent -y sb@latest init --builder @storybook/builder-vite
rm -rvf ./src/stories

git add .
git commit -m "Install storybook"

# Install common library
npm install @headlessui/react @heroicons/react react-hook-form --silent

git add .
git commit -m "Install common library"

# Install tailwind
npm install tailwindcss@latest postcss@latest autoprefixer@latest @storybook/addon-postcss --save-dev --silent
npx -y tailwindcss@latest init -p
curl -o tailwind.config.cjs https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-ui-library/main/tailwind.config.cjs

git add .
git commit -m "Install tailwind"

# Configure tailwind storybook
npx -y replace-in-files-cli@latest --string='"@storybook/addon-essentials",' --replacement='"@storybook/addon-essentials",\n\t\t"@storybook/addon-postcss",' .storybook/main.js
echo "\nimport '../src/lib/main.css';" >> .storybook/preview.js
echo storybook-static >> .gitignore

git add .
git commit -m "Configure tailwind storybook"

# Config build library
npm install vite-plugin-dts --save-dev --silent
curl -o vite.config.ts https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-ui-library/main/vite.config.ts
npx -y replace-in-files-cli@latest --string='template-landing-page-ui-library' --replacement='$APP_NAME-landing-page-ui-library' vite.config.ts

git add .
git commit -m "Config build library"

# Add library config in package.json
npx -y replace-in-files-cli@latest --string='"dependencies"' --replacement='"peerDependencies"' package.json
npm pkg set "files[0]"=dist
npm pkg set "main"="./dist/$APP_NAME-landing-page-ui-library.umd.js"
npm pkg set "module"="./dist/$APP_NAME-landing-page-ui-library.es.js"
npm pkg set "types"="./dist/index.d.ts"
npx -y json@latest -I -f package.json -e 'this.exports={".": {"import": "./dist/$APP_NAME-landing-page-ui-library.es.js","require": "./dist/$APP_NAME-landing-page-ui-library.umd.js"},"./dist/style.css": "./dist/style.css"}'

git add .
git commit -m "Add library config in package.json"

# Update all libraries (can be dangerous)
npm pkg set scripts.update-dependencies="npx -y npm-check-updates@latest -u"
npm run update-dependencies
npm install --silent

git add .
git commit -m "Update all libraries"

# Download the code template
curl https://codeload.github.com/Template-in-a-glass/template-landing-page-ui-library/tar.gz/main | tar -xz --strip=1 template-landing-page-ui-library-main/src/

git add .
git commit -m "Download the code template"


# Clean the code
npm run format

git add .
git commit -m "Clean the code"

## Temporary Fixed (need to remove later)
mv ./.storybook/main.js ./.storybook/main.cjs
npm install --save-dev @storybook/addon-postcss@2 --silent    

git add .
git commit -m "Temporary Fixed"

# Install husky
npm install husky --save-dev --silent
npm pkg set scripts.prepare="husky install"
npm run prepare
npx -y husky@latest add .husky/pre-commit "npm run lint"
npx -y husky@latest add .husky/pre-push "npm run lint && npm run build"
npm pkg delete scripts.prepare

git add .
git commit -m "Install husky"

# Set up git and project ready commit
echo .dccache >> .gitignore
echo !.vscode/settings.json >> .gitignore
git add .
git commit -m "project ready"

# Create repo on github and push it
gh repo create $GH_ORGA/$APP_NAME-landing-page-ui-library --private
git remote add origin git@github.com:$GH_ORGA/$APP_NAME-landing-page-ui-library.git
git branch -M main
git push -u origin main

# Go back to root
cd ..