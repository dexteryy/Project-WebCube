#!/usr/bin/env node
const path = require('path');
const { cd, mkdir, cp, exit } = require('shelljs');
const { rootPath, modulePath } = require('../../utils/beforeEnvConfig');

if (cd(rootPath).code !== 0) {
  exit(1);
}
mkdir('-p', 'app/common', 'staticweb');
cp('-r', path.join(modulePath, 'templates/configs'), './');
cp('configs/env.sample.config', 'env.config');
cp(path.join(modulePath, 'templates/root/Dockerfile'), './');
cp(path.join(modulePath, 'templates/root/dockerignore'), './');
cp(path.join(modulePath, 'templates/root/gitignore'), './.gitignore');
cp(path.join(modulePath, 'templates/root/README.md'), './');
cp('-r', path.join(modulePath, 'templates/root/vscode'), './.vscode');
cp(path.join(modulePath, '.htmlhintrc'), 'staticweb/.htmlhintrc');
cp(path.join(modulePath, 'boilerplate/.eslintrc.json'), './app/');
cp(path.join(modulePath, '.eslintrc.json'), './');
cp(path.join(modulePath, '.editorconfig'), './');
