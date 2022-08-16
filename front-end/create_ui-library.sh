

npm init -y vite@latest $APP_NAME-ui-library -- --template react-ts
cd $APP_NAME-ui-library
npm install

git init

mkdir .vscode
curl -o .vscode/extensions.json https://gist.githubusercontent.com/vdelacou/4584ed57e1f141290820ba389694d7dd/raw/.vscode_extensions.json
curl -o .vscode/settings.json https://gist.githubusercontent.com/vdelacou/4584ed57e1f141290820ba389694d7dd/raw/.vscode_settings.json

curl -o tsconfig.json https://gist.githubusercontent.com/vdelacou/4584ed57e1f141290820ba389694d7dd/raw/tsconfig.json

npm install @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-airbnb eslint-import-resolver-typescript eslint-plugin-etc eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-unicorn eslint-plugin-tailwindcss --save-dev

curl -o .eslintignore https://gist.githubusercontent.com/vdelacou/4584ed57e1f141290820ba389694d7dd/raw/.eslintignore
curl -o .eslintrc.json https://gist.githubusercontent.com/vdelacou/4584ed57e1f141290820ba389694d7dd/raw/.eslintrc.json
echo tailwind.config.js  >> .eslintignore
echo postcss.config.js  >> .eslintignore
npm pkg set scripts.lint="eslint . --ext .js,.jsx,.ts,.tsx"
npm pkg set scripts.format="eslint . --ext .js,.jsx,.ts,.tsx --fix"

npm install husky --save-dev
npm pkg set scripts.prepare="husky install"
git init
npm run prepare
npx -y husky add .husky/pre-commit "npm run lint"
npx -y husky add .husky/pre-push "npm run lint && npm run build"
npm pkg delete scripts.prepare

rm ./src/logo.svg
rm ./src/Main.tsx
rm ./src/App.css
rm ./src/App.tsx
rm ./src/index.css
rm ./src/favicon.svg
rm ./index.html

npm pkg delete scripts.dev
npm pkg delete scripts.preview

npx -y sb init --builder @storybook/builder-vite

rm -rvf ./src/stories/*
mkdir ./src/lib

npm install vite-plugin-dts --save-dev
curl -o vite.config.ts https://gist.githubusercontent.com/vdelacou/4584ed57e1f141290820ba389694d7dd/raw/library-vite.config.ts
npx -y replace-in-files-cli --string='my-lib' --replacement='$APP_NAME-ui-library' vite.config.ts

npm install tailwindcss@latest postcss@latest autoprefixer@latest @storybook/addon-postcss --save-dev
npx -y tailwindcss init -p
touch ./src/lib/main.css
echo '@tailwind base;\n@tailwind components;\n@tailwind utilities;' >> ./src/lib/main.css
touch ./src/lib/index.ts
echo "import './main.css';" >> ./src/lib/index.ts
curl -o tailwind.config.js https://gist.githubusercontent.com/vdelacou/4584ed57e1f141290820ba389694d7dd/raw/tailwind.config.js
npx -y replace-in-files-cli --string='"@storybook/addon-essentials",' --replacement='"@storybook/addon-essentials",\n"@storybook/addon-postcss",' .storybook/main.js
echo "\nimport '../src/lib/main.css';" >> .storybook/preview.js
echo storybook-static >> .gitignore

npm install @headlessui/react @heroicons/react react-hook-form

npx -y replace-in-files-cli --string='"dependencies"' --replacement='"peerDependencies"' package.json
npm pkg set "files[0]"=dist
npm pkg set "main"="./dist/$APP_NAME-ui-library.umd.js"
npm pkg set "module"="./dist/$APP_NAME-ui-library.es.js"
npm pkg set "types"="./dist/index.d.ts"

npx -y json -I -f package.json -e 'this.exports={".": {"import": "./dist/$APP_NAME-ui-library.es.js","require": "./dist/$APP_NAME-ui-library.umd.js"}}'

npm pkg set scripts.update-dependencies="npx -y npm-check-updates -u"
npm run update-dependencies
npm install

curl https://codeload.github.com/vdelacou/template-in-a-glass-ui-library/tar.gz/main | tar -xz --strip=1 template-in-a-glass-ui-library-main/src/

npm run format

echo .dccache >> .gitignore
echo !.vscode/settings.json >> .gitignore
git add .
git commit -m "init project"

cd ..