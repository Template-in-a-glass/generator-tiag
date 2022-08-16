# Init CDK project
mkdir $APP_NAME-landing-page-ui-library-ci-cd
cd $APP_NAME-landing-page-ui-library-ci-cd
npx -y cdk@latest init app --language typescript

# Update all libraries (can be dangerous)
npm pkg set scripts.update-dependencies="npx -y npm-check-updates@latest -u"
npm run update-dependencies
npm install

git add .
git commit -m "Update all libraries"

# Install estlint and vscode plugin and settings
mkdir .vscode
curl -o .vscode/extensions.json https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-ui-library-infra/main/.vscode/extensions.json
curl -o .vscode/settings.json https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-ui-library-infra/main/.vscode/settings.json

npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-airbnb-base eslint-import-resolver-typescript eslint-plugin-etc eslint-plugin-import eslint-plugin-unicorn

curl -o .eslintignore https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-ui-library-infra/main/.eslintignore
curl -o .eslintrc.json https://raw.githubusercontent.com/Template-in-a-glass/template-landing-page-ui-library-infra/main/.eslintrc.json
npm pkg set scripts.lint="eslint ./src --ext .js,.jsx,.ts,.tsx"
npm pkg set scripts.format="eslint ./src --ext .js,.jsx,.ts,.tsx --fix"

git add .
git commit -m "Install estlint and vscode plugin and settings"

# Clean boilerplate
rm -rvf ./bin
rm -rvf ./lib
rm -rvf ./test
mkdir src
mkdir ci-cd

git add .
git commit -m "Clean boilerplate"

# Download the code template
curl https://codeload.github.com/Template-in-a-glass/template-landing-page-ui-library-infra/tar.gz/main | tar -xz --strip=1 template-landing-page-ui-library-ci-cd-main/src/
npx -y json@latest -I -f cdk.json -e 'this.app="npx ts-node --prefer-ts-exts src/app.ts"'

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
npx -y husky@latest add .husky/pre-push "npm run lint"
npm pkg delete scripts.prepare

git add .
git commit -m "Install husky"

# Set up git and project ready commit
echo .dccache >> .gitignore
git add .
git commit -m "project ready"

# Create repo on github and push it
gh repo create $GH_ORGA/$APP_NAME-landing-page-ui-library-ci-cd --private
git remote add origin git@github.com:$GH_ORGA/$APP_NAME-landing-page-ui-library-ci-cd.git
git branch -M main
git push -u origin main

# Deploy ci-cd
npm pkg set scripts.deploy="npx -y cdk@latest deploy -c gh-owner=$GH_ORGA -c gh-repo=$APP_NAME-landing-page-ui-library -c stackName=$APP_NAME --require-approval never"
npm pkg set scripts.destroy="npx -y cdk@latest destroy $APP_NAME"
# npm run deploy

# Go back to root
cd ..

