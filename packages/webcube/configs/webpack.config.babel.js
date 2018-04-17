/* eslint-disable node/no-unsupported-features */

import path from 'path';
import _ from 'lodash';
import {
  mode,
  base,
  entries,
  output,
  dev,
  deploy,
  moduleLoader,
  moduleRules,
  cssModules,
  babel,
} from '../utils/custom';

const {
  rootPath,
  webcubePath,
  projectPath,
  srcRoot,
  staticRoot,
  configRoot,
} = base;

const isProductionEnv = mode === 'production';
function getDeployEnvConfig(field) {
  return deploy.env === 'production'
    ? deploy[field]
    : deploy[deploy.env][field];
}

// https://github.com/babel/babel-loader
// https://babeljs.io/blog/2017/09/12/planning-for-7.0
// https://babeljs.io/blog/2017/12/27/nearing-the-7.0-release
const babelOptions = {
  presets: [
    // https://github.com/babel/babel/tree/master/packages/babel-preset-env
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: babel.browsers,
          ...babel.platforms,
        },
        include: [],
        exclude: babel.excludePlugins,
        // https://webpack.js.org/migrate/3/#mixing-es2015-with-amd-and-commonjs
        modules: false,
        // https://babeljs.io/blog/2017/12/27/nearing-the-7.0-release#preset-env-usebuiltins-usage
        useBuiltIns: 'usage',
        shippedProposals: false,
        loose: babel.enableLooseMode,
        // https://github.com/babel/babel/tree/master/packages/babel-preset-env#forcealltransforms
        forceAllTransforms: output.enableUglify,
        debug: false,
      },
    ],
    // https://github.com/babel/babel/tree/master/packages/babel-preset-react
    ['@babel/preset-react', { development: !isProductionEnv }],
    babel.disableTypeScript ? '@babel/preset-flow' : '@babel/preset-typescript',
  ],
  plugins: babel.plugins,
  // node_modules/.cache/babel-loader
  cacheDirectory: true,
};

const styleLoaders = ({ importLoaders = 1 }) => [
  // https://github.com/webpack-contrib/style-loader
  {
    loader: 'style-loader',
    options: {
      hmr: !isProductionEnv,
      sourceMap: !isProductionEnv,
      convertToAbsoluteUrls: !isProductionEnv,
    },
  },
  // https://github.com/webpack-contrib/css-loader
  {
    loader: 'css-loader',
    options: {
      // https://github.com/webpack-contrib/css-loader#modules
      modules: !cssModules.disable,
      camelCase: !cssModules.disable && cssModules.enableCamelCase,
      localIdentName: '[name]__[local]___[hash:base64:5]',
      minimize: !output.disableMinimize && output.cssNano,
      sourceMap: !isProductionEnv,
      importLoaders,
    },
  },
  // https://github.com/postcss/postcss-loader
  {
    loader: 'postcss-loader',
    options: {},
  },
];

module.exports = {
  context: projectPath,
  entry: entries,
  output: {
    filename:
      isProductionEnv && !output.disableCache
        ? `${output.jsPath}/[name]_[chunkhash].js`
        : `${output.jsPath}/[name].js`,
    chunkFilename:
      isProductionEnv && !output.disableCache
        ? `${output.jsPath}/[name]_[chunkhash].js`
        : `${output.jsPath}/[name].js`,
    path: !output.customPath
      ? path.join(projectPath, `build/public/${staticRoot}/`)
      : path.join(rootPath, output.customPath),
    publicPath:
      deploy.mode === 'staticweb'
        ? getDeployEnvConfig('staticRoot')
        : deploy.staticRootUrl || `/${staticRoot}/`,
  },
  resolve: {
    alias: Object.assign(
      {
        app: path.join(projectPath, srcRoot),
        src: path.join(projectPath, srcRoot),
      },
      moduleLoader.alias
    ),
    extensions: moduleLoader.extensions,
    modules: ['node_modules'],
  },
  resolveLoader: {
    modules: ['node_modules'],
  },
  module: {
    noParse: moduleLoader.noParse,
    rules: [
      moduleLoader.js || {
        test: babel.disableTypeScript ? /\.jsx?$/ : /\.[jt]sx?$/,
        use: {
          loader: 'babel-loader',
          options: babelOptions,
          include: babel.include,
        },
      },
      ...moduleRules,
    ],
  },
};

/* eslint-enable node/no-unsupported-features */
