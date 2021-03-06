#!/usr/bin/env bash

set -e

HERE=$(dirname "$(readlink -f "$0")")
TOP=$(dirname "${HERE}")

cd "${TOP}"

if [[ -v GIT_CLONE ]]
then
  git --version || apt-get -qq -y install git

  git clone \
    --depth=1 \
    https://github.com/adshares/adpanel.git \
    --branch ${BUILD_BRANCH} \
    ${BUILD_PATH}/build

  cd ${BUILD_PATH}/build
fi

ADSERVER_URL_FROM_CMD=${1:-http://localhost:8101}

GIT_TAG=$(git tag -l --points-at HEAD | head -n 1)
GIT_HASH="#"$(git rev-parse --short HEAD)

export APP_NAME=${APP_NAME:-AdPanel}
export APP_VERSION=${APP_VERSION:-${GIT_TAG:-${GIT_HASH}}}
export APP_PROD=${APP_PROD:-true}
export ADSERVER_URL=${ADSERVER_URL:-${ADSERVER_URL_FROM_CMD}}
export DEV_XDEBUG=${DEV_XDEBUG:-false}

export APP_ENV=${APP_ENV:-prod}

envsubst --version &>/dev/null || (echo "[ERROR] Missing 'envsubst' command" && exit 127)
envsubst < src/environments/environment.ts.template | tee src/environments/environment.${APP_ENV}.ts

if [[ ! -z ${BRAND_ASSETS_DIR:-""} ]]
then
  if [[ ! -d ${BRAND_ASSETS_DIR} ]]
  then
      echo "Brand assets directory ${BRAND_ASSETS_DIR} doesn't exist."
  else
      cp -f ${BRAND_ASSETS_DIR}/favicon* src/
      cp -f ${BRAND_ASSETS_DIR}/logo* src/assets/images/
  fi
fi

yarn --version &>/dev/null || (echo "[ERROR] Missing 'yarn' command" && exit 127)
yarn install

#BUILD_DIRECTORY -> TARGET_DIRECTORY -> BACKUP_DIRECTORY
BUILD_DIRECTORY=dist_tmp
TARGET_DIRECTORY=dist
BACKUP_DIRECTORY=dist_backup
if [[ ${APP_ENV} == 'dev' ]]
then
  yarn build --output-path=$BUILD_DIRECTORY
elif [[ ${APP_ENV} == 'prod' ]]
then
  yarn build --prod --output-path=$BUILD_DIRECTORY
else
  echo "ERROR: Unsupported environment ($APP_ENV)."
  exit 1
fi

INDEX_TEMPLATE=src/index.html.template
INDEX_FILE=$BUILD_DIRECTORY/index.html
ROBOTS_FILE=$BUILD_DIRECTORY/robots.txt
bin/build-index-html.sh $INDEX_TEMPLATE $INDEX_FILE $ROBOTS_FILE
envsubst < info.json.template | tee $BUILD_DIRECTORY/info.json

if [ -d $BACKUP_DIRECTORY ]
then
  rm -rf $BACKUP_DIRECTORY
fi
mv $TARGET_DIRECTORY $BACKUP_DIRECTORY
mv $BUILD_DIRECTORY $TARGET_DIRECTORY
