#!/usr/bin/env node
const path = require('path');
const { cd, cp, exit } = require('shelljs');
const { rootPath, modulePath } = require('../../utils/beforeEnvConfig');

if (cd(rootPath).code !== 0) {
  exit(1);
}

// migration
// cp('configs/env.sample.config', 'configs/env.sample.config.backup');
// cp(path.join(modulePath, 'templates/configs/env.sample.config'), 'configs/');
// cp('.eslintrc.json', '.eslintrc.json.backup');
// cp(path.join(modulePath, 'boilerplate/.eslintrc.json'), './');
// cp('.vscode/settings.json', '.vscode/settings.json.backup');
// cp(path.join(modulePath, 'templates/root/vscode/settings.json'), '.vscode/');

// unconditional override
cp(path.join(modulePath, 'templates/root/Dockerfile'), './');
cp(path.join(modulePath, '.htmlhintrc'), 'staticweb/.htmlhintrc');
cp(path.join(modulePath, '.eslintrc.json'), 'configs/');
cp(path.join(modulePath, '.editorconfig'), './');
