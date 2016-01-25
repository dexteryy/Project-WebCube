
import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';

module.exports = {
  entry: {
    common: ['babel-polyfill', 'whatwg-fetch', 'react'],
    app: ['babel-polyfill', 'entries/app/entry.js'],
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/static/',
  },
  resolve: {
    root: [
      path.join(__dirname, 'src'),
    ],
    modulesDirectories: ['node_modules', 'assets', 'data'],
    extensions: ['', '.js', '.jsx'],
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      loader: 'babel',
      query: {
        cacheDirectory: true,
      },
    }, {
      test: /\.scss$/,
      loader: 'style!css!postcss!sass',
    }, {
      test: /\.css$/,
      loader: 'style!css',
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url?limit=25000',
    }, {
      test: /\.woff$/,
      loader: 'url?limit=100000',
    }],
  },
  postcss() {
    return [autoprefixer];
  },
  plugins: [
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    }),
    new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
  ],
};
