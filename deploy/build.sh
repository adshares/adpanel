#!/usr/bin/env bash
set -e

source ${1:-$(dirname $(readlink -f "$0"))/bin}/_functions.sh
[[ -z ${2:-""} ]] || cd $2
[[ -z ${3:-".env"} ]] || set -a && source .env && set +a

ADSERVER_URL_FROM_CMD=${1:-http://localhost:8001}

GIT_TAG=$(git tag -l --points-at HEAD | head -n 1)
GIT_HASH="#"$(git rev-parse --short HEAD)

export APP_VERSION=${APP_VERSION:-${GIT_TAG:-${GIT_HASH}}}
export APP_PROD=${APP_PROD:-true}
export ADSERVER_URL=${ADSERVER_URL:-${ADSERVER_URL_FROM_CMD}}
export DEV_XDEBUG=${DEV_XDEBUG:-false}
export APP_ENV=${APP_ENV:-prod}
export APP_PORT=${APP_PORT:-8002}

envsubst < src/environments/environment.ts.template | tee src/environments/environment.${APP_ENV}.ts

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

test -f info.json.template && envsubst < info.json.template | tee dist/info.json