#!/bin/sh
webcubeRoot="."
binRoot="."
if [[ -e $npm_package_config_webcube_monorepo_root ]]; then
  webcubeRoot="${npm_package_config_webcube_monorepo_root}"
  binRoot="${npm_package_config_webcube_monorepo_root}"
  if [[ ! -d ${binRoot}/node_modules/ ]]; then
    webcubeRoot="."
    binRoot="./node_modules/webcube"
  fi
fi
CFG_FILE="${webcubeRoot}/node_modules/webcube/configs/gulpfile.js"
DEPLOY_MODE=staticweb
NODE_ENV=production
$binRoot/node_modules/.bin/gulp --gulpfile $CFG_FILE deploy:staticweb:html
