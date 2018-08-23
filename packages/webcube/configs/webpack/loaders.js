const { merge } = require('lodash');
const { isProductionEnv, deploy, assets } = require('../../utils/custom');
const { getOutputConfig } = require('../../utils/helpers');

exports.fileLoader = {
  loader: 'file-loader',
  options: {
    name:
      getOutputConfig().assetRoot +
      (isProductionEnv && !getOutputConfig().disableCache
        ? '/[name]_[hash].[ext]'
        : '/[name].[ext]'),
  },
};

exports.assetLoader = merge({}, exports.fileLoader, {
  loader: 'url-loader',
  options: {
    limit: assets.dataUriLimit,
  },
});

exports.imageminLoaders =
  isProductionEnv && !getOutputConfig().disableMinimize && !assets.imagemin
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
    minimize: isProductionEnv && !getOutputConfig().disableMinimize,
    ...deploy.htmlMinifier,
  },
};
