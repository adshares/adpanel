#!/usr/bin/env bash

set -e

export SYSTEM_USER_ID=`id --user`
export SYSTEM_USER_NAME=`id --user --name`

export WEBSERVER_HOST=${WEBSERVER_HOST:-localhost}
export WEBSERVER_PORT=${WEBSERVER_PORT:-8102}

export ADSERVER_URL=${ADSERVER_URL:-http://localhost:8101}

export APP_ENV=${APP_ENV:-dev}

[ -f .env ] || envsubst < .env.dist | tee .env

source .env

envsubst < environment.ts.dist | tee src/environments/environment.${APP_ENV}.ts

docker-compose run --rm --entrypoint yarn dev install
