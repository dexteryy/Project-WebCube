#!/usr/bin/env node
const path = require('path');
const { cd, cp, exit } = require('shelljs');
const { projectPath, modulePath } = require('../../utils/beforeEnvConfig');

if (cd(projectPath).code !== 0) {
  exit(1);
}

// unconditional override
cp(path.join(modulePath, 'templates/root/Dockerfile'), './');
cp(path.join(modulePath, '.htmlhintrc'), 'staticweb/.htmlhintrc');
cp(path.join(modulePath, '.eslintrc.json'), './');
cp(path.join(modulePath, '.editorconfig'), './');
