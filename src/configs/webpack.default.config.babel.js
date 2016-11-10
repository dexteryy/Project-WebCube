
import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import autoprefixer from 'autoprefixer';
import cssnext from 'postcss-cssnext';
import postcssReporter from 'postcss-reporter';
import WebpackMd5Hash from 'webpack-md5-hash';
import {
  isProductionEnv,
  isStagingEnv,
  deployMode,
  liveMode,
  serverPort,
  serverHost,
  rootPath,
} from '../utils';
import kebabCase from 'lodash/kebabCase';
import defaults from 'lodash/defaults';

let customConfig;
try {
  customConfig = require(path.join(rootPath,
    `${process.env.WEBCUBE_CUSTOM_CONFIG_ROOT}/webpack.config.babel.js`));
} catch (ex) {
  console.log('No custom webpack configs');
}
customConfig = defaults(customConfig || {}, {
  resolveAlias: {},
  babelLoaderPresets: presets => presets,
  babelLoaderPlugins: plugins => plugins,
  loaders: [],
  postcssPlugins: [],
  plugins: [],
  customFields: {},
});

const mutiplEntries = {};
for (const name in process.env) {
  const entryName = (/WEBCUBE_ENTRY_([A-Z_]+)/.exec(name) || [])[1];
  if (entryName) {
    mutiplEntries[kebabCase(entryName)] = [process.env[name]];
  }
  const demoName = (/WEBCUBE_(DEMO_[A-Z_]+)/.exec(name) || [])[1];
  if (demoName) {
    mutiplEntries[kebabCase(demoName)] = [process.env[name]];
  }
}

const entries = Object.assign(process.env.WEBCUBE_ENABLE_COMMON_CHUNK ? {
  // http://christianalfoni.github.io/react-webpack-cookbook/Split-app-and-vendors.html
  common: (
    process.env.WEBCUBE_ENABLE_COMMON_CHUNK
      && JSON.parse(process.env.WEBCUBE_COMMON_CORE_MODULES || null)
      || []
  ).concat(JSON.parse(process.env.WEBCUBE_COMMON_PROJECT_MODULES || null) || []),
} : {}, mutiplEntries);

for (const entry in entries) {
  // or babel-runtime
  if (process.env.WEBCUBE_USE_POLYFILL_INSTEAD_OF_RUNTIME) {
    entries[entry].unshift('babel-polyfill');
  }
  if (liveMode === 'refresh') {
    // http://webpack.github.io/docs/webpack-dev-server.html#inline-mode
    entries[entry].unshift(`webpack-dev-server/client?http://${serverHost}:${serverPort}`);
  } else if (liveMode === 'hmr') {
    // https://webpack.github.io/docs/webpack-dev-server.html#hot-module-replacement
    entries[entry].unshift(`webpack-dev-server/client?http://${serverHost}:${serverPort}`, 'webpack/hot/dev-server');
    // https://www.npmjs.com/package/webpack-hot-middleware
    // entries[entry].unshift('webpack-hot-middleware/client');
  }
}

// bug: configs/gulpfile + sourcemap
// new webpack.ProvidePlugin({
//   fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
// }),
const definePluginOpt = {
  'process.env.NODE_ENV': isProductionEnv
    ? '\'production\'' : '\'development\'',
};
const runtimeVars = JSON.parse(process.env.WEBCUBE_CLIENT_ENV_VARS || null) || [];
runtimeVars.forEach(name => {
  definePluginOpt[`process.env.${name}`] = `'${process.env[name] || ''}'`;
});

const babelLoaderPlugins = [
  'syntax-trailing-function-commas',
  'transform-object-rest-spread',
  'transform-class-properties',
  // https://phabricator.babeljs.io/T2645
  'transform-decorators-legacy',
  'syntax-async-functions',
  // https://github.com/marten-de-vries/kneden
  'async-to-promises',
];
if (!process.env.WEBCUBE_USE_POLYFILL_INSTEAD_OF_RUNTIME) {
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
if (!isProductionEnv && liveMode === 'hmr') {
  babelLoaderPlugins.push(reactTransformPlugins);
}

// https://github.com/ai/browserslist#queries
const browsers = JSON.parse(process.env.WEBCUBE_BROWSERS || null) || [];

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
  autoprefixer: false,
  discardComments: {
    removeAll: true,
  },
  discardUnused: true,
  mergeIdents: true,
  // zindex: true,
  // normalizeUrl: true,
  // reduceIdents: true,
});

module.exports = Object.assign({
  context: rootPath,
  entry: entries,
  output: {
    filename: isProductionEnv
      ? 'js/[name]_[chunkhash].js'
      : 'js/[name].js',
    chunkFilename: isProductionEnv
      ? 'js/[name]_[chunkhash].js'
      : 'js/[name].js',
    path: isProductionEnv
      ? path.join(rootPath, `build/public/${process.env.WEBCUBE_STATIC_ROOT}/`)
      : path.join(rootPath, 'build/public/static-for-dev/'),
    publicPath: deployMode === 'staticweb'
        && (isStagingEnv
          && process.env.WEBCUBE_DEPLOY_STAGING_STATIC_ROOT
          || process.env.WEBCUBE_DEPLOY_STATIC_ROOT)
      || isProductionEnv
        && `/${process.env.WEBCUBE_STATIC_ROOT}/`
      || '/static-for-dev/',
  },
  resolve: {
    root: [
      path.join(rootPath, 'app'),
    ],
    alias: Object.assign({
      app: path.join(rootPath, 'app'),
    }, (
      isProductionEnv
        || process.env.WEBCUBE_DISABLE_PERF_ADDON
        || process.env.WEBCUBE_USE_PREACT
    ) ? {
      'react-addons-perf': 'webcube/boilerplate/fakePerfAddon',
    } : null, process.env.WEBCUBE_USE_PREACT ? {
      react: 'preact-compat',
      'react-dom': 'preact-compat',
      'react-addons-shallow-compare': 'preact-shallow-compare',
      'react-addons-css-transition-group': 'preact-css-transition-group',
    } : null, customConfig.resolveAlias),
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
        presets: customConfig.babelLoaderPresets([
          'react',
          'es2015',
          'es2016',
        ]),
        plugins: customConfig.babelLoaderPlugins(babelLoaderPlugins),
        cacheDirectory: true,
      },
    }, {
      test: /\.scss$/,
      loader: ((cssOpt) => {
        return process.env.WEBCUBE_ENABLE_EXTRACT_CSS
          ? ExtractTextPlugin.extract('style', `css?${cssOpt}!postcss!sass`)
          : `style?singleton!css?${cssOpt}!postcss!sass`;
      })(cssLoaderConfig),
    }, {
      test: /\.css$/,
      loader: ((cssOpt) => {
        return process.env.WEBCUBE_ENABLE_EXTRACT_CSS
          ? ExtractTextPlugin.extract('style', `css?${cssOpt}!postcss`)
          : `style?singleton!css?${cssOpt}!postcss`;
      })(cssLoaderConfig),
    }, {
      test: /\.json$/,
      // https://www.npmjs.com/package/file-loader
      loader: isProductionEnv
        ? 'file?name=data/[name]_[hash].[ext]'
        : 'file?name=data/[name].[ext]',
    }, {
      test: /\.(gif|png|jpe?g|svg)$/i,
      loaders: [
        // https://www.npmjs.com/package/url-loader
        isProductionEnv
          ? `url?limit=${process.env.WEBCUBE_DATAURL_IMAGES_LIMIT}&name=assets/[name]_[hash].[ext]`
          : `url?limit=${process.env.WEBCUBE_DATAURL_IMAGES_LIMIT}&name=assets/[name].[ext]`,
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
      loader: isProductionEnv
        ? `url?limit=${process.env.WEBCUBE_DATAURL_FONT_LIMIT}&name=assets/[name]_[hash].[ext]`
        : `url?limit=${process.env.WEBCUBE_DATAURL_FONT_LIMIT}&name=assets/[name].[ext]`,
    }, {
      test: /\.(ttf|eot|wav|mp3)$/,
      loader: isProductionEnv
        ? 'file?name=assets/[name]_[hash].[ext]'
        : 'file?name=assets/[name].[ext]',
    }].concat(customConfig.loaders),
  },
  // https://www.npmjs.com/package/postcss-loader
  postcss() {
    return [
      cssnext({
        features: {
          autoprefixer: false,
        },
      }),
      autoprefixer({
        browsers,
        // https://github.com/postcss/autoprefixer#outdated-prefixes
        remove: false,
        add: true,
        cascade: false,
      }),
      postcssReporter(),
    ].concat(customConfig.postcssPlugins);
  },
  sassLoader: {
    includePaths: [path.join(rootPath, 'node_modules')],
  },
  plugins: [
    // http://mts.io/2015/04/08/webpack-shims-polyfills/
    new webpack.DefinePlugin(definePluginOpt),
    // https://github.com/webpack/webpack/issues/198
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
  ].concat(process.env.WEBCUBE_ENABLE_COMMON_CHUNK ? [
    // http://christianalfoni.github.io/react-webpack-cookbook/Split-app-and-vendors.html
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: Infinity,
      // children: true, // Move common modules into the parent chunk
      // async: true, // Create an async commons chunk
    }),
  ] : []).concat(process.env.WEBCUBE_ENABLE_EXTRACT_CSS ? [
    // https://www.npmjs.com/package/extract-text-webpack-plugin
    new ExtractTextPlugin(isProductionEnv
      ? 'css/[name]_[contenthash].css'
      : 'css/[name].css', { allChunks: true }),
  ] : []).concat([
    // https://www.npmjs.com/package/assets-webpack-plugin
    new AssetsPlugin({
      filename: 'rev-version.json',
      path: rootPath,
      fullPath: true,
      prettyPrint: true,
    }),
    // https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95
    new WebpackMd5Hash(),
    // https://github.com/webpack/docs/wiki/optimization
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
  ]).concat(!isProductionEnv ? [
    // https://github.com/glenjamin/webpack-hot-middleware
    new webpack.HotModuleReplacementPlugin(),
  ] : []).concat([
    new webpack.NoErrorsPlugin(),
  ]).concat(customConfig.plugins),
}, customConfig.customFields);
