#!/bin/sh
(
  npm run clear:deps
) && (
  lerna bootstrap
)
