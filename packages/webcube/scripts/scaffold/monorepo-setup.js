#!/usr/bin/env node
const path = require('path');
const { cd, mkdir, cp } = require('shelljs');
const { projectPath, modulePath } = require('../../utils/beforeEnvConfig');

cd(projectPath);
mkdir('-p', 'app/common', 'staticweb');

cp('-r', path.join(modulePath, 'templates/configs'), './');
cp(path.join(modulePath, 'configs/env.sample.config'), 'env.config');

cp(path.join(modulePath, 'templates/root/Dockerfile'), './');
cp(path.join(modulePath, 'templates/root/dockerignore'), './');
cp(path.join(modulePath, 'templates/root/gitignore'), './.gitignore');
cp(path.join(modulePath, 'templates/root/README.md'), './');

cp(path.join(modulePath, '.htmlhintrc'), 'staticweb/.htmlhintrc');

cp(
  path.join(modulePath, 'templates/monorepo/eslintrc.src.json'),
  './app/.eslintrc.json'
);
cp(
  path.join(modulePath, 'templates/monorepo/eslintrc.staticweb.json'),
  './staticweb/.eslintrc.json'
);
