#!/bin/sh
root="."
if [[ -e $npm_package_config_webcube_monorepo_root ]]; then
  root="${npm_package_config_webcube_monorepo_root}"
fi
$root/node_modules/.bin/eslint --fix --color --ext .js --ext .jsx --ext .es6 $*
