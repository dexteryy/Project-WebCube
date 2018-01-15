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

cur_yarn_ver="$(yarn -v)"
req_yarn_ver="1.3.0"
if [ "$(printf "$req_yarn_ver\n$cur_yarn_ver" | sort -V | head -n1)" == "$cur_yarn_ver" ]; then
  echo ""
  echo "=============================="
  echo ""
  echo "[WHAT IS WRONG]"
  echo ""
  echo "Yarn version < ${req_yarn_ver}"
  echo ""
  echo "[HOW TO FIX]"
  echo ""
  echo "Upgrade or reinstall yarn. If you are using a Mac, \`brew install yarn\` is recommended"
  exit 1
fi

if [ -e ${repoRoot}/check.sh ]; then
  bash ${repoRoot}/check.sh
fi
