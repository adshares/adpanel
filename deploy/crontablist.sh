#!/usr/bin/env bash
set -eu

SERVICE_DIR=${SERVICE_DIR:-$(dirname "$(dirname "$(readlink -f "$0")")")}
LOG_DIR=${LOG_DIR:-""}

if [[ -z ${LOG_DIR} ]]
then
    _REDIRECTION="&> /dev/null"
else
    _REDIRECTION="&>> ${LOG_DIR}/adpanel-crontab.log"
fi

echo "*/5 * * * * ${SERVICE_DIR}/bin/build-preview-html.sh ${_REDIRECTION}"
echo "59 * * * * ${SERVICE_DIR}/bin/replace-index-with-preview.sh ${_REDIRECTION}"
