
import dotenv from 'dotenv';
import path from 'path';

// export const rootPath = path.join(__dirname, '../../../');
// export const modulePath = path.join(rootPath, 'node_modules/webcube/');
export const rootPath = path.join(__dirname, '../../..');
export const modulePath = path.join(rootPath, 'node_modules/webcube');
export const buildPath = modulePath;
// export const rootPath = path.join(__dirname, '../../');
// export const modulePath = path.join(rootPath, 'webcube/');

dotenv.config({
  path: path.join(rootPath, 'env.config'),
});

export const isCloudEnv = process.env.NODE_ENV === 'cloud'; // deprecated
export const isProductionEnv = process.env.NODE_ENV === 'production' || isCloudEnv;
export const isStagingEnv = process.env.DEPLOY_ENV === 'staging';
export const deployMode = process.env.DEPLOY_MODE || isCloudEnv && 'staticweb';
export const liveMode = (process.env.LIVE_MODE || '').toLowerCase();
export const serverPort = process.env.WEBCUBE_DEVSERVER_PORT || 8000;
export const serverHost = process.env.WEBCUBE_DEVSERVER_HOST || 'localhost';
export const staticRoot = isProductionEnv
  ? process.env.WEBCUBE_STATIC_ROOT
  : 'static-for-dev';
export const cloudAdapter = require(`./staticcloud/${process.env.WEBCUBE_DEPLOY_STATIC_CLOUD}`);

export function getUrlRoot() {
  const myhost = process.env.WEBCUBE_DEVSERVER_HOST;
  const myport = process.env.WEBCUBE_DEVSERVER_PORT;
  const deployRoot = (
    isStagingEnv && process.env.WEBCUBE_DEPLOY_STAGING_STATIC_HTML_ROOT
    || isProductionEnv && process.env.WEBCUBE_DEPLOY_STATIC_HTML_ROOT
    || ''
  ).replace(/\/+$/, '');
  return (deployMode === 'staticweb' || deployMode === 'staticserver')
    && deployRoot
    || `http://${myhost}:${myport}`;
}
