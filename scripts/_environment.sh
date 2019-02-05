#!/usr/bin/env bash

GIT_TAG=$(git tag -l --points-at HEAD | head -n 1)
GIT_HASH="#"$(git rev-parse --short HEAD)

export APP_VERSION=${APP_VERSION:-${GIT_TAG:-${GIT_HASH}}}
export APP_ENV=${APP_ENV:-dev}
export APP_PROD=${APP_PROD:-false}

export ADSERVER_URL=${ADSERVER_URL:-http://localhost:8101}

export DEV_XDEBUG=${DEV_XDEBUG:-false}

envsubst < environment.ts.dist | tee src/environments/environment.${APP_ENV}.ts
