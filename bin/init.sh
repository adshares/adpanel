#!/usr/bin/env bash

set -e -x

cp --no-clobber --verbose docker-compose.override.yaml.dist docker-compose.override.yaml

export SYSTEM_USER_ID=`id --user`
export SYSTEM_USER_NAME=`id --user --name`

export SERVE_HOST=0.0.0.0
export SERVE_PUB_HOST=localhost

[ -f .env ] || envsubst < .env.dist | tee .env

export ADSERVER_URL=http://localhost:8101

[ -f src/environments/environment.ts ] || envsubst < src/environments/environment.ts.dist | tee src/environments/environment.ts

docker-compose config # just to check the config

docker-compose run --rm --entrypoint yarn dev install

