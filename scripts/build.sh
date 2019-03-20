#!/usr/bin/env bash

set -e

HERE=$(dirname $(readlink -f "$0"))
TOP=$(dirname ${HERE})

cd ${TOP}

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

if [ ! -d "${BRAND_ASSETS_DIR}" ]
then
    echo "Brand assets directory ${BRAND_ASSETS_DIR} doesn't exist."
else
    cp ${BRAND_ASSETS_DIR}/favicon* src/
    cp ${BRAND_ASSETS_DIR}/logo* src/assets/images/
fi

yarn --version &>/dev/null || (echo "[ERROR] Missing 'yarn' command" && exit 127)
yarn install

if [[ ${APP_ENV} == 'dev' ]]
then
  yarn build
elif [[ ${APP_ENV} == 'prod' ]]
then
  yarn build --prod
else
  echo "ERROR: Unsupported environment ($APP_ENV)."
  exit 1
fi

envsubst < info.json.template | tee dist/info.json
