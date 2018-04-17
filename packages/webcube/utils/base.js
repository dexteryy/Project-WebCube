const path = require('path');

function trimPath(p = '') {
  return p.replace(/^\.*\//, '').replace(/\/$/, '');
}

// @TODO
const projectPath = process.cwd();
// const projectPath = path.join(
//   rootPath,
//   trimPath(process.env.npm_package_config_webcube_monorepo_projectPath)
// );
const webcubePath = path.join(__dirname, '../');
let rootPath = trimPath(process.env.npm_package_config_webcube_monorepo_root);
if (rootPath) {
  rootPath = path.join(projectPath, rootPath);
} else {
  rootPath = path.join(webcubePath, '../../');
  const packagePath = trimPath(
    process.env.npm_package_config_webcube_monorepo_packagePath
  );
  if (packagePath) {
    const depth = packagePath.split('/').length;
    const parents = [];
    for (let i = 0; i < depth; i++) {
      parents.push('..');
    }
    rootPath = path.join(webcubePath, parents.join('/'));
  }
}

module.exports = {
  rootPath,
  webcubePath,
  projectPath,
};
