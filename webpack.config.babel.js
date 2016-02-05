
import path from 'path';
import webpack from 'webpack';
// import ExtractTextPlugin from 'extract-text-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import cssnext from 'postcss-cssnext';
import postcssReporter from 'postcss-reporter';

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

// https://github.com/ai/browserslist#queries
const browsers = ['last 2 versions', 'ie 10'];
// const browsers = ['> 5%', 'last 2 versions', 'Firefox ESR', 'not ie <= 8'];
// const browsers = ['ie 6-8', 'opera 12.1', 'ios 6', 'android 4'];

const cssLoaderConfig = JSON.stringify({
  modules: true,
  importLoaders: 1,
  localIdentName: '[name]__[local]___[hash:base64:5]',
  sourceMap: !isProductionEnv,
  // https://github.com/webpack/css-loader#minification
  // https://github.com/webpack/css-loader/blob/master/lib/processCss.js
  minimize: isProductionEnv,
  // http://cssnano.co/options/
  // https://github.com/ben-eb/cssnano/blob/master/index.js
  // https://github.com/postcss/autoprefixer#options
  autoprefixer: {
    browsers,
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
});

module.exports = {
  entry: entries,
  output: {
    filename: isProductionEnv
      ? 'js/[hash]/[name].js'
      : 'js/[name].js',
    chunkFilename: isProductionEnv
      ? 'js/[hash]/[name].js'
      : 'js/[name].js',
    path: path.join(__dirname, 'build/public/static/'),
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
      src: path.join(__dirname, 'src'), // only for outside or `src/`
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
        return `style?singleton!css?${cssOpt}!postcss!sass`;
        // return ExtractTextPlugin.extract('style', `css?${cssOpt}!postcss!sass`);
      })(cssLoaderConfig),
    }, {
      test: /\.css$/,
      loader: ((cssOpt) => {
        return `style?singleton!css?${cssOpt}!postcss`;
        // return ExtractTextPlugin.extract('style', `css?${cssOpt}!postcss`);
      })(cssLoaderConfig),
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
      test: /\.(woff|woff2|ttf|eot)$/,
      loader: isProductionEnv
        ? 'url?limit=100000&name=assets/[hash]/[name].[ext]'
        : 'url?limit=100000&name=assets/[name].[ext]',
    }],
  },
  // https://www.npmjs.com/package/postcss-loader
  postcss() {
    return [
      cssnext({
        browsers,
        features: {
          autoprefixer: false,
        },
      }),
      postcssReporter(),
    ];
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
    // https://www.npmjs.com/package/extract-text-webpack-plugin
    // new ExtractTextPlugin(isProductionEnv
    //   ? 'css/[contenthash]/[name].css'
    //   : 'css/[name].css', { allChunks: true }),
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
