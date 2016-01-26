
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
    alias: {
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
      test: /\.(gif|png|jpe?g|svg)$/i,
      loaders: [
        'url?limit=25000',
        'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
      ],
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
