const path = require('path');
const dotenv = require('dotenv');
const { rootPath, modulePath, buildPath } = require('./beforeEnvConfig');

dotenv.config({
  path: path.join(rootPath, 'env.config'),
});

const isCloudEnv = process.env.NODE_ENV === 'cloud'; // deprecated
const isProductionEnv = process.env.NODE_ENV === 'production' || isCloudEnv;
const isStagingEnv = process.env.DEPLOY_ENV === 'staging';
const deployMode = process.env.DEPLOY_MODE || (isCloudEnv && 'staticweb');
const liveMode = (process.env.LIVE_MODE || '').toLowerCase();
const DEFAULT_DEV_PORT = 8000;
const serverPort = process.env.WEBCUBE_DEVSERVER_PORT || DEFAULT_DEV_PORT;
const serverHost = process.env.WEBCUBE_DEVSERVER_HOST || 'localhost';
const staticRoot = isProductionEnv
  ? process.env.WEBCUBE_STATIC_ROOT
  : 'static-for-dev';
const cloudAdapter = require(`./staticcloud/${
  process.env.WEBCUBE_DEPLOY_STATIC_CLOUD
}`);

function getUrlRoot() {
  const myhost = process.env.WEBCUBE_DEVSERVER_HOST;
  const myport = process.env.WEBCUBE_DEVSERVER_PORT;
  const deployRoot = (
    (isStagingEnv && process.env.WEBCUBE_DEPLOY_STAGING_STATIC_HTML_ROOT) ||
    (isProductionEnv && process.env.WEBCUBE_DEPLOY_STATIC_HTML_ROOT) ||
    ''
  ).replace(/\/+$/, '');
  return deployMode === 'staticweb' ? deployRoot : `http://${myhost}:${myport}`;
}

module.exports = {
  rootPath,
  modulePath,
  buildPath,
  isCloudEnv,
  isProductionEnv,
  isStagingEnv,
  deployMode,
  liveMode,
  serverPort,
  serverHost,
  staticRoot,
  cloudAdapter,
  getUrlRoot,
};
