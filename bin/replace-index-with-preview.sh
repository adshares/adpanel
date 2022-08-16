#!/usr/bin/env bash
# Usage: replace-index-with-preview.sh
# Description: Replaces index with preview

set -eu

cd "$(dirname "$0")"
cd ..

MINIMUM_DELAY_BEFORE_REPLACE=3600
PREVIEW_FILE=dist/preview.html
INDEX_FILE=dist/index.html

if [[ ! -f $PREVIEW_FILE ]]
then
  echo "File '${PREVIEW_FILE}' is missing. Script interrupted."
  exit 0
fi

TIMESTAMP_UPDATE=$(stat -c %Y $PREVIEW_FILE)
RESULT=$(($(date +%s)-TIMESTAMP_UPDATE))

if [[ $RESULT -gt $MINIMUM_DELAY_BEFORE_REPLACE ]]
then
  mv $PREVIEW_FILE $INDEX_FILE
  echo "$INDEX_FILE overwritten by $PREVIEW_FILE"
fi
