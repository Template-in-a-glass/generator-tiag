
# Init Next Project project
npx -y create-next-app@latest --ts --use-npm $APP_NAME-landing-page-next-app
cd $APP_NAME-landing-page-next-app

# Install estlint and vscode plugin and settings
mkdir .vscode
curl -o .vscode/extensions.json https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-next-app/main/.vscode/extensions.json
curl -o .vscode/settings.json https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-next-app/main/.vscode/settings.json

npm install @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-airbnb eslint-import-resolver-typescript eslint-plugin-etc eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-unicorn --save-dev

curl -o .eslintignore https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-next-app/main/.eslintignore
curl -o .eslintrc.json https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-next-app/main/.eslintrc.json
npm pkg set scripts.lint="eslint ./src --ext .js,.jsx,.ts,.tsx"
npm pkg set scripts.format="eslint ./src --ext .js,.jsx,.ts,.tsx --fix"

git add .
git commit -m "Install estlint and vscode plugin and settings"

# Clean boilerplate
rm -rvf ./pages
rm -rvf ./styles
rm -rvf ./public/vercel.svg
mkdir src
mkdir data

git add .
git commit -m "Clean boilerplate"

# Install Next SEO
npm install next-seo next-sitemap --save
curl -o next-sitemap.config.js https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-next-app/main/next-sitemap.config.js
npm pkg set scripts.postbuild="next-sitemap"
echo public/sitemap* >> .gitignore
echo public/robots.txt >> .gitignore

git add .
git commit -m "Install Next SEO"

# Install Next Export Optimize Images
npm install next-export-optimize-images --save-dev
curl -o next.config.js https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-next-app/main/next.config.js
npm pkg set scripts.build="next lint && next build && next export && next-export-optimize-images"
npm pkg set scripts.start="npm run build && npx -y serve@latest out"

git add .
git commit -m "Install Next Export Optimize Images"

# Install the UI Library (manual, need use package repository later)
( cd ../$APP_NAME-landing-page-ui-library ; npm pack )
mkdir lib
cp ../$APP_NAME-landing-page-ui-library/$APP_NAME-landing-page-ui-library-*.tgz ./lib
rm ../$APP_NAME-landing-page-ui-library/$APP_NAME-landing-page-ui-library-*.tgz
npm install ./lib/*.tgz
npx -y replace-in-files-cli@latest --string='""$APP_NAME-landing-page-ui-library""' --replacement='""ui-library""' package.json
npm pkg set scripts.update-ui-library="( cd ../$APP_NAME-landing-page-ui-library ; npm run build ; npm pack ) && cp ../$APP_NAME-landing-page-ui-library/$APP_NAME-landing-page-ui-library-*.tgz ./lib && rm ../$APP_NAME-landing-page-ui-library/$APP_NAME-landing-page-ui-library-*.tgz && rm -rvf .next && npm install ui-library --force"
npm run update-ui-library

echo lib >> .gitignore
git add .
git commit -m "Install the UI Library"

# Update all libraries (can be dangerous)
npm pkg set scripts.update-dependencies="npx -y npm-check-updates@latest -u"
npm run update-dependencies
npm install

git add .
git commit -m "Update all libraries"

# Download the code template
curl https://codeload.github.com/Template-in-a-glass/template-landing-page-next-app/tar.gz/main | tar -xz --strip=1 template-landing-page-next-app-main/src/
curl https://codeload.github.com/Template-in-a-glass/template-landing-page-next-app/tar.gz/main | tar -xz --strip=1 template-landing-page-next-app-main/data/

git add .
git commit -m "Download the code template"

# Clean the code
npm run format

git add .
git commit -m "Clean the code"

# Install husky
npm install husky --save-dev
npm pkg set scripts.prepare="husky install"
npm run prepare
npx -y husky@latest add .husky/pre-commit "npm run lint"
npx -y husky@latest add .husky/pre-push "npm run lint && npm run build"
npm pkg delete scripts.prepare

git add .
git commit -m "Install husky"

# Set up git and project ready commit
echo .dccache >> .gitignore
git add .
git commit -m "project ready"

# Create repo on github and push it
gh repo create $GH_ORGA/$APP_NAME-landing-page-next-app --private
git remote add origin git@github.com:$GH_ORGA/$APP_NAME-landing-page-next-app.git
git branch -M main
git push -u origin main

# Go back to root
cd ..