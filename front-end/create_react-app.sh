

npm init vite@latest $APP_NAME-react-app -- --template react-ts
cd $APP_NAME-react-app
npm install

git init

mkdir .vscode
curl -o .vscode/extensions.json https://gist.githubusercontent.com/vdelacou/4584ed57e1f141290820ba389694d7dd/raw/.vscode_extensions.json
curl -o .vscode/settings.json https://gist.githubusercontent.com/vdelacou/4584ed57e1f141290820ba389694d7dd/raw/.vscode_settings.json

curl -o tsconfig.json https://gist.githubusercontent.com/vdelacou/4584ed57e1f141290820ba389694d7dd/raw/tsconfig.json

npm install @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-airbnb eslint-import-resolver-typescript eslint-plugin-etc eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-unicorn --save-dev

curl -o .eslintignore https://gist.githubusercontent.com/vdelacou/4584ed57e1f141290820ba389694d7dd/raw/.eslintignore
curl -o .eslintrc.json https://gist.githubusercontent.com/vdelacou/4584ed57e1f141290820ba389694d7dd/raw/.eslintrc.json
npm pkg set scripts.lint="eslint . --ext .js,.jsx,.ts,.tsx"
npm pkg set scripts.format="eslint . --ext .js,.jsx,.ts,.tsx --fix"

npm install husky --save-dev
npm pkg set scripts.prepare="husky install"
git init
npm run prepare
npx -y husky add .husky/pre-commit "npm run lint"
npx -y husky add .husky/pre-push "npm run lint && npm run build"
npm pkg delete scripts.prepare

npm install vitest --save-dev
curl -o vite.config.ts https://gist.githubusercontent.com/vdelacou/4584ed57e1f141290820ba389694d7dd/raw/vite.config.ts
npm pkg set scripts.test="vitest run"
npm pkg set scripts.watch="vitest watch"
npm pkg set scripts.coverage="vitest run --coverage"
curl -o ./src/example.test.ts https://gist.githubusercontent.com/vdelacou/4584ed57e1f141290820ba389694d7dd/raw/example.test.ts
npx -y json -I -f tsconfig.json -e 'this.compilerOptions.types=["vitest/globals"]'

rm ./src/logo.svg
rm ./src/Main.tsx
rm ./src/App.css
rm ./src/App.tsx
rm ./src/index.css
curl -o ./src/app.tsx https://gist.githubusercontent.com/vdelacou/4584ed57e1f141290820ba389694d7dd/raw/app.tsx
curl -o ./src/main.tsx https://gist.githubusercontent.com/vdelacou/4584ed57e1f141290820ba389694d7dd/raw/main.tsx

npx -y replace-in-files-cli --string='Vite App' --replacement='$APP_NAME' index.html

npm pkg set scripts.update-dependencies="npx -y npm-check-updates -u"
npm run update-dependencies
npm install

npm run format

echo .dccache >> .gitignore
echo !.vscode/settings.json >> .gitignore
echo coverage >> .gitignore
git add .
git commit -m "init project"

cd ..