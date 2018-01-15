#!/bin/bash
(
  webcube-check
) && (
  webcube-stop-staticserver
) && (
  webcube-devserver
)
