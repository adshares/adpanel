#!/usr/bin/env bash
# Usage: build.sh [<work-dir>]

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

envsubst < src/environments/environment.ts.template | tee src/environments/environment."${APP_ENV}".ts

yarn install
if [ $? -ne 0 ]; then exit 1; fi

#BUILD_DIRECTORY -> DEFAULT_DIRECTORY
BUILD_DIRECTORY=dist_tmp
DEFAULT_DIRECTORY=dist_default
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

if [ -d $DEFAULT_DIRECTORY ]
then
  rm -rf $DEFAULT_DIRECTORY
fi
mv $BUILD_DIRECTORY $DEFAULT_DIRECTORY
deploy/reload.sh
