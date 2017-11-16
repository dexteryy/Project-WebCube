#!/bin/sh
(
  webcube-stop-staticserver
) && (
  webpack-dashboard -- webcube-devserver
)
