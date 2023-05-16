
# Init Mono Repo project
npx -y create-turbo@latest ./$APP_NAME pnpm  -e with-tailwind
cd $APP_NAME
git init
git add .
git commit -m "chore: init"
pnpm run build

# Init Conventional Commit
pnpm install --save-dev -w @commitlint/cli @commitlint/config-conventional
curl -o commitlint.config.js https://raw.githubusercontent.com/Template-in-a-glass/template-mono-repo/main/config/commitlint.config.js
git add .
git commit -m "chore: init Conventional Commit"

# Install estlint, prettier and vscode plugin and settings
cd packages/eslint-config-custom
pnpm install prettier-plugin-tailwindcss @typescript-eslint/eslint-plugin eslint-plugin-security   
curl -o ./index.js https://raw.githubusercontent.com/Template-in-a-glass/template-mono-repo/main/config/eslintrc.js
curl -o ./prettier.config.js https://raw.githubusercontent.com/Template-in-a-glass/template-mono-repo/main/config/prettier.config.js
cd ../..

mkdir .vscode
curl -o .vscode/extensions.json https://raw.githubusercontent.com/Template-in-a-glass/template-mono-repo/main/config/.vscode/extensions.json
curl -o .vscode/settings.json https://raw.githubusercontent.com/Template-in-a-glass/template-mono-repo/main/config/.vscode/settings.json

git add .
git commit -m "chore: install estlint and vscode plugin and settings"

# Clean boilerplate

npm install --save-dev autoprefixer postcss tailwindcss

rm -f public/**
rm -f src/app/globals.css src/app/page.module.css 

git add .
git commit -m "chore: clean boilerplate"

# Update all libraries (can be dangerous)
npm pkg set scripts.update-dependencies="npx -y npm-check-updates@latest -u"
npm run update-dependencies
npm install

git add .
git commit -m "chore: update all libraries"

# Download the code template
curl https://codeload.github.com/Template-in-a-glass/template-landing-page-next-app/tar.gz/main | tar -xz --strip=1 template-landing-page-next-app-main/src/app

git add .
git commit -m "chore: download the code template"

# Install husky
npm install husky --save-dev
npm pkg set scripts.prepare="husky install"
npm run prepare
npx -y husky@latest add .husky/pre-commit "npm run lint"
npx -y husky@latest add .husky/pre-push "npm run lint && npm run build"

# Init Husky
npm pkg set scripts.test="echo \"Error: no test specified\" && exit 1"
npm install --save-dev husky
npm pkg set scripts.prepare="husky install"
npm run prepare
npx -y husky@latest add .husky/commit-msg "npx --no -- commitlint --edit ${1}"
npx -y husky@latest add .husky/pre-push "npm run lint && npm run build"
npx -y husky@latest add .husky/pre-commit "
branch=\$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')\

if [ "\$branch" == "main" ]
then
    npm run test;
fi"
git add .
git commit -m "chore: init Husky"

# Set up git and project ready commit
# echo .dccache >> .gitignore
# git add .
# git commit -m "chore: project ready"

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
