#!/usr/bin/env bash
# Usage: build-preview-html.sh
# Description: Creates index preview from environment variables and backend placeholders

set -eu

cd "$(dirname "$0")"
cd ..

if [[ ! -d "dist" ]]
then
  echo "Directory 'dist' is missing. Script interrupted."
  exit 1
fi

set -a
source .env
set +a

INDEX_TEMPLATE=src/index.html.template
INDEX_FILE_TEMPORARY=dist/preview_tmp.html
INDEX_FILE=dist/preview.html
ROBOTS_FILE=dist/robots.txt

bin/build-index-html.sh $INDEX_TEMPLATE $INDEX_FILE_TEMPORARY $ROBOTS_FILE

cd dist/
SCRIPTS="<script type=\"text/javascript\" src=\"`find . -name 'inline.*.js'`\"></script><script type=\"text/javascript\" src=\"`find . -name 'polyfills.*.js'`\"></script><script type=\"text/javascript\" src=\"`find . -name 'main.*.js'`\"></script>"
STYLES="<link href=\"`find . -name 'styles.*.css'`\" rel=\"stylesheet\"/>"
cd ..

sed -i "s~</body>~${SCRIPTS}</body>~" $INDEX_FILE_TEMPORARY
sed -i "s~</head>~${STYLES}</head>~" $INDEX_FILE_TEMPORARY

if [[ ! -f $INDEX_FILE ]] || !(cmp -s $INDEX_FILE_TEMPORARY $INDEX_FILE)
then
  mv $INDEX_FILE_TEMPORARY $INDEX_FILE
  echo "Preview file was updated successfully"
else
  rm $INDEX_FILE_TEMPORARY
  echo "Preview file was not updated (no changes since last update)"
fi

