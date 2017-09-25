#!/bin/sh
(
  lerna clean --yes 2>/dev/null || true
) && (
  rm -rf ./node_modules 2>/dev/null || true
)
