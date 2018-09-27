const { merge } = require('lodash');
const { isProductionEnv, deploy, assets } = require('../../utils/custom');
const { getOutputConfig } = require('../../utils/helpers');

const output = getOutputConfig();

exports.fileLoader = {
  loader: 'file-loader',
  options: {
    name:
      output.assetRoot +
      (isProductionEnv && !output.disableCache
        ? '/[name]_[hash].[ext]'
        : '/[path][name].[ext]'),
  },
};

exports.assetLoader = merge({}, exports.fileLoader, {
  loader: 'url-loader',
  options: {
    limit: assets.dataUriLimit,
  },
});

exports.imageminLoaders =
  isProductionEnv && !output.disableMinimize && !assets.imagemin
    ? [
        {
          loader: 'image-webpack-loader',
          options: assets.imagemin,
        },
      ]
    : [];

exports.htmlLoader = {
  loader: 'html-loader',
  options: {
    minimize: isProductionEnv && !output.disableMinimize,
    ...deploy.htmlMinifier,
  },
};
