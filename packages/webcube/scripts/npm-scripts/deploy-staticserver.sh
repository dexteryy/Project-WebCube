#!/bin/bash
(
  webcube-deploy-staticweb
) && (
  webcube-deploy-staticserver-push
)
