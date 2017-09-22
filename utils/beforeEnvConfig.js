const path = require('path');

// export const rootPath = path.join(__dirname, '../../../');
// export const modulePath = path.join(rootPath, 'node_modules/webcube/');
const rootPath = path.join(__dirname, '../../..');
const modulePath = path.join(rootPath, 'node_modules/webcube');
const buildPath = modulePath;
// export const rootPath = path.join(__dirname, '../../');
// export const modulePath = path.join(rootPath, 'webcube/');

module.exports = {
  rootPath,
  modulePath,
  buildPath,
};
