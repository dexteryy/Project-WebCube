#!/bin/sh
root=""
if [[ -e $npm_package_config_webcube_monorepo_root ]]; then
  root="${npm_package_config_webcube_monorepo_root}"
fi
CFG_FILE="${root}/node_modules/webcube/configs/plopfile.js"
$root/node_modules/.bin/plop --plopfile=$CFG_FILE

