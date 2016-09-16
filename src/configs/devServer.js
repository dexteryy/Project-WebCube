/* eslint no-undefined: 0 */

import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
// import express from 'express';
import DashboardPlugin from 'webpack-dashboard/plugin';
import {
  isProductionEnv,
  deployMode,
  liveMode,
  serverPort,
  serverHost,
  rootPath,
  staticRoot,
} from '../utils';
import webpackConfig from './webpack.default.config.babel.js';

// https://github.com/FormidableLabs/webpack-dashboard
webpackConfig.plugins.push(
  new DashboardPlugin({ port: process.env.WEBCUBE_DEVSERVER_DASHBOARD_PORT })
);

if (isProductionEnv) {
  throw new Error('Don\'t use webpack-dev-server for production env');
}

const compiler = webpack(webpackConfig);
const devServerConfig = {
  contentBase: path.join(rootPath, 'staticweb'),
  publicPath: deployMode === 'staticweb'
    ? process.env.WEBCUBE_DEPLOY_STATIC_ROOT
    : `/${staticRoot}/`,
  hot: liveMode === 'hmr',
  historyApiFallback: process.env.WEBCUBE_DEVSERVER_HISTORYAPI === '1',
  noInfo: process.env.WEBCUBE_DEVSERVER_NOINFO === '1',
  watchOptions: {
    aggregateTimeout: process.env.WEBCUBE_DEVSERVER_WATCH_TIMEOUT || 300,
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

server.listen(serverPort, serverHost, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening at http://${serverHost}:${serverPort}`);
});
