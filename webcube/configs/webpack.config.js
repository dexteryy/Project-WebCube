const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnext = require('postcss-cssnext');
const postcssReporter = require('postcss-reporter');
const WebpackMd5Hash = require('webpack-md5-hash');
const kebabCase = require('lodash/kebabCase');
const defaults = require('lodash/defaults');
const {
  isProductionEnv,
  isStagingEnv,
  deployMode,
  liveMode,
  serverPort,
  serverHost,
  rootPath,
} = require('../utils');

let customConfig;
try {
  customConfig = require(path.join(
    rootPath,
    `${process.env.WEBCUBE_CUSTOM_CONFIG_ROOT}/webpack.config.js`
  ));
} catch (ex) {
  console.info('No custom webpack configs');
}
customConfig = defaults(customConfig || {}, {
  resolveAlias: {},
  babelLoaderPresets: presets => presets,
  babelLoaderPlugins: plugins => plugins,
  babelLoaderInclude: [],
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
  if (!isProductionEnv) {
    const devEntryName = (/WEBCUBE_DEV_ENTRY_([A-Z_]+)/.exec(name) || [])[1];
    if (devEntryName) {
      mutiplEntries[kebabCase(devEntryName)] = [process.env[name]];
    }
  }
}

const entries = Object.assign(
  process.env.WEBCUBE_ENABLE_COMMON_CHUNK
    ? {
        // http://christianalfoni.github.io/react-webpack-cookbook/Split-app-and-vendors.html
        common: ((process.env.WEBCUBE_ENABLE_COMMON_CHUNK &&
          JSON.parse(process.env.WEBCUBE_COMMON_CORE_MODULES || null)) ||
          []
        ).concat(
          JSON.parse(process.env.WEBCUBE_COMMON_PROJECT_MODULES || null) || []
        ),
      }
    : {},
  mutiplEntries
);

for (const entry in entries) {
  // or babel-runtime
  if (process.env.WEBCUBE_USE_POLYFILL_INSTEAD_OF_RUNTIME) {
    entries[entry].unshift('babel-polyfill');
  }
  if (liveMode === 'refresh') {
    // http://webpack.github.io/docs/webpack-dev-server.html#inline-mode
    entries[entry].unshift(
      `webpack-dev-server/client?http://${serverHost}:${serverPort}`
    );
  } else if (liveMode === 'hmr') {
    // https://webpack.github.io/docs/webpack-dev-server.html#hot-module-replacement
    entries[entry].unshift(
      `webpack-dev-server/client?http://${serverHost}:${serverPort}`,
      'webpack/hot/dev-server'
    );
    // https://www.npmjs.com/package/webpack-hot-middleware
    // entries[entry].unshift('webpack-hot-middleware/client');
  }
}

// bug: configs/gulpfile + sourcemap
// new webpack.ProvidePlugin({
//   fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
// }),
const definePluginOpt = {
  'process.env.NODE_ENV': isProductionEnv ? "'production'" : "'development'",
};
const runtimeVars =
  JSON.parse(process.env.WEBCUBE_CLIENT_ENV_VARS || null) || [];
runtimeVars.forEach(name => {
  definePluginOpt[`process.env.${name}`] = `'${process.env[name] || ''}'`;
});

const babelLoaderPlugins = [
  'add-module-exports',
  'transform-es2015-modules-commonjs',
  'fast-async',
  'transform-function-bind',
  'transform-class-properties',
  'transform-object-rest-spread',
  'syntax-dynamic-import',
  'syntax-optional-chaining',
  'transform-decorators-legacy',
  'dynamic-import-webpack',
  ['lodash', { id: ['lodash', 'recompose'] }],
];
if (!process.env.WEBCUBE_USE_POLYFILL_INSTEAD_OF_RUNTIME) {
  // bug: ReferenceError: Can't find variable: Symbol
  //      https://github.com/gajus/react-css-modules/issues/66
  babelLoaderPlugins.push([
    'transform-runtime',
    { polyfill: true, regenerator: true },
  ]);
}

const reactTransformPlugins = [
  'react-transform',
  {
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
  },
];
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

const monorepoModules =
  process.env.npm_package_config_webcube_monorepo_root &&
  path.join(
    rootPath,
    process.env.npm_package_config_webcube_monorepo_root,
    'node_modules'
  );

module.exports = Object.assign(
  {
    context: rootPath,
    entry: entries,
    output: {
      filename: isProductionEnv ? 'js/[name]_[chunkhash].js' : 'js/[name].js',
      chunkFilename: isProductionEnv
        ? 'js/[name]_[chunkhash].js'
        : 'js/[name].js',
      path: isProductionEnv
        ? path.join(
            rootPath,
            `build/public/${process.env.WEBCUBE_STATIC_ROOT}/`
          )
        : path.join(rootPath, 'build/public/static-for-dev/'),
      publicPath:
        (deployMode === 'staticweb' &&
          ((isStagingEnv && process.env.WEBCUBE_DEPLOY_STAGING_STATIC_ROOT) ||
            process.env.WEBCUBE_DEPLOY_STATIC_ROOT)) ||
        (isProductionEnv && `/${process.env.WEBCUBE_STATIC_ROOT}/`) ||
        '/static-for-dev/',
    },
    resolve: {
      // root: [path.join(rootPath, 'app')],
      alias: Object.assign(
        {
          app: path.join(rootPath, 'app'),
        },
        isProductionEnv ||
        process.env.WEBCUBE_DISABLE_PERF_ADDON ||
        process.env.WEBCUBE_USE_PREACT
          ? {
              'react-addons-perf': 'webcube/boilerplate/fakePerfAddon',
            }
          : null,
        process.env.WEBCUBE_USE_PREACT
          ? {
              react: 'preact-compat',
              'react-dom': 'preact-compat',
              'react-addons-shallow-compare': 'shallow-compare',
              'react-addons-css-transition-group':
                'preact-css-transition-group',
            }
          : null,
        customConfig.resolveAlias
      ),
      modulesDirectories: [path.join(rootPath, 'node_modules')].concat(
        monorepoModules ? [monorepoModules] : []
      ),
      extensions: ['', '.js', '.jsx'],
    },
    resolveLoader: {
      modulesDirectories: [path.join(rootPath, 'node_modules')].concat(
        monorepoModules ? [monorepoModules] : []
      ),
    },
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel',
          include: [
            path.join(rootPath, 'app'),
            path.join(rootPath, 'src'),
            path.join(rootPath, 'staticweb'),
            monorepoModules
              ? path.join(monorepoModules, '../', 'webcube')
              : path.join(rootPath, 'node_modules/webcube'),
          ].concat(customConfig.babelLoaderInclude),
          // exclude: /node_modules/,
          query: {
            presets: customConfig.babelLoaderPresets([
              [
                'env',
                {
                  targets: {
                    browsers: ['last 2 versions', '> 5%'],
                    ios: 7,
                    android: 4,
                    node: 6,
                    ie: 11,
                  },
                  include: [],
                  exclude: ['transform-async-to-generator'],
                  uglify: true,
                  useBuiltIns: true,
                  loose: false,
                  debug: false,
                },
              ],
              'react',
              'flow',
            ]),
            plugins: customConfig.babelLoaderPlugins(babelLoaderPlugins),
            cacheDirectory: true,
          },
        },
        {
          test: /\.scss$/,
          loader: (cssOpt =>
            process.env.WEBCUBE_ENABLE_EXTRACT_CSS
              ? ExtractTextPlugin.extract(
                  'style',
                  `css?${cssOpt}!postcss-loader!sass`
                )
              : `style?singleton!css?${cssOpt}!postcss-loader!sass`)(
            cssLoaderConfig
          ),
        },
        {
          test: /\.css$/,
          loader: (cssOpt =>
            process.env.WEBCUBE_ENABLE_EXTRACT_CSS
              ? ExtractTextPlugin.extract(
                  'style',
                  `css?${cssOpt}!postcss-loader`
                )
              : `style?singleton!css?${cssOpt}!postcss-loader`)(
            cssLoaderConfig
          ),
        },
        {
          test: /\.json$/,
          // https://www.npmjs.com/package/file-loader
          loader: isProductionEnv
            ? 'file?name=data/[name]_[hash].[ext]'
            : 'file?name=data/[name].[ext]',
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          loaders: [
            // https://www.npmjs.com/package/url-loader
            isProductionEnv
              ? `url?limit=${process.env
                  .WEBCUBE_DATAURL_IMAGES_LIMIT}&name=assets/[name]_[hash].[ext]`
              : `url?limit=${process.env
                  .WEBCUBE_DATAURL_IMAGES_LIMIT}&name=assets/[name].[ext]`,
            // https://www.npmjs.com/package/image-webpack-loader
            (imageOpt => `image-webpack?${imageOpt}`)(
              JSON.stringify({
                progressive: true,
                gifsicle: {
                  interlaced: false,
                },
                pngquant: {
                  quality: '65-90',
                  speed: 4,
                },
                optipng: {
                  optimizationLevel: 7,
                },
                mozjpeg: {
                  quality: 65,
                },
              })
            ),
          ],
        },
        {
          test: /\.(woff|woff2)$/,
          loader: isProductionEnv
            ? `url?limit=${process.env
                .WEBCUBE_DATAURL_FONT_LIMIT}&name=assets/[name]_[hash].[ext]`
            : `url?limit=${process.env
                .WEBCUBE_DATAURL_FONT_LIMIT}&name=assets/[name].[ext]`,
        },
        {
          test: /\.(ttf|eot|wav|mp3)$/,
          loader: isProductionEnv
            ? 'file?name=assets/[name]_[hash].[ext]'
            : 'file?name=assets/[name].[ext]',
        },
      ].concat(customConfig.loaders),
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
      includePaths: [path.join(rootPath, 'node_modules')].concat(
        monorepoModules ? [monorepoModules] : []
      ),
    },
    plugins: [
      // http://mts.io/2015/04/08/webpack-shims-polyfills/
      new webpack.DefinePlugin(definePluginOpt),
      // https://github.com/webpack/webpack/issues/198
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
    ]
      .concat(
        process.env.WEBCUBE_ENABLE_COMMON_CHUNK
          ? [
              // http://christianalfoni.github.io/react-webpack-cookbook/Split-app-and-vendors.html
              new webpack.optimize.CommonsChunkPlugin({
                name: 'common',
                minChunks: Infinity,
                // children: true, // Move common modules into the parent chunk
                // async: true, // Create an async commons chunk
              }),
            ]
          : []
      )
      .concat(
        process.env.WEBCUBE_ENABLE_EXTRACT_CSS
          ? [
              // https://www.npmjs.com/package/extract-text-webpack-plugin
              new ExtractTextPlugin(
                isProductionEnv
                  ? 'css/[name]_[contenthash].css'
                  : 'css/[name].css',
                { allChunks: true }
              ),
            ]
          : []
      )
      .concat([
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
      ])
      .concat(
        process.env.WEBCUBE_ENABLE_DEDUPE_PLUGIN
          ? [new webpack.optimize.DedupePlugin()]
          : []
      )
      .concat(
        !isProductionEnv
          ? [
              // https://github.com/glenjamin/webpack-hot-middleware
              new webpack.HotModuleReplacementPlugin(),
            ]
          : []
      )
      .concat([new webpack.NoErrorsPlugin()])
      .concat(customConfig.plugins),
  },
  customConfig.customFields
);
