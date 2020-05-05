#!/usr/bin/env bash
# Usage: build-preview-html.sh
# Description: Creates index preview from environment variables and backend placeholders

set -eu

cd "$(dirname "$0")"
cd ..

INDEX_TEMPLATE=src/index.html.template
INDEX_FILE_TEMPORARY=dist/preview_tmp.html
INDEX_FILE=dist/preview.html
ROBOTS_FILE=dist/robots.txt

bin/build-index-html.sh $INDEX_TEMPLATE $INDEX_FILE_TEMPORARY $ROBOTS_FILE

if [[ ! -f $INDEX_FILE ]] || ! (cmp -s $INDEX_FILE_TEMPORARY $INDEX_FILE)
then
  mv $INDEX_FILE_TEMPORARY $INDEX_FILE
  echo "Preview file was updated successfully"
else
  rm $INDEX_FILE_TEMPORARY
  echo "Preview file was not updated (no changes since last update)"
fi

