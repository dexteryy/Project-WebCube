
import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';

const isProductionEnv = process.env.NODE_ENV === 'production';
const serverPort = process.env.MYAPP_SERVER_PORT || 8000;
const serverHost = process.env.MYAPP_SERVER_HOST || 'localhost';
const liveMode = (process.env.LIVE_MODE || '').toLowerCase();

const entries = {
  // http://christianalfoni.github.io/react-webpack-cookbook/Split-app-and-vendors.html
  // common: ['whatwg-fetch', 'react'],
  app: ['./containers/app/deploy.js'],
  /* DO NOT MODIFY THIS! NEW ENTRY WILL BE AUTOMATICALLY APPENDED TO HERE */
};

for (const entry in entries) {
  entries[entry].unshift('babel-polyfill');
  if (liveMode === 'refresh') {
    // http://webpack.github.io/docs/webpack-dev-server.html#inline-mode
    entries[entry].unshift(`webpack-dev-server/client?http://${serverHost}:${serverPort}`);
  } else if (liveMode === 'hmr') {
    // https://www.npmjs.com/package/webpack-hot-middleware
    entries[entry].unshift('webpack-hot-middleware/client');
  }
}

module.exports = {
  entry: entries,
  output: {
    filename: isProductionEnv
      ? 'js/[hash]/[name].js'
      : 'js/[name].js',
    chunkFilename: isProductionEnv
      ? 'js/[hash]/[name].js'
      : 'js/[name].js',
    path: path.join(__dirname, 'public/static/'),
    publicPath: isProductionEnv
      ? process.env.MYAPP_CDN_PREFIX
      : '/static/',
  },
  resolve: {
    root: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'container'),
    ],
    alias: {
      app: path.join(__dirname, 'src'), // only for outside or `src/`
      data: path.join(__dirname, 'data'), // only for outside or `src/`
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
      loader: ((cssOpt) => {
        return `style!css?${cssOpt}!postcss!sass`;
      })(JSON.stringify({
        // https://github.com/webpack/css-loader#minification
        // https://github.com/webpack/css-loader/blob/master/lib/processCss.js
        minimize: true,
        // http://cssnano.co/options/
        // https://github.com/ben-eb/cssnano/blob/master/index.js
        // https://github.com/postcss/autoprefixer#options
        autoprefixer: {
          // https://github.com/ai/browserslist#queries
          browsers: ['> 5%', 'last 2 versions', 'Firefox ESR', 'not ie <= 8'],
          // https://github.com/postcss/autoprefixer#outdated-prefixes
          remove: false,
          add: true,
          cascade: false,
        },
        discardComments: {
          removeAll: true,
        },
        discardUnused: true,
        mergeIdents: true,
        // zindex: true,
        // normalizeUrl: true,
        // reduceIdents: true,
      })),
    }, {
      test: /\.css$/,
      loader: 'style!css',
    }, {
      test: /\.json$/,
      // https://www.npmjs.com/package/file-loader
      loader: isProductionEnv
        ? 'file?name=data/[hash]/[name].[ext]'
        : 'file?name=data/[name].[ext]',
    }, {
      test: /\.(gif|png|jpe?g|svg)$/i,
      loaders: [
        // https://www.npmjs.com/package/url-loader
        isProductionEnv
          ? 'url?limit=25000&name=assets/[hash]/[name].[ext]'
          : 'url?limit=25000&name=assets/[name].[ext]',
        // https://www.npmjs.com/package/image-webpack-loader
        ((imageOpt) => {
          return `image-webpack?${imageOpt}`;
        })(JSON.stringify({
          progressive: true,
          optimizationLevel: 7,
          interlaced: false,
          pngquant: {
            quality: '65-90',
            speed: 4,
          },
        })),
      ],
    }, {
      test: /\.woff$/,
      loader: isProductionEnv
        ? 'url?limit=100000&name=assets/[hash]/[name].[ext]'
        : 'url?limit=100000&name=assets/[name].[ext]',
    }],
  },
  // https://www.npmjs.com/package/postcss-loader
  postcss() {
    return [];
  },
  plugins: [
    // http://mts.io/2015/04/08/webpack-shims-polyfills/
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    }),
    // http://christianalfoni.github.io/react-webpack-cookbook/Split-app-and-vendors.html
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    // }),
    // https://www.npmjs.com/package/assets-webpack-plugin
    new AssetsPlugin({
      filename: 'rev-version.json',
      fullPath: true,
      prettyPrint: true,
    }),
    // https://github.com/glenjamin/webpack-hot-middleware
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
};
