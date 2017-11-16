const path = require('path');

// export const rootPath = path.join(__dirname, '../../../');
// export const modulePath = path.join(rootPath, 'node_modules/webcube/');
const modulePath = path.join(__dirname, '../');
const monorepoRoot = process.env.npm_package_config_webcube_monorepo_root;
const projectPath = process.env.npm_package_config_webcube_monorepo_project;
const rootPath = path.join(
  modulePath,
  monorepoRoot ? path.join(monorepoRoot, projectPath) : '../../'
);
const buildPath = modulePath;
// export const rootPath = path.join(__dirname, '../../');
// export const modulePath = path.join(rootPath, 'webcube/');

module.exports = {
  rootPath,
  modulePath,
  buildPath,
};
