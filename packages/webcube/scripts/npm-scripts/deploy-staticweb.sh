#!/bin/sh

(
  DEPLOY_MODE=staticweb NODE_ENV=production webcube-build
) && (
  webcube-upload-staticweb-assets
) && (
  webcube-upload-staticweb-html
)
