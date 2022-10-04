#!/usr/bin/env bash
# Usage: build.sh [<work-dir>]
cd ${1:-"."}

set -a
source .env.dist
source .env
set +a

export APP_PORT=${APP_PORT:-8002}

export APP_PROD=${APP_PROD:-true}
export ADSERVER_URL=${ADSERVER_URL:-${ADSERVER_URL_FROM_CMD}}
export DEV_XDEBUG=${DEV_XDEBUG:-false}
export APP_ENV=${APP_ENV:-prod}

envsubst < src/environments/environment.ts.template | tee src/environments/environment."${APP_ENV}".ts

if [[ -n ${BRAND_ASSETS_DIR:-""} ]]
then
  if [[ ! -d ${BRAND_ASSETS_DIR} ]]
  then
    echo "Brand assets directory ${BRAND_ASSETS_DIR} doesn't exist."
  else
    echo "Copying brand assets from ${BRAND_ASSETS_DIR}"
    cp -fr "${BRAND_ASSETS_DIR}"/* src/
  fi
fi

yarn install
if [ $? -ne 0 ]; then exit 1; fi

#BUILD_DIRECTORY -> TARGET_DIRECTORY -> BACKUP_DIRECTORY
BUILD_DIRECTORY=dist_tmp
TARGET_DIRECTORY=dist
BACKUP_DIRECTORY=dist_backup
if [[ ${APP_ENV} == 'dev' ]]
then
  yarn build --configuration=dev --output-path=$BUILD_DIRECTORY
elif [[ ${APP_ENV} == 'prod' ]]
then
  yarn build --configuration=prod --output-path=$BUILD_DIRECTORY
else
  echo "ERROR: Unsupported environment ($APP_ENV)."
  exit 1
fi
if [ $? -ne 0 ]; then exit 1; fi

if [[ -n ${BRAND_ASSETS_DIR:-""} ]]
then
  if [[ -d ${BRAND_ASSETS_DIR} ]]
  then
    RESULT_CSS_FILE=$(find "$BUILD_DIRECTORY" -maxdepth 1 -name 'style*.css' -type f -print -quit)
    echo "Attaching css styles to $RESULT_CSS_FILE"
    CSS_FILES_COUNT=0
    CSS_FILES=$(find "$BRAND_ASSETS_DIR" -name '*.css' -type f)
    for CSS_FILE in $CSS_FILES
    do
      CSS_FILES_COUNT=$(("$CSS_FILES_COUNT" + 1))
      echo "- ${CSS_FILE}"
      cat "$CSS_FILE" >> "$RESULT_CSS_FILE"
    done
    if [[ $CSS_FILES_COUNT -eq 0 ]]
    then
      echo "No css styles to attach"
    fi
  fi
fi

INDEX_TEMPLATE=src/index.html.template
INDEX_FILE=$BUILD_DIRECTORY/index.html
ROBOTS_FILE=$BUILD_DIRECTORY/robots.txt
bin/build-index-html.sh $INDEX_TEMPLATE $INDEX_FILE $ROBOTS_FILE
if [ $? -ne 0 ]; then exit 1; fi

envsubst < info.json.template | tee $BUILD_DIRECTORY/info.json

if [ -d $BACKUP_DIRECTORY ]
then
  rm -rf $BACKUP_DIRECTORY
fi

if [ -d $TARGET_DIRECTORY ]
then
  mv $TARGET_DIRECTORY $BACKUP_DIRECTORY
fi
mv $BUILD_DIRECTORY $TARGET_DIRECTORY
