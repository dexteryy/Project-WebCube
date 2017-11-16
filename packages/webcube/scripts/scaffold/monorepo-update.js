#!/usr/bin/env node
const path = require('path');
const { cd, cp } = require('shelljs');
const { rootPath, modulePath } = require('../../utils/beforeEnvConfig');

cd(rootPath);

// unconditional override
cp(path.join(modulePath, 'templates/root/Dockerfile'), './');
cp(path.join(modulePath, '.htmlhintrc'), 'staticweb/.htmlhintrc');
