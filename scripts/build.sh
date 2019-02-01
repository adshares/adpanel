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
    --branch ${BUILD_BRANCH} \
    ${BUILD_PATH}/build

  cd ${BUILD_PATH}/build
fi

# Create environment
envsubst < environment.ts.dist | tee src/environments/environment.${APP_ENV}.ts

# Add version based on GIT commit hash (short version)
./scripts/version.sh

# Install dependencies
yarn install

# Build project
if [[ ${APP_ENV} == 'dev' ]]
then
  node_modules/@angular/cli/bin/ng build --environment dev --sourcemaps --verbose --target development
elif [[ ${APP_ENV} == 'prod' ]]
then
  node_modules/@angular/cli/bin/ng build --environment ${APP_ENV} --bundle-dependencies all --build-optimizer --target production
else
  node_modules/@angular/cli/bin/ng build --environment ${APP_ENV}
fi
