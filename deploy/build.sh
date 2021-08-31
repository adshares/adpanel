#!/usr/bin/env bash
# Usage: build.sh [<work-dir>]
cd ${1:-"."}

set -a
source .env
set +a

export APP_PORT=${APP_PORT:-8002}

export APP_PROD=${APP_PROD:-true}
export ADSERVER_URL=${ADSERVER_URL:-${ADSERVER_URL_FROM_CMD}}
export DEV_XDEBUG=${DEV_XDEBUG:-false}
export APP_ENV=${APP_ENV:-prod}

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
