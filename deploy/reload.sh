#!/usr/bin/env bash
# Usage: reload.sh [<work-dir>]

WORK_DIR=${1:-"."}
cd "$WORK_DIR" || exit 1

set -a
source .env.dist
source .env
set +a

export APP_PORT=${APP_PORT:-8002}
export APP_PROD=${APP_PROD:-true}
export ADSERVER_URL=${ADSERVER_URL:-${ADSERVER_URL_FROM_CMD}}
export DEV_XDEBUG=${DEV_XDEBUG:-false}
export APP_ENV=${APP_ENV:-prod}

#DEFAULT_DIRECTORY -> BUILD_DIRECTORY -> TARGET_DIRECTORY
DEFAULT_DIRECTORY=dist_default
BUILD_DIRECTORY=dist_tmp
TARGET_DIRECTORY=dist

if [ ! -d $DEFAULT_DIRECTORY ]
then
  echo "Directory $DEFAULT_DIRECTORY does not exist. Run build.sh to create defaults"
  exit 1
fi
if [ -d $BUILD_DIRECTORY ]
then
  rm -rf $BUILD_DIRECTORY
fi
cp -r $DEFAULT_DIRECTORY $BUILD_DIRECTORY

if [[ -n ${BRAND_ASSETS_DIR:-""} ]]
then
  if [[ -d ${BRAND_ASSETS_DIR} ]]
  then
    echo "Copying brand assets from ${BRAND_ASSETS_DIR}"
    cp -fr "${BRAND_ASSETS_DIR}"/* $BUILD_DIRECTORY/
  else
    echo "Brand assets directory ${BRAND_ASSETS_DIR} doesn't exist."
  fi
fi

INDEX_TEMPLATE=src/index.html.template
INDEX_FILE=$BUILD_DIRECTORY/index.html
ROBOTS_FILE=$BUILD_DIRECTORY/robots.txt
bin/build-index-html.sh $INDEX_TEMPLATE $INDEX_FILE $ROBOTS_FILE
if [ $? -ne 0 ]; then exit 1; fi

envsubst < info.json.template | tee $BUILD_DIRECTORY/info.json

if [ -d $TARGET_DIRECTORY ]
then
  rm -rf $TARGET_DIRECTORY
fi
mv $BUILD_DIRECTORY $TARGET_DIRECTORY
