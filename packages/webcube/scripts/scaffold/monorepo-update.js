#!/usr/bin/env node
const path = require('path');
const { cd, cp } = require('shelljs');
const { projectPath, modulePath } = require('../../utils/beforeEnvConfig');

cd(projectPath);

// unconditional override
cp(path.join(modulePath, 'templates/root/Dockerfile'), './');
cp(path.join(modulePath, '.htmlhintrc'), 'staticweb/.htmlhintrc');
