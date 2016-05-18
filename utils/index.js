
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '..', 'env.config'),
});

export const isCloudEnv = process.env.NODE_ENV === 'cloud';
export const isProductionEnv = isCloudEnv || process.env.NODE_ENV === 'production';
export const liveMode = (process.env.LIVE_MODE || '').toLowerCase();
export const serverPort = process.env.APP_DEVSERVER_PORT || 8000;
export const serverHost = process.env.APP_DEVSERVER_HOST || 'localhost';

export function getUrlRoot() {
  const isCloudEnv = process.env.NODE_ENV === 'cloud';
  const myhost = process.env.APP_DEVSERVER_HOST;
  const myport = process.env.APP_DEVSERVER_PORT;
  return isCloudEnv
    ? process.env.APP_DEPLOY_STATIC_HTML_ROOT.replace(/\/+$/, '')
    : `http://${myhost}:${myport}`;
}
