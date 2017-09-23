#!/usr/bin/env node
const path = require('path');
const { cd, cp } = require('shelljs');
const { rootPath, modulePath } = require('../../utils/beforeEnvConfig');

cd(rootPath);

// migration
// cp('configs/env.sample.config', 'configs/env.sample.config.backup');
// cp(path.join(modulePath, 'templates/configs/env.sample.config'), 'configs/');
// cp('.eslintrc.json', '.eslintrc.json.backup');
// cp(path.join(modulePath, 'boilerplate/.eslintrc.json'), './');

// unconditional override
cp(path.join(modulePath, 'templates/root/Dockerfile'), './');
cp(path.join(modulePath, '.htmlhintrc'), 'staticweb/.htmlhintrc');
cp(path.join(modulePath, '.eslintrc.json'), 'configs/');
