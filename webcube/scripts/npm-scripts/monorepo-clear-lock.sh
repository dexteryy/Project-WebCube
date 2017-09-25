#!/bin/sh
(
  lerna exec -- rm yarn.lock package-lock.json 2>/dev/null || true
) && (
  rm yarn.lock package-lock.json 2>/dev/null || true
)
