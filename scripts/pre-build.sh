#!/usr/bin/env bash

set -e

# Ubuntu 18.04 only

# Install dependencies for yarn operations
apt-get -qq -y install nodejs npm libpng-dev

# envsubst binary
apt-get -qq -y install gettext-base

# Get yarn
apt-get -qq -y install curl

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# Install yarn
apt-get -qq update && apt-get -qq -y install yarn
