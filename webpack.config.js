
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
    filename: '[hash]/[name].js',
    chunkFilename: '[hash]/[name].js',
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
    extensions: ['', '.js', '.jsx', '.json', '.css', '.scss', '.png', '.jpg', '.jpeg', 'gif', 'svg'],
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
      loader: 'file?name=[hash]/[name].[ext]',
    }, {
      test: /\.(gif|png|jpe?g|svg)$/i,
      loaders: [
        'file?limit=25000&name=[hash]/[name].[ext]',
        // 'url?limit=25000&name=[hash].[name].[ext]',
        'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
      ],
    }, {
      test: /\.woff$/,
      loader: 'url?limit=100000&name=[hash]/[name].[ext]',
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
