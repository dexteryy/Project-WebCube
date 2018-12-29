#!/usr/bin/env node
const path = require('path');
const { removeSync } = require('fs-extra');
const program = require('commander');
const logger = require('webcube/utils/logger');
const { projectPath, buildRoot } = require('../utils/custom');
const { runCmd } = require('../utils/helpers');

program
  .option('-c --clean', 'Clean build results')
  .option('--only-clean', 'No build tasks, only clean build results')
  .parse(process.argv);

if (program.clean || program.onlyClean) {
  removeSync(buildRoot);
  logger.success(`Cleaned:`, buildRoot);
  if (program.onlyClean) {
    process.exit(0);
  }
}

(async () => {
  await runCmd(
    `node ${path.join(__dirname, '../node_modules/.bin/babel')} ${path.join(
      projectPath,
      'src'
    )} --out-dir ${path.join(projectPath, buildRoot)} --config-file=${path.join(
      __dirname,
      '../configs/babel.config.js'
    )} --source-maps`,
    { quiet: true }
  );
})();
