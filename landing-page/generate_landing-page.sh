set -o allexport
source .env
set +o allexport

mkdir $APP_NAME
cd $APP_NAME

echo $GH_TOKEN | gh auth login --with-token

../create_landing-page-ui-library.sh
../create_landing-page-next-app.sh
../create_landing-page-infra.sh
../create_landing-page-ci-cd.sh
