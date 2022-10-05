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
INDEX_FILE_TEMPORARY=index.tmp
INDEX_FILE=${2:-"dist/index.html"}
ROBOTS_FILE=${3:-"dist/robots.txt"}
BUILD_DIRECTORY=$(dirname "${INDEX_FILE}")

if [[ ! -f ${INDEX_TEMPLATE} ]]
then
  echo "Template file '${INDEX_TEMPLATE}' is missing. Script interrupted."
  exit 1
fi

if [[ ! -d $BUILD_DIRECTORY ]]
then
  echo "Directory for index file ${INDEX_FILE} is missing. Script interrupted."
  exit 1
fi

if [[ ! -d $(dirname "${ROBOTS_FILE}") ]]
then
  echo "Directory for robots.txt file ${ROBOTS_FILE} is missing. Script interrupted."
  exit 1
fi

curl --max-time 10 -s -w '\n' "${ADSERVER_URL}/panel/placeholders?types[]=index-title&types[]=index-description&types[]=index-keywords&types[]=index-meta-tags&types[]=robots-txt" | node bin/build-index.js "$INDEX_TEMPLATE" "$INDEX_FILE_TEMPORARY" "$ROBOTS_FILE"

cd "$BUILD_DIRECTORY"
WILDCARDS=("runtime.*.js" "polyfills.*.js" "styles.*.js" "vendor.bundle.js" "main.*.js")
SCRIPTS=
for WILDCARD in "${WILDCARDS[@]}"
do
  FILE=$(find . -name "$WILDCARD")
  [[ "$FILE" ]] && SCRIPTS+="<script src=\"$(basename "$FILE")\" type=\"module\"></script>"
done

WILDCARDS=("styles.*.css" "custom.css")
STYLESHEETS=
for WILDCARD in "${WILDCARDS[@]}"
do
  FILE=$(find . -name "$WILDCARD")
  [[ "$FILE" ]] && STYLESHEETS+="<link href=\"$(basename "$FILE")\" rel=\"stylesheet\"/>"
done

cd ..
sed -i "s~</body>~${SCRIPTS}</body>~" "$INDEX_FILE_TEMPORARY"
sed -i "s~</head>~${STYLESHEETS}</head>~" "$INDEX_FILE_TEMPORARY"

envsubst < "$INDEX_FILE_TEMPORARY" > "$INDEX_FILE"
rm "$INDEX_FILE_TEMPORARY"

echo Index built successfully
