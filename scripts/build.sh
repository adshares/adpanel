#!/usr/bin/env bash

set -e

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

GIT_TAG=$(git tag -l --points-at HEAD | head -n 1)
GIT_HASH="#"$(git rev-parse --short HEAD)

export APP_VERSION=${APP_VERSION:-${GIT_TAG:-${GIT_HASH}}}
export APP_PROD=${APP_PROD:-false}
export ADSERVER_URL=${ADSERVER_URL:-http://localhost:8101}
export DEV_XDEBUG=${DEV_XDEBUG:-false}

export APP_ENV=${APP_ENV:-dev}

envsubst < environment.ts.dist | tee src/environments/environment.${APP_ENV}.ts

yarn install

if [[ ${APP_ENV} == 'dev' ]]
then
  node_modules/@angular/cli/bin/ng build
elif [[ ${APP_ENV} == 'prod' ]]
then
  node_modules/@angular/cli/bin/ng build --prod
else
  node_modules/@angular/cli/bin/ng build --environment ${APP_ENV}
fi
