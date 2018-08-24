#!/bin/bash

clear-locks() {
  rm yarn.lock package-lock.json 2>/dev/null || true
}

clear-deps() {
  (
    npx lerna clean --yes 2>/dev/null
  ) || true && (
    rm -rf ./node_modules yarn-error.log lerna-debug.log 2>/dev/null
  ) ||  true && (
    npx lerna exec --bail=false -- rm yarn.lock package-lock.json yarn-error.log 2>/dev/null
  ) || true && (
    rm .git/hooks/pre-commit 2>/dev/null
  ) || true
}

update() {
  yarn install && npx lerna run prepare
}

if [[ $1 == "-c" ]] || [[ $1 == "--clean-lock" ]]; then
  clear-locks && clear-deps && update
else
  clear-deps && update
fi
