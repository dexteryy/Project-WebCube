const path = require('path');

function trimPath(p = '') {
  return p.replace(/^\.*\//, '').replace(/\/$/, '');
}

// export const rootPath = path.join(__dirname, '../../../');
// export const modulePath = path.join(rootPath, 'node_modules/webcube/');
const modulePath = path.join(__dirname, '../');
let rootPath = path.join(modulePath, '../../');
const packagePath = trimPath(
  process.env.npm_package_config_webcube_monorepo_packagePath
);
if (packagePath) {
  const depth = packagePath.split('/').length;
  const parents = [];
  for (let i = 0; i < depth; i++) {
    parents.push('..');
  }
  rootPath = path.join(modulePath, parents.join('/'));
}
const projectPath = path.join(
  rootPath,
  trimPath(process.env.npm_package_config_webcube_monorepo_projectPath)
);
// export const rootPath = path.join(__dirname, '../../');
// export const modulePath = path.join(rootPath, 'webcube/');

module.exports = {
  rootPath,
  modulePath,
  projectPath,
};
