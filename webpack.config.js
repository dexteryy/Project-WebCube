
import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';

const isProductionEnv = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    // http://christianalfoni.github.io/react-webpack-cookbook/Split-app-and-vendors.html
    // common: ['babel-polyfill', 'whatwg-fetch', 'react'],
    app: ['babel-polyfill', 'entries/app'],
    'deploy-app': ['babel-polyfill', './containers/app/deploy.js'],
  },
  output: {
    filename: 'js/[hash]/[name].js',
    chunkFilename: 'js/[hash]/[name].js',
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
      loader: 'file?name=data/[hash]/[name].[ext]',
    }, {
      test: /\.(gif|png|jpe?g|svg)$/i,
      loaders: [
        // https://www.npmjs.com/package/url-loader
        'url?limit=25000&name=assets/[hash]/[name].[ext]',
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
      loader: 'url?limit=100000&name=assets/[hash]/[name].[ext]',
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
  ],
};
