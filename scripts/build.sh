#!/usr/bin/env bash

set -e

envsubst --version &>/dev/null || (echo "[ERROR] Missing 'envsubst' command" && exit 127)
yarn --version &>/dev/null || (echo "[ERROR] Missing 'yarn' command" && exit 127)

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

export APP_VERSION=${APP_VERSION:-${GIT_TAG:-${GIT_HASH}}}
export APP_PROD=${APP_PROD:-true}
export ADSERVER_URL=${ADSERVER_URL:-${ADSERVER_URL_FROM_CMD}}
export DEV_XDEBUG=${DEV_XDEBUG:-false}

export APP_ENV=${APP_ENV:-prod}

envsubst < src/environments/environment.ts.template | tee src/environments/environment.${APP_ENV}.ts

yarn --version &>/dev/null || (echo "[ERROR] Missing 'yarn' command" && exit 127)
yarn install

if [[ ${APP_ENV} == 'dev' ]]
then
  node_modules/@angular/cli/bin/ng build
elif [[ ${APP_ENV} == 'prod' ]]
then
  node_modules/@angular/cli/bin/ng build --prod
else
  echo "ERROR: Unsupported environment ($APP_ENV)."
  exit 1
fi
