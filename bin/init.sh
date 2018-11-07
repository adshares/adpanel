#!/usr/bin/env bash

set -e

OPT_CLEAN=0
OPT_FORCE=0
OPT_BUILD=0
OPT_BUILD_MAPS=0
OPT_RUN=0
OPT_LOGS=0
OPT_LOGS_FOLLOW=0

while [ "$1" != "" ]
do
    case "$1" in
        --clean )
            OPT_CLEAN=1
            OPT_FORCE=1
        ;;
        --force )
            OPT_FORCE=1
        ;;
        --build )
            OPT_BUILD=1
        ;;
        --with-maps )
            ARG_MAPS="--sourcemaps"
        ;;
        --run )
            OPT_RUN=1
        ;;
        --logs )
            OPT_LOGS=1
        ;;
        --logs-follow )
            OPT_LOGS=1
            OPT_LOGS_FOLLOW=1
        ;;
    esac
    shift
done

# Docker Compose

export SYSTEM_USER_ID=`id --user`
export SYSTEM_USER_NAME=`id --user --name`

export WEBSERVER_HOST=${WEBSERVER_HOST:-localhost}
export WEBSERVER_PORT=${WEBSERVER_PORT:-8102}

# build

export APP_ENV=${APP_ENV:-dev}

# AdPanel ================================================

export APP_PROD=${APP_PROD:-false}
export ADSERVER_URL=${ADSERVER_URL:-http://localhost:8101}
export REQUEST_XDEBUG=${REQUEST_XDEBUG:-true}

# ========================================================

if [ ${OPT_CLEAN} -eq 1 ]
then
    echo " > Destroy containers"
    docker-compose down && echo " < DONE" || echo " < INFO: Containers already down"
fi

if [ ${OPT_FORCE} -eq 1 ]
then
    rm -f .env
fi

[ -f .env ] || envsubst < .env.dist | tee .env

source .env

envsubst < environment.ts.dist | tee src/environments/environment.${APP_ENV}.ts

if [ ${OPT_BUILD} -eq 1 ]
then
    docker-compose run --rm --entrypoint yarn dev install
fi

if [ ${OPT_RUN} -eq 1 ]
then
    docker-compose up --detach
elif [ ${OPT_BUILD} -eq 1 ]
then
    docker-compose run --rm dev build --environment ${APP_ENV} --verbose ${ARG_MAPS}
fi

if [ ${OPT_LOGS} -eq 1 ]
then
    if [ ${OPT_LOGS_FOLLOW} -eq 1 ]
    then
        docker-compose logs -f
    else
        docker-compose logs
    fi
fi
