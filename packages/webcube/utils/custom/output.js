const path = require('path');
const { merge, pick } = require('lodash');
const logger = require('../logger');
const { config, custom } = require('./base');

const { mode, projectPath } = config;

if (!custom.output) {
  custom.output = { override: {} };
}

const outputDefaults = {
  htmlRoot: 'build/public',
  staticRoot: 'build/public/static',
  buildRoot: 'build',
  jsRoot: 'js',
  cssRoot: 'css',
  assetRoot: 'assets',
  appMountIds: [],
  // https://webpack.js.org/plugins/split-chunks-plugin/#defaults
  // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
  // https://github.com/webpack/webpack/tree/master/examples/http2-aggressive-splitting/
  maxChunkSize: 1800 * 1000,
  minChunkSize: 500 * 1000,
  maxInitialRequests: 4,
  chunkDelimiter: '~',
  maxEntrypointSize: 5 * 1800 * 1000,
  maxAssetSize: 1800 * 1000,
  momentLocaleWhitelist: ['en-us', 'zh-cn'],
  enableForceTreeShaking: false,
  disableCache: true,
  disableMinimize: true,
  disableSourceMap: false,
  enableSourceMapOptimize: false,
  enableUserScalable: false,
  enableHeadInject: false,
  // https://github.com/webpack-contrib/uglifyjs-webpack-plugin/issues/355
  minimizer: 'terser',
  enableInlineSource: false,
  disableCssExtract: false,
  enablePreload: false,
  preloadInclude: 'initial',
  preloadBlacklist: [],
  disableWorkbox: false,
};

const output = merge(
  outputDefaults,
  pick(custom.output, Object.keys(outputDefaults))
);

delete output.override;
const override = merge(
  {
    production: {
      disableCache: false,
      disableMinimize: false,
    },
  },
  custom.output.override
);
const initializedOverride = {};
Object.keys(override).forEach(envName => {
  initializedOverride[envName] = merge({}, output, override[envName]);
});
output.override = initializedOverride;

output.env = process.env.OUTPUT_ENV || custom.output.env || mode;

const getOutputConfig = env => output.override[env || output.env] || output;

output.getOutputConfig = getOutputConfig;

function initRoots(outputConfig) {
  if (
    path.isAbsolute(outputConfig.htmlRoot) ||
    path.isAbsolute(outputConfig.staticRoot)
  ) {
    logger.fail('Do not use absolute path for `htmlRoot` or `staticRoot`');
  }
  outputConfig.htmlRoot = path.join(projectPath, outputConfig.htmlRoot);
  outputConfig.staticRoot = path.join(projectPath, outputConfig.staticRoot);
  outputConfig.buildRoot = path.join(projectPath, outputConfig.buildRoot);
  if (outputConfig.htmlRoot === projectPath) {
    logger.fail('`htmlRoot` cannot be the project directory');
  }
  if (outputConfig.staticRoot === projectPath) {
    logger.fail('`staticRoot` cannot be the project directory');
  }
  if (outputConfig.buildRoot === projectPath) {
    logger.fail('`buildRoot` cannot be the project directory');
  }
}

initRoots(output);
Object.keys(output.override).forEach(envName => {
  initRoots(output.override[envName]);
});

module.exports = output;
