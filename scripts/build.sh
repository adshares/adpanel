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

# Add version based on GIT commit hash (short version)
./scripts/_environment.sh

# Install dependencies
yarn install

# Build project
if [[ ${APP_ENV} == 'dev' ]]
then
  node_modules/@angular/cli/bin/ng build --environment dev --sourcemaps --verbose --target development
elif [[ ${APP_ENV} == 'prod' ]]
then
  node_modules/@angular/cli/bin/ng build --environment prod --bundle-dependencies all --build-optimizer --target production
else
  node_modules/@angular/cli/bin/ng build --environment ${APP_ENV}
fi
