
# Init Next Project project
npx -y create-next-app@latest --ts --eslint --experimental-app --src-dir --tailwind --use-npm --import-alias "@/*" $APP_NAME-landing-page-next-app
cd $APP_NAME-landing-page-next-app

# Install estlint and vscode plugin and settings
mkdir .vscode
curl -o .vscode/extensions.json https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-next-app/main/.vscode/extensions.json
curl -o .vscode/settings.json https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-next-app/main/.vscode/settings.json

npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-airbnb eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-jsx eslint-plugin-react eslint-plugin-react-hooks @types/node @types/react @types/react-dom eslint eslint-config-next typescript

curl -o .eslintignore https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-next-app/main/.eslintignore
curl -o .eslintrc.json https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-next-app/main/.eslintrc.json

git add .
git commit -m "Install estlint and vscode plugin and settings"

# Clean boilerplate

npm install --save-dev autoprefixer postcss tailwindcss

rm -f public/**
rm -f src/app/globals.css src/app/page.module.css 

git add .
git commit -m "Clean boilerplate"

# Update all libraries (can be dangerous)
npm pkg set scripts.update-dependencies="npx -y npm-check-updates@latest -u"
npm run update-dependencies
npm install

git add .
git commit -m "Update all libraries"

# Download the code template
curl https://codeload.github.com/Template-in-a-glass/template-landing-page-next-app/tar.gz/main | tar -xz --strip=1 template-landing-page-next-app-main/src/app

git add .
git commit -m "Download the code template"

# Install husky
npm install husky --save-dev
npm pkg set scripts.prepare="husky install"
npm run prepare
npx -y husky@latest add .husky/pre-commit "npm run lint"
npx -y husky@latest add .husky/pre-push "npm run lint && npm run build"

git add .
git commit -m "Install husky"

# Set up git and project ready commit
echo .dccache >> .gitignore
git add .
git commit -m "project ready"

# Install Next SEO
npm install next-sitemap --save
curl -o next-sitemap.config.js https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-next-app/main/next-sitemap.config.js
npm pkg set scripts.postbuild="next-sitemap"
echo public/sitemap* >> .gitignore
echo public/robots.txt >> .gitignore

git add .
git commit -m "Install Next SEO"

# Create repo on github and push it
gh repo create $GH_ORGA/$APP_NAME-landing-page-next-app --private
git remote add origin git@github.com:$GH_ORGA/$APP_NAME-landing-page-next-app.git
git branch -M main
git push -u origin main

# Go back to root
cd ..
