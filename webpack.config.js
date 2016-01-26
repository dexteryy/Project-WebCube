
import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import AssetsPlugin from 'assets-webpack-plugin';

module.exports = {
  entry: {
    common: ['babel-polyfill', 'whatwg-fetch', 'react'],
    app: ['babel-polyfill', 'entries/app/entry.js'],
  },
  output: {
    filename: 'js/[hash]/[name].js',
    chunkFilename: 'js/[hash]/[name].js',
    path: path.join(__dirname, 'public/static/'),
    publicPath: process.env.NODE_ENV === 'production'
      ? 'http://cdn.example.com/assets/'
      : '/static/',
  },
  resolve: {
    root: [
      path.join(__dirname, 'src'),
    ],
    alias: {
      app: path.join(__dirname, 'src'),
      assets: path.join(__dirname, 'assets'),
      data: path.join(__dirname, 'data'),
    },
    modulesDirectories: ['node_modules'],
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
      test: /\.json$/,
      loader: 'file?name=data/[hash]/[name].[ext]',
    }, {
      test: /\.(gif|png|jpe?g|svg)$/i,
      loaders: [
        'url?limit=25000&name=assets/[hash]/[name].[ext]',
        ((opt) => {
          return `image-webpack?${opt}`;
        })({
          progressive: true,
          optimizationLevel: 7,
          interlaced: false,
          pngquant: {
            quality: '65-90',
            speed: 4,
          },
        }),
      ],
    }, {
      test: /\.woff$/,
      loader: 'url?limit=100000&name=assets/[hash]/[name].[ext]',
    }],
  },
  postcss() {
    return [autoprefixer];
  },
  plugins: [
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
    }),
    new AssetsPlugin({
      filename: 'rev-version.json',
      fullPath: true,
      prettyPrint: true,
    }),
  ],
};
