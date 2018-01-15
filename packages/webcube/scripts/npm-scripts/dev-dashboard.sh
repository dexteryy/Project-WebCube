#!/bin/bash
(
  webcube-stop-staticserver
) && (
  webpack-dashboard -- webcube-devserver
)
