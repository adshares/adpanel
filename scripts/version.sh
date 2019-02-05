#!/usr/bin/env bash

# Version
GIT_TAG=$(git tag -l --points-at HEAD | head -n 1)
GIT_HASH="#"$(git rev-parse --short HEAD)
VERSION=${GIT_TAG:-${GIT_HASH}}


echo "export const VERSION = '${VERSION}';" > src/version.ts
