#!/bin/bash
repoRoot="."
binRoot="."
if [[ -e $npm_package_config_webcube_monorepo_root ]]; then
  repoRoot="${npm_package_config_webcube_monorepo_root}"
  binRoot="${npm_package_config_webcube_monorepo_root}"
  if [[ ! -d ${binRoot}/node_modules/ ]]; then
    repoRoot="."
    binRoot="./node_modules/webcube"
  fi
fi
(
  webcube-check
) && (
  webcube-stop-staticserver
) && (
  node --max-old-space-size=8192 $binRoot/node_modules/.bin/webcube-devserver
)
