
const path = require('path');

module.exports = {
  entry: {
    'flip-api-perf': 'flip-api-perf/entry.js',
    temp: 'temp/entry.js',
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '../static/js/'
  },
  resolve: {
    root: [
      path.join(__dirname, 'js')
    ],
    modulesDirectories: ['node_modules']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      query: {
        cacheDirectory: true,
        presets: ['react', 'es2015', 'stage-2']
      }
    }],
  }
};
