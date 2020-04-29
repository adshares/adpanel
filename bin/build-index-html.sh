#!/usr/bin/env bash
# Usage: build-index-html.sh [INDEX_TEMPLATE [INDEX_FILE [ROBOTS_FILE]]]
# Description: Creates index from environment variables and backend placeholders

set -eu

cd "$(dirname "$0")"
cd ..

set -a
source .env
set +a

INDEX_TEMPLATE=${1:-"src/index.html.template"}
INDEX_FILE=${2:-"src/index.html"}
ROBOTS_FILE=${3:-"src/robots.txt"}

curl --max-time 10 -s -w '\n' "${ADSERVER_URL}/panel/placeholders?types[]=index-title&types[]=index-description&types[]=index-keywords&types[]=index-meta-tags&types[]=robots-txt" | node bin/build-index.js $INDEX_TEMPLATE $INDEX_FILE $ROBOTS_FILE
envsubst < $INDEX_FILE | tee $INDEX_FILE > /dev/null
