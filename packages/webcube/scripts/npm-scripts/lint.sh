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
$binRoot/node_modules/.bin/eslint --fix --color --ext .js,.jsx,.es6 $*
