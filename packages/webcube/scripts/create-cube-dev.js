#!/usr/bin/env node
const path = require('path');
const { removeSync, ensureDirSync } = require('fs-extra');
const program = require('commander');
const serve = require('webpack-serve');
const convert = require('koa-connect');
const compression = require('compression');
const history = require('connect-history-api-fallback');
const webpackServeWaitpage = require('webpack-serve-waitpage');
const webpackConfig = require('../configs/webpack.config');
const { dev, output } = require('../utils/custom');
// const logger = require('../utils/logger');
const { getWebpackStats } = require('../utils/helpers');
const logger = require('../utils/logger');

program
  .option('-k --chunks', 'Show chunk information')
  .option('-a --assets', 'Show assets information')
  .option('-w --warnings', 'Show warnings')
  .option('-e --error-details', 'Show error details')
  .parse(process.argv);

removeSync(output.staticRoot);
logger.success(`Cleaned:`, output.staticRoot);
removeSync(output.htmlRoot);
logger.success(`Cleaned:`, output.htmlRoot);
removeSync(output.buildRoot);
logger.success(`Cleaned:`, output.buildRoot);
ensureDirSync(path.join(output.buildRoot, 'manifest'));

const PORT = process.env.PORT || dev.port;

const newWebpackConfig = Object.assign({}, webpackConfig);
// disable BundleAnalyzerPlugin
newWebpackConfig.plugins = newWebpackConfig.plugins.slice(1);

// https://www.npmjs.com/package/webpack-serve
// https://github.com/shellscape/koa-webpack
serve(
  {
    // https://github.com/webpack-contrib/webpack-serve/tree/32563f5e721f28c69f5337181bddd2db323526c7/docs/addons/reuse-chrome-tab
    // open: true,
  },
  {
    port: PORT,
    config: newWebpackConfig,
    content: [output.htmlRoot, output.staticRoot],
    clipboard: false,
    // https://github.com/webpack/webpack-dev-middleware#options
    devMiddleware: {
      stats: getWebpackStats({
        assets: Boolean(program.assets),
        entrypoints: Boolean(program.assets),
        chunks: Boolean(program.chunks),
        warnings: Boolean(program.warnings),
        errorDetails: Boolean(program.errorDetails),
      }),
      // logTime: true,
      headers: dev.server.headers,
      writeToDisk: true,
    },
    // https://github.com/webpack-contrib/webpack-hot-client#options
    hotClient: {
      // https://github.com/webpack-contrib/webpack-hot-client#automagical-configuration
      // https://github.com/webpack-contrib/webpack-hot-client/issues/60#issuecomment-389232617
      allEntries: true,
      autoConfigure: true,
      hmr: true,
      reload: true,
      logLevel: 'trace',
    },
    // https://github.com/webpack/webpack-dev-middleware/blob/master/lib/reporter.js
    // reporter,
    // https://www.npmjs.com/package/webpack-serve#add-on-features
    add: (app, middleware, options) => {
      app.use(
        // https://www.npmjs.com/package/webpack-serve-waitpage
        webpackServeWaitpage(options, {
          theme: 'dark',
          // disableWhenValid: false,
        })
      );
      // https://github.com/webpack-contrib/webpack-serve/blob/HEAD/docs/addons/history-fallback.config.js
      app.use(
        convert(
          history({
            rewrites: dev.server.rewrites,
          })
        )
      );
      // https://github.com/webpack-contrib/webpack-serve/blob/32563f5e721f28c69f5337181bddd2db323526c7/docs/addons/compress/express-compress.config.js
      app.use(convert(compression()));
    },
  }
).then(server => {
  // https://www.npmjs.com/package/webpack-serve#events
  server.on('compiler-warning', () => {
    if (!program.warnings) {
      logger.warn('There is a hidden warning. Use `-w` to see details');
    }
  });
});
