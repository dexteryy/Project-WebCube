#!/bin/sh
(
  webcube-stop-staticserver
) && (
  webcube-devserver
)
