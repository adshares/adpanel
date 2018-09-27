#!/usr/bin/env bash

set -e -x

cp --no-clobber --verbose docker-compose.override.yaml.dist docker-compose.override.yaml
[ -f .env ] || SYSTEM_USER_ID=`id --user` SYSTEM_USER_NAME=`id --user --name` envsubst \${SYSTEM_USER_ID},\${SYSTEM_USER_NAME} < .env.dist | tee .env

docker-compose config # just to check the config

docker-compose run --rm --entrypoint yarn dev install
docker-compose up --detach
