#!/bin/sh
(
  webcube-deploy-staticweb
) && (
  webcube-deploy-staticserver-push
)
