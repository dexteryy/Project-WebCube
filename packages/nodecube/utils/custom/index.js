const fs = require('fs');
const path = require('path');
const { merge } = require('lodash');
const cosmiconfig = require('cosmiconfig');
const dotenv = require('dotenv');

const projectPath = process.cwd();
const pkg = require(path.join(projectPath, `package.json`));
const projectName = pkg.name;
const projectVersion = pkg.version;
const { config: customConfig } = cosmiconfig('nodecube').searchSync() || {};
let envConfigPath = path.join(projectPath, 'env.ini');
if (!fs.existsSync(envConfigPath)) {
  envConfigPath = path.join(projectPath, '.env');
}
if (fs.existsSync(envConfigPath)) {
  dotenv.config({
    path: envConfigPath,
  });
}

const custom = merge(
  {
    projectName,
    projectVersion,
    buildRoot: 'build',
  },
  customConfig
);

const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
const isProductionEnv = process.env.NODE_ENV === 'production';
const nodecubePath = custom.nodecubePath
  ? path.resolve(projectPath, custom.nodecubePath)
  : path.join(__dirname, '../../');
const rootPath = custom.rootPath
  ? path.join(projectPath, custom.rootPath)
  : path.join(nodecubePath, '../../');

module.exports = {
  ...custom,
  mode,
  isProductionEnv,
  projectPath,
  nodecubePath,
  rootPath,
};
