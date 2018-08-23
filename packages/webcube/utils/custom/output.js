const path = require('path');
const { merge } = require('lodash');
const logger = require('../logger');
const { config, custom } = require('./base');

const { projectPath } = config;

if (!custom.output) {
  custom.output = {};
}

const output = merge(
  {
    htmlRoot: 'build/public',
    staticRoot: 'build/public/static',
    buildRoot: 'build',
    appMountIds: [],
    // https://webpack.js.org/plugins/split-chunks-plugin/#defaults
    // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
    maxInitialRequests: 2,
    chunkDelimiter: '~',
    maxEntrypointSize: 250000,
    maxAssetSize: 1000000,
    enableUglify: false,
    enableInlineSource: false,
    disableCssExtract: false,
    disableAllChunksPreload: false,
    disableInitialPreload: false,
    disableWorkbox: false,
    development: {
      jsRoot: 'js',
      cssRoot: 'css',
      assetRoot: 'assets',
      disableCache: true,
      disableMinimize: true,
      disableSourceMap: false,
      enableSourceMapOptimize: false,
    },
    production: {
      jsRoot: 'js',
      cssRoot: 'css',
      assetRoot: 'assets',
      disableCache: false,
      disableMinimize: false,
      disableSourceMap: false,
      enableSourceMapOptimize: false,
    },
  },
  custom.output
);

if (path.isAbsolute(output.htmlRoot) || path.isAbsolute(output.staticRoot)) {
  logger.fail('Do not use absolute path for `htmlRoot` or `staticRoot`');
}
output.htmlRoot = path.join(projectPath, output.htmlRoot);
output.staticRoot = path.join(projectPath, output.staticRoot);
output.buildRoot = path.join(projectPath, output.buildRoot);
if (output.htmlRoot === projectPath) {
  logger.fail('`htmlRoot` cannot be the project directory');
}
if (output.staticRoot === projectPath) {
  logger.fail('`staticRoot` cannot be the project directory');
}
if (output.buildRoot === projectPath) {
  logger.fail('`buildRoot` cannot be the project directory');
}

module.exports = output;
