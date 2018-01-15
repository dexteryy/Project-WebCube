#!/bin/bash
repoRoot="."
if [[ -e $npm_package_config_webcube_monorepo_root ]]; then
  repoRoot="${npm_package_config_webcube_monorepo_root}"
fi

project_version="4.0"

if [ -e "${repoRoot}/.project-version" ] && [[ "$(cat "${repoRoot}/.project-version")" == $project_version ]]; then
  exit 0
fi
echo ""
echo "=============================="
echo ""
echo "[WHAT IS WRONG]"
echo ""
echo "Outdated './node_modules/'."
echo ""
echo "[HOW TO FIX]"
echo ""
echo "Please run \`npm run update\` to reinstall dependencies"
exit 1
