#!/bin/sh
root=""
if [[ -e $npm_package_config_webcube_monorepo_root ]]; then
  root="${npm_package_config_webcube_monorepo_root}"
fi
CFG_FILE="${root}/node_modules/webcube/configs/gulpfile.js"
DEPLOY_MODE=staticweb
NODE_ENV=production
$root/node_modules/.bin/gulp --gulpfile $CFG_FILE deploy:staticweb:html
