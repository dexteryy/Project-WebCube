#!/usr/bin/env node
const path = require('path');
const { removeSync, ensureDirSync } = require('fs-extra');
const program = require('commander');
const webpack = require('webpack');
const webpackConfig = require('../configs/webpack.config');
const webpackSsrConfig = require('../configs/webpack.config.ssr');
const { output, deploy } = require('../utils/custom');
const logger = require('../utils/logger');
const { getWebpackStats } = require('../utils/helpers');

program
  .option('-c --clean', 'Clean build results')
  .option('--only-clean', 'No build tasks, only clean build results')
  .option(
    '-p --profile',
    'Captures timing information for each step of the compilation and includes this in the output'
  )
  .option('-k --chunks', 'Show chunk information')
  .option('-a --assets', 'Show assets information')
  .option('-w --warnings', 'Show warnings')
  .option('-e --error-details', 'Show error details')
  .parse(process.argv);

// 8x slower
if (program.clean || program.onlyClean) {
  removeSync(output.staticRoot);
  logger.success(`Cleaned:`, output.staticRoot);
  removeSync(output.htmlRoot);
  logger.success(`Cleaned:`, output.htmlRoot);
  removeSync(output.buildRoot);
  logger.success(`Cleaned:`, output.buildRoot);
  if (program.onlyClean) {
    process.exit(0);
  }
}
ensureDirSync(path.join(output.buildRoot, 'manifest'));

logger.info(`Start building in "${deploy.mode}" mode`);

// https://webpack.js.org/api/node/
const compiler = webpack(webpackConfig);

// https://webpack.js.org/api/cli/#profiling
// https://github.com/webpack/webpack-cli/blob/faeec57c50e06facd67bcae71ffe5a65cf155893/bin/cli.js#L456
// argv.progress + argv.profile
new webpack.ProgressPlugin({ profile: program.profile }).apply(compiler);

(async () => {
  await new Promise(resolve => {
    compiler.run((err, stats) => {
      // https://github.com/webpack/webpack-cli/blob/faeec57c50e06facd67bcae71ffe5a65cf155893/bin/cli.js#L477
      // compilerCallback
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        logger.fail();
      }
      console.info(
        stats.toString(
          getWebpackStats({
            assets: Boolean(program.assets),
            entrypoints: Boolean(program.assets),
            chunks: program.chunks,
            warnings: Boolean(program.warnings),
            errorDetails: Boolean(program.errorDetails),
          })
        )
      );
      if (stats.hasErrors()) {
        logger.fail();
      } else {
        logger.success();
      }
      resolve();
    });
  });
  if (deploy.mode === 'ssr') {
    logger.info('Start building SSR code...');
    webpack(webpackSsrConfig, (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        logger.fail();
      }
      console.info(
        stats.toString(
          getWebpackStats({
            assets: false,
            entrypoints: false,
            chunks: false,
            warnings: Boolean(program.warnings),
            errorDetails: Boolean(program.errorDetails),
          })
        )
      );
      if (stats.hasErrors()) {
        logger.fail();
      } else {
        logger.success();
      }
    });
  }
})();
