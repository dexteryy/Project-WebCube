
import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import cssnext from 'postcss-cssnext';
import postcssReporter from 'postcss-reporter';
import * as util from '../utils';
import kebabCase from 'lodash/kebabCase';

const rootPath = path.join(process.cwd(), '../..');

const mutiplEntries = {};
for (const name in process.env) {
  const entryName = (/APP_ENTRY_([A-Z_]+)/.exec(name) || [])[1];
  if (entryName) {
    mutiplEntries[kebabCase(entryName)] = [process.env[name]];
  }
  const demoName = (/APP_(DEMO_[A-Z_]+)/.exec(name) || [])[1];
  if (demoName) {
    mutiplEntries[kebabCase(demoName)] = [process.env[name]];
  }
}

const entries = Object.assign({
  // http://christianalfoni.github.io/react-webpack-cookbook/Split-app-and-vendors.html
  common: (
    process.env.APP_ENABLE_COMMON_CHUNK
      && JSON.parse(process.env.APP_COMMON_CORE_MODULES || null)
      || []
  ).concat(JSON.parse(process.env.APP_COMMON_APP_MODULES || null) || []),
}, mutiplEntries);

for (const entry in entries) {
  // or babel-runtime
  if (process.env.APP_USE_POLYFILL_INSTEAD_OF_RUNTIME) {
    entries[entry].unshift('babel-polyfill');
  }
  if (util.liveMode === 'refresh') {
    // http://webpack.github.io/docs/webpack-dev-server.html#inline-mode
    entries[entry].unshift(`webpack-dev-server/client?http://${util.serverHost}:${util.serverPort}`);
  } else if (util.liveMode === 'hmr') {
    // https://webpack.github.io/docs/webpack-dev-server.html#hot-module-replacement
    entries[entry].unshift(`webpack-dev-server/client?http://${util.serverHost}:${util.serverPort}`, 'webpack/hot/dev-server');
    // https://www.npmjs.com/package/webpack-hot-middleware
    // entries[entry].unshift('webpack-hot-middleware/client');
  }
}

// bug: internals/configs/gulpfile + sourcemap
// new webpack.ProvidePlugin({
//   fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
// }),
const definePluginOpt = {
  'process.env.NODE_ENV': util.isProductionEnv
    ? '\'production\'' : '\'development\'',
};
const runtimeVars = JSON.parse(process.env.RUNTIME_ENV_VARS || null) || [];
runtimeVars.forEach(name => {
  definePluginOpt[`process.env.${name}`] = `'${process.env[name] || ''}'`;
});

const babelLoaderPlugins = [
  // https://phabricator.babeljs.io/T2645
  'transform-decorators-legacy',
];
if (!process.env.APP_USE_POLYFILL_INSTEAD_OF_RUNTIME) {
  // bug: ReferenceError: Can't find variable: Symbol
  //      https://github.com/gajus/react-css-modules/issues/66
  babelLoaderPlugins.push(['transform-runtime', { polyfill: true, regenerator: true }]);
}

const reactTransformPlugins = ['react-transform', {
  transforms: [
    {
      transform: 'react-transform-catch-errors',
      imports: ['react', 'redbox-react'],
    },
    {
      transform: 'react-transform-hmr',
      imports: ['react'],
      locals: ['module'],
    },
    // {
    //   transform: 'react-transform-render-visualizer',
    // },
  ],
}];
if (!util.isProductionEnv && util.liveMode === 'hmr') {
  babelLoaderPlugins.push(reactTransformPlugins);
}

// https://github.com/ai/browserslist#queries
const browsers = JSON.parse(process.env.APP_BROWSERS || null) || [];

const cssLoaderConfig = JSON.stringify({
  modules: true,
  importLoaders: 1,
  localIdentName: '[name]__[local]___[hash:base64:5]',
  sourceMap: !util.isProductionEnv,
  // https://github.com/webpack/css-loader#minification
  // https://github.com/webpack/css-loader/blob/master/lib/processCss.js
  minimize: util.isProductionEnv,
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
  context: rootPath,
  entry: entries,
  output: {
    filename: util.isProductionEnv
      ? 'js/[name]_[hash].js'
      : 'js/[name].js',
    chunkFilename: util.isProductionEnv
      ? 'js/[name]_[hash].js'
      : 'js/[name].js',
    path: util.isProductionEnv
      ? path.join(rootPath, `build/public/${process.env.APP_STATIC_ROOT}/`)
      : path.join(rootPath, 'build/public/static-for-dev/'),
    publicPath: util.isCloudEnv
        && process.env.APP_DEPLOY_STATIC_ROOT
      || util.isProductionEnv
        && `/${process.env.APP_STATIC_ROOT}/`
      || '/static-for-dev/',
  },
  resolve: {
    root: [
      path.join(rootPath, 'app'),
    ],
    alias: {
      app: path.join(rootPath, 'app'),
      internals: path.join(rootPath, 'internals'),
    },
    modulesDirectories: [path.join(rootPath, 'node_modules')], // ['node_modules'],
    extensions: ['', '.js', '.jsx'],
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: [
          'react',
          'es2015',
          'stage-1',
        ],
        plugins: babelLoaderPlugins,
        cacheDirectory: true,
      },
    }, {
      test: /\.scss$/,
      loader: ((cssOpt) => {
        return process.env.APP_ENABLE_EXTRACT_CSS
          ? ExtractTextPlugin.extract('style', `css?${cssOpt}!postcss!sass`)
          : `style?singleton!css?${cssOpt}!postcss!sass`;
      })(cssLoaderConfig),
    }, {
      test: /\.css$/,
      loader: ((cssOpt) => {
        return process.env.APP_ENABLE_EXTRACT_CSS
          ? ExtractTextPlugin.extract('style', `css?${cssOpt}!postcss`)
          : `style?singleton!css?${cssOpt}!postcss`;
      })(cssLoaderConfig),
    }, {
      test: /\.json$/,
      // https://www.npmjs.com/package/file-loader
      loader: util.isProductionEnv
        ? 'file?name=data/[name]_[hash].[ext]'
        : 'file?name=data/[name].[ext]',
    }, {
      test: /\.(gif|png|jpe?g|svg)$/i,
      loaders: [
        // https://www.npmjs.com/package/url-loader
        util.isProductionEnv
          ? 'url?limit=25000&name=assets/[name]_[hash].[ext]'
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
      test: /\.(woff|woff2)$/,
      loader: util.isProductionEnv
        ? 'url?limit=25000&name=assets/[name]_[hash].[ext]'
        : 'url?limit=25000&name=assets/[name].[ext]',
    }, {
      test: /\.(ttf|eot|wav|mp3)$/,
      loader: util.isProductionEnv
        ? 'file?name=assets/[name]_[hash].[ext]'
        : 'file?name=assets/[name].[ext]',
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
  sassLoader: {
    includePaths: [path.join(rootPath, 'node_modules')],
  },
  plugins: [
    // http://mts.io/2015/04/08/webpack-shims-polyfills/
    new webpack.DefinePlugin(definePluginOpt),
    // https://github.com/webpack/webpack/issues/198
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
  ].concat(process.env.APP_ENABLE_COMMON_CHUNK ? [
    // http://christianalfoni.github.io/react-webpack-cookbook/Split-app-and-vendors.html
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: Infinity,
      // children: true, // Move common modules into the parent chunk
      // async: true, // Create an async commons chunk
    }),
  ] : []).concat(process.env.APP_ENABLE_EXTRACT_CSS ? [
    // https://www.npmjs.com/package/extract-text-webpack-plugin
    new ExtractTextPlugin(util.isProductionEnv
      ? 'css/[name]_[contenthash].css'
      : 'css/[name].css', { allChunks: true }),
  ] : []).concat([
    // https://www.npmjs.com/package/assets-webpack-plugin
    new AssetsPlugin({
      filename: 'rev-version.json',
      path: path.join(rootPath, 'internals', 'configs'),
      fullPath: true,
      prettyPrint: true,
    }),
    // https://github.com/webpack/docs/wiki/optimization
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
  ]).concat(!util.isProductionEnv ? [
    // https://github.com/glenjamin/webpack-hot-middleware
    new webpack.HotModuleReplacementPlugin(),
  ] : []).concat([
    new webpack.NoErrorsPlugin(),
  ]),
};
