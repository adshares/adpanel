#!/usr/bin/env bash

set -e

export SYSTEM_USER_ID=`id --user`
export SYSTEM_USER_NAME=`id --user --name`

export WEBSERVER_HOST=${WEBSERVER_HOST:-localhost}
export WEBSERVER_PORT=${WEBSERVER_PORT:-8102}

export ADSERVER_URL=${ADSERVER_URL:-http://localhost:8101}

[ -f .env ] || envsubst < .env.dist | tee .env

source .env

#[ -f src/environments/environment.ts ] ||
envsubst < src/environments/environment.ts.dist | tee src/environments/environment.ts
#[ -f src/environments/environment.dev.ts ] ||
envsubst < src/environments/environment.ts.dist | tee src/environments/environment.dev.ts

docker-compose config # just to check the config

docker-compose run --rm --entrypoint yarn dev install

docker-compose up --detach
