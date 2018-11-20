#!/usr/bin/env bash

set -e

env | sort

if [ ! -v TRAVIS ]; then
  # Checkout repo and change directory

  # Install git
  git --version || apt-get -qq -y install git

  git clone \
    --depth=1 \
    https://github.com/adshares/adpanel.git \
    --branch ${ADPANEL_BRANCH} \
    ${BUILD_PATH}/build

  cd ${BUILD_PATH}/build
fi

# Create environment
envsubst < environment.ts.dist | tee src/environments/environment.${APP_ENV}.ts

# Install dependencies
yarn install

# Build project
if [ ${APP_ENV} == 'dev' ];
then
  node_modules/@angular/cli/bin/ng build --environment dev --sourcemaps --verbose
else
  node_modules/@angular/cli/bin/ng build --environment ${APP_ENV}
fi
