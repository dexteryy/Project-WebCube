const { merge, union } = require('lodash');
const { config, custom } = require('./base');
const deploy = require('./deploy');

const { srcRoot, configRoot } = config;

if (!custom.webpack) {
  custom.webpack = {};
}

const webpack = merge(
  {
    // https://webpack.js.org/configuration/resolve/
    resolve: {
      // https://webpack.js.org/configuration/resolve/#resolve-alias
      alias: {
        app: srcRoot,
        src: srcRoot,
        config: configRoot,
      },
      // https://webpack.js.org/configuration/resolve/#resolve-extensions
      extensions: [
        // .mjs must be put before .js
        // https://github.com/graphql/graphql-js/issues/1272#issuecomment-404154877
        '.mjs',
        '.mjsx',
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.es6',
        '.wasm',
        '.json',
      ],
      // https://webpack.js.org/configuration/resolve/#resolve-mainfields
      // https://webpack.js.org/configuration/resolve/#resolve-modules
      // @BUG import { merge } from 'lodash'
      // mainFields:['webcube:module', 'module',...],
    },
    // https://webpack.js.org/configuration/module/#module-noparse
    // noParse: undefined,
    disabledLoaders: {
      js: false,
      workerize: false,
      i18next: false,
      css: false,
      scss: false,
      less: false,
      image: false,
      font: false,
      media: false,
      yaml: false,
      gql: false,
      txt: false,
      html: false,
      markdown: false,
      json: false,
      toml: false,
      csv: false,
      xml: false,
      handlebars: false,
    },
    moduleRules: [],
    // https://webpack.js.org/plugins/define-plugin/
    injectedGlobalVars: {},
  },
  custom.webpack
);

const globalVars = {};
Object.keys(webpack.injectedGlobalVars).forEach(key => {
  globalVars[key] = JSON.stringify(webpack.injectedGlobalVars[key]);
});
webpack.injectedGlobalVars = globalVars;

webpack.exposedEnv = {};
union(['NODE_ENV'], custom.webpack.exposedEnv).forEach(name => {
  webpack.exposedEnv[name] = JSON.stringify(process.env[name]);
});
webpack.exposedEnv.DEPLOY_MODE = JSON.stringify(deploy.mode);
webpack.exposedEnv.REACT_SPINKIT_NO_STYLES = JSON.stringify(true);

module.exports = webpack;
