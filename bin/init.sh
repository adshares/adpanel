#!/usr/bin/env bash

set -e -x

export SYSTEM_USER_ID=`id --user`
export SYSTEM_USER_NAME=`id --user --name`

export ADPANEL_HOST=${ADPANEL_HOST:-localhost}
export ADPANEL_PORT=${ADPANEL_PORT:-8102}

export ADSERVER_URL=${ADSERVER_URL:-http://localhost:8101}

[ -f .env ] || envsubst < .env.dist | tee .env

source .env

[ -f src/environments/environment.ts ] || envsubst < src/environments/environment.ts.dist | tee src/environments/environment.ts
[ -f docker-compose.override.yaml ] || envsubst < docker-compose.override.yaml.dist | tee docker-compose.override.yaml

docker-compose config # just to check the config

docker-compose run --rm --entrypoint yarn dev install
