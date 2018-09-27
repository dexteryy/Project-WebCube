const path = require('path');
const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
  isProductionEnv,
  projectPath,
  webcubePath,
  mode,
  ssrEntries,
  webpack,
} = require('../utils/custom');
const {
  getDeployConfig,
  getOutputConfig,
  getWebpackStats,
} = require('../utils/helpers');
const rules = require('./webpack/rules');

const output = getOutputConfig();

const loaderRules = rules({ isSsrBuild: true });

module.exports = {
  mode,
  context: projectPath,
  entry: ssrEntries,
  output: {
    filename: `js/[name].js`,
    chunkFilename: `js/[name].js`,
    path: path.join(output.buildRoot, 'ssr'),
    publicPath: getDeployConfig().staticRoot,
  },
  resolve: webpack.resolve,
  resolveLoader: {
    modules: [path.join(webcubePath, 'node_modules'), 'node_modules'],
  },
  module: {
    noParse: webpack.noParse,
    rules: Array.prototype.concat
      .apply(
        [],
        Object.keys(loaderRules).map(ruleName => loaderRules[ruleName])
      )
      .concat(webpack.moduleRules),
  },
  target: 'node',
  externals: [
    // https://www.npmjs.com/package/webpack-node-externals
    // https://github.com/liady/webpack-node-externals/issues/39
    // https://webpack.js.org/configuration/externals/
    (context, request, callback) => {
      if (/^(?!app\/|src\/)[a-zA-Z0-9\-@]+$/.test(request)) {
        return callback(null, `require('${request}')`);
      }
      return callback();
    },
  ],
  devtool: false,
  stats: getWebpackStats(),
  performance: {
    hints: false,
  },
  optimization: {
    minimize: false,
    // concatenateModules: false,
  },
  plugins: [
    new DefinePlugin({
      ...webpack.injectedGlobalVars,
      'process.env': webpack.exposedEnv,
    }),
    ...(!output.disableCssExtract
      ? [
          new MiniCssExtractPlugin({
            filename:
              isProductionEnv && !output.disableCache
                ? `${output.cssRoot}/[name]_[contenthash].css`
                : `${output.cssRoot}/[name].css`,
            chunkFilename:
              isProductionEnv && !output.disableCache
                ? `${output.cssRoot}/[name]_[contenthash].css`
                : `${output.cssRoot}/[name].css`,
          }),
        ]
      : []),
  ],
};
