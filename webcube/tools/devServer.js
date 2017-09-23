#!/usr/bin/env node
/* eslint no-undefined: 0 */

const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
// import express from 'express';
const DashboardPlugin = require('webpack-dashboard/plugin');
const {
  isProductionEnv,
  isStagingEnv,
  deployMode,
  liveMode,
  serverPort,
  serverHost,
  rootPath,
  staticRoot,
} = require('../utils');
const webpackConfig = require('../configs/webpack.config');

// https://github.com/FormidableLabs/webpack-dashboard
webpackConfig.plugins.push(
  new DashboardPlugin({ port: process.env.WEBCUBE_DEVSERVER_DASHBOARD_PORT })
);

if (isProductionEnv) {
  throw new Error("Don't use webpack-dev-server for production env");
}

const compiler = webpack(webpackConfig);
// compiler.apply(new DashboardPlugin({ port: process.env.WEBCUBE_DEVSERVER_DASHBOARD_PORT }));
const DEFAULT_TIMEOUT = 300;
const devServerConfig = {
  contentBase: path.join(rootPath, 'staticweb'),
  publicPath:
    deployMode === 'staticweb'
      ? (isStagingEnv && process.env.WEBCUBE_DEPLOY_STAGING_STATIC_ROOT) ||
        process.env.WEBCUBE_DEPLOY_STATIC_ROOT
      : `/${staticRoot}/`,
  hot: liveMode === 'hmr',
  historyApiFallback: process.env.WEBCUBE_DEVSERVER_HISTORYAPI === '1',
  noInfo: process.env.WEBCUBE_DEVSERVER_NOINFO === '1',
  watchOptions: {
    aggregateTimeout:
      process.env.WEBCUBE_DEVSERVER_WATCH_TIMEOUT || DEFAULT_TIMEOUT,
    poll: process.env.WEBCUBE_DEVSERVER_WATCH_POLL || undefined,
  },
  stats: {
    colors: process.env.WEBCUBE_DEVSERVER_STATS_COLOR === '1',
  },
};

function getDevServer() {
  return new WebpackDevServer(compiler, devServerConfig);
}

// function getHotDevServer() {
//   return express()
//     .use(require('webpack-dev-middleware')(compiler, devServerConfig))
//     .use(require('webpack-hot-middleware')(compiler))
//     .get('*', function (req, res) {
//       res.sendFile(path.join(__dirname,
//         'staticweb', req.params[0], 'index.html'));
//     });
// }

// const server = liveMode === 'hmr'
//   ? getHotDevServer() : getDevServer();

const server = getDevServer();

server.listen(serverPort, serverHost, err => {
  if (err) {
    throw err;
  }
  console.info(`Listening at http://${serverHost}:${serverPort}`);
});
