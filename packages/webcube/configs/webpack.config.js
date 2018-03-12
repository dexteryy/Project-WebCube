const fs = require('fs');
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnext = require('postcss-cssnext');
const postcssReporter = require('postcss-reporter');
const WebpackMd5Hash = require('webpack-md5-hash');
const _ = require('lodash');
const {
  isProductionEnv,
  isStagingEnv,
  deployMode,
  liveMode,
  serverPort,
  serverHost,
  staticRoot,
  rootPath,
  modulePath,
  projectPath,
} = require('../utils');

const packageJson = require(path.join(rootPath, './package.json'));

let customConfig;
try {
  customConfig = require(path.join(
    projectPath,
    `${process.env.WEBCUBE_CUSTOM_CONFIG_ROOT}/webpack.config.js`
  ));
} catch (ex) {
  console.info('No custom webpack configs');
}
customConfig = _.defaults(customConfig || {}, {
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
    mutiplEntries[_.kebabCase(entryName)] = [process.env[name]];
  }
  const demoName = (/WEBCUBE_(DEMO_[A-Z_]+)/.exec(name) || [])[1];
  if (demoName) {
    mutiplEntries[_.kebabCase(demoName)] = [process.env[name]];
  }
  if (!isProductionEnv) {
    const devEntryName = (/WEBCUBE_DEV_ENTRY_([A-Z_]+)/.exec(name) || [])[1];
    if (devEntryName) {
      mutiplEntries[_.kebabCase(devEntryName)] = [process.env[name]];
    }
  }
}

const entries = Object.assign(
  process.env.WEBCUBE_ENABLE_COMMON_CHUNK
    ? {
        // http://christianalfoni.github.io/react-webpack-cookbook/Split-app-and-vendors.html
        common: (
          (process.env.WEBCUBE_ENABLE_COMMON_CHUNK &&
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

const excludeFromCssModulesOrigin = JSON.parse(
  process.env.WEBCUBE_EXCLUDE_FROM_CSS_MODULES || '[]'
);

const excludeFromCssModules = excludeFromCssModulesOrigin.map(relativePath =>
  path.join(rootPath, relativePath)
);

const isormophicStyles = JSON.parse(
  process.env.WEBCUBE_INCLUDE_INTO_ISORMOPHIC_STYLES || '[]'
).map(relativePath => path.join(rootPath, relativePath));

const babelLoaderPlugins = [
  'add-module-exports',
  'transform-es2015-modules-commonjs',
  'fast-async',
  'transform-function-bind',
  'transform-class-properties',
  'transform-object-rest-spread',
  'syntax-dynamic-import',
  'dynamic-import-webpack', // for webpack v1
  'syntax-optional-chaining',
  'transform-decorators-legacy',
  ['lodash', { id: ['lodash', 'recompose'] }],
  ['ramda'],
  'styled-components',
  'graphql-tag',
  [
    'babel-plugin-webpack-alias',
    { config: path.join(__dirname, 'webpack.config.js') },
  ],
]
  .concat(
    process.env.WEBCUBE_DISABLE_CSS_MODULES
      ? []
      : [
          [
            'react-css-modules',
            {
              context: projectPath,
              handleMissingStyleName: 'ignore',
              exclude: `(${excludeFromCssModulesOrigin.join('|')})`,
            },
          ],
        ]
  )
  .concat(
    isProductionEnv
      ? []
      : [
          // 'rewire',
        ]
  );

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

const babelLoaderConfig = {
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
        useBuiltIns: 'usage',
        forceAllTransforms: Boolean(process.env.WEBCUBE_USE_UGLIFY),
        shippedProposals: false,
        loose: Boolean(process.env.WEBCUBE_ENABLE_LOOSE_MODE),
        debug: false,
      },
    ],
    'react',
    'flow',
  ]),
  plugins: customConfig.babelLoaderPlugins(babelLoaderPlugins),
  cacheDirectory: true,
  // shouldPrintComment: false,
};

const es6Modules = (
  JSON.parse(process.env.WEBCUBE_ES6_MODULES || null) || []
).map(es6ModulePath => fs.realpathSync(path.join(rootPath, es6ModulePath)));

const monorepoModules = [];
(packageJson.workspaces || []).forEach(workspacePath => {
  const matches = glob.sync(path.join(rootPath, workspacePath));
  monorepoModules.push(...matches);
});
const resolvePaths = (projectPath !== rootPath
  ? [path.join(projectPath, 'node_modules')]
  : []
)
  .concat(
    monorepoModules.map(workspace => path.join(workspace, 'node_modules'))
  )
  .concat([path.join(rootPath, 'node_modules')]);

const babelInclude = [
  path.join(projectPath, 'app'),
  path.join(projectPath, 'src'),
  path.join(projectPath, 'staticweb'),
  modulePath,
]
  .concat(es6Modules)
  .concat(customConfig.babelLoaderInclude);

// https://github.com/ai/browserslist#queries
const browsers = JSON.parse(process.env.WEBCUBE_BROWSERS || null) || [];

const cssLoaderConfig = {
  modules: !process.env.WEBCUBE_DISABLE_CSS_MODULES,
  importLoaders: 1,
  localIdentName: '[name]__[local]___[hash:base64:5]',
  sourceMap: !isProductionEnv,
  // https://github.com/webpack/css-loader#minification
  // https://github.com/webpack/css-loader/blob/master/lib/processCss.js
  minimize: isProductionEnv && !process.env.WEBCUBE_OUTPUT_DISABLE_MINIMIZE,
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
};

const getScssLoaderConfig = cssOpt => {
  const localCssOpt = JSON.stringify(
    Object.assign({}, cssOpt, {
      importLoaders: 2,
    })
  );
  return (
    (cssOpt._enableIsormophicStyleLoader &&
      `isomorphic-style-loader!css?${localCssOpt}!postcss-loader!sass`) ||
    (process.env.WEBCUBE_ENABLE_EXTRACT_CSS &&
      ExtractTextPlugin.extract(
        'style',
        `css?${localCssOpt}!postcss-loader!sass`
      )) ||
    `style-loader?singleton!css?${localCssOpt}!postcss-loader!sass`
  );
};

const getLessLoaderConfig = cssOpt => {
  const localCssOpt = JSON.stringify(
    Object.assign({}, cssOpt, {
      importLoaders: 2,
    })
  );
  return (
    (cssOpt._enableIsormophicStyleLoader &&
      `isomorphic-style-loader!css?${localCssOpt}!postcss-loader!less`) ||
    (process.env.WEBCUBE_ENABLE_EXTRACT_CSS &&
      ExtractTextPlugin.extract(
        'style',
        `css?${localCssOpt}!postcss-loader!less`
      )) ||
    `style-loader?singleton!css?${localCssOpt}!postcss-loader!less`
  );
};

const getCssLoaderConfig = cssOpt => {
  const localCssOpt = JSON.stringify(cssOpt);
  return (
    (cssOpt._enableIsormophicStyleLoader &&
      `isomorphic-style-loader!css?${localCssOpt}!postcss-loader`) ||
    (process.env.WEBCUBE_ENABLE_EXTRACT_CSS &&
      ExtractTextPlugin.extract(
        'style',
        `css?${localCssOpt}!postcss-loader`
      )) ||
    `style-loader?singleton!css?${localCssOpt}!postcss-loader`
  );
};

const outputJsPath = process.env.WEBCUBE_OUTPUT_CUSTOM_JS_PATH || 'js';
const outputCssPath = process.env.WEBCUBE_OUTPUT_CUSTOM_CSS_PATH || 'css';
const outputAssetsPath =
  process.env.WEBCUBE_OUTPUT_CUSTOM_ASSETS_PATH || 'assets';

module.exports = Object.assign(
  {
    context: projectPath,
    entry: entries,
    output: {
      filename:
        isProductionEnv && !process.env.WEBCUBE_OUTPUT_DISABLE_CACHE
          ? `${outputJsPath}/[name]_[chunkhash].js`
          : `${outputJsPath}/[name].js`,
      chunkFilename:
        isProductionEnv && !process.env.WEBCUBE_OUTPUT_DISABLE_CACHE
          ? `${outputJsPath}/[name]_[chunkhash].js`
          : `${outputJsPath}/[name].js`,
      path: !process.env.WEBCUBE_OUTPUT_CUSTOM_ROOT
        ? path.join(projectPath, `build/public/${staticRoot}/`)
        : path.join(rootPath, process.env.WEBCUBE_OUTPUT_CUSTOM_ROOT),
      publicPath:
        (deployMode === 'staticweb' &&
          ((isStagingEnv && process.env.WEBCUBE_DEPLOY_STAGING_STATIC_ROOT) ||
            process.env.WEBCUBE_DEPLOY_STATIC_ROOT)) ||
        process.env.WEBCUBE_CUSTOM_STATIC_ROOT_URL ||
        `/${staticRoot}/`,
    },
    resolve: {
      alias: Object.assign(
        {
          app: path.join(projectPath, 'app'),
        },
        process.env.WEBCUBE_USE_PREACT
          ? {
              react: 'preact-compat',
              'react-dom': 'preact-compat',
            }
          : null,
        customConfig.resolveAlias
      ),
      modulesDirectories: resolvePaths,
      extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
      packageMains: [
        'webcube:module',
        'webpack',
        'browser',
        'web',
        'browserify',
        ['jam', 'main'],
        'main',
      ],
    },
    resolveLoader: {
      modulesDirectories: resolvePaths,
    },
    devtool: 'source-map',
    module: {
      noParse: new RegExp(
        `(${JSON.parse(process.env.WEBCUBE_WEBPACK_NO_PARSE || '[]').join(
          '|'
        )})`
      ),
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel',
          include: babelInclude,
          query: babelLoaderConfig,
        },
        {
          test: /\.tsx?$/,
          loader: `babel?${JSON.stringify(babelLoaderConfig)}!ts-loader`,
          include: babelInclude,
        },
        {
          test: /\.scss$/,
          loader: getScssLoaderConfig(cssLoaderConfig),
          exclude: _.union(excludeFromCssModules, isormophicStyles),
        },
        {
          test: /\.scss$/,
          loader: getScssLoaderConfig(
            Object.assign({}, cssLoaderConfig, {
              modules: false,
            })
          ),
          include: _.difference(excludeFromCssModules, isormophicStyles),
        },
        {
          test: /\.scss$/,
          loader: getScssLoaderConfig(
            Object.assign({}, cssLoaderConfig, {
              _enableIsormophicStyleLoader: true,
            })
          ),
          include: _.difference(isormophicStyles, excludeFromCssModules),
        },
        {
          test: /\.scss$/,
          loader: getScssLoaderConfig(
            Object.assign({}, cssLoaderConfig, {
              _enableIsormophicStyleLoader: true,
              modules: false,
            })
          ),
          include: _.intersection(isormophicStyles, excludeFromCssModules),
        },
        {
          test: /\.less$/,
          loader: getLessLoaderConfig(cssLoaderConfig),
          exclude: _.union(excludeFromCssModules, isormophicStyles),
        },
        {
          test: /\.less$/,
          loader: getLessLoaderConfig(
            Object.assign({}, cssLoaderConfig, {
              modules: false,
            })
          ),
          include: _.difference(excludeFromCssModules, isormophicStyles),
        },
        {
          test: /\.less$/,
          loader: getLessLoaderConfig(
            Object.assign({}, cssLoaderConfig, {
              _enableIsormophicStyleLoader: true,
            })
          ),
          include: _.difference(isormophicStyles, excludeFromCssModules),
        },
        {
          test: /\.less$/,
          loader: getLessLoaderConfig(
            Object.assign({}, cssLoaderConfig, {
              _enableIsormophicStyleLoader: true,
              modules: false,
            })
          ),
          include: _.intersection(isormophicStyles, excludeFromCssModules),
        },
        {
          test: /\.css$/,
          loader: getCssLoaderConfig(cssLoaderConfig),
          exclude: _.union(excludeFromCssModules, isormophicStyles),
        },
        {
          test: /\.css$/,
          loader: getCssLoaderConfig(
            Object.assign({}, cssLoaderConfig, {
              modules: false,
            })
          ),
          include: _.difference(excludeFromCssModules, isormophicStyles),
        },
        {
          test: /\.css$/,
          loader: getCssLoaderConfig(
            Object.assign({}, cssLoaderConfig, {
              _enableIsormophicStyleLoader: true,
            })
          ),
          include: _.difference(isormophicStyles, excludeFromCssModules),
        },
        {
          test: /\.css$/,
          loader: getCssLoaderConfig(
            Object.assign({}, cssLoaderConfig, {
              _enableIsormophicStyleLoader: true,
              modules: false,
            })
          ),
          include: _.intersection(isormophicStyles, excludeFromCssModules),
        },
        {
          test: /\.json$/,
          // https://www.npmjs.com/package/file-loader
          loader:
            isProductionEnv && !process.env.WEBCUBE_OUTPUT_DISABLE_CACHE
              ? 'file?name=data/[name]_[hash].[ext]'
              : 'file?name=data/[name].[ext]',
        },
        {
          test: /\.(txt|gql)$/,
          loader: 'raw',
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          loaders: [
            // https://www.npmjs.com/package/url-loader
            isProductionEnv && !process.env.WEBCUBE_OUTPUT_DISABLE_CACHE
              ? `url-loader?limit=${
                  process.env.WEBCUBE_DATAURL_IMAGES_LIMIT
                }&name=${outputAssetsPath}/[name]_[hash].[ext]`
              : `url-loader?limit=${
                  process.env.WEBCUBE_DATAURL_IMAGES_LIMIT
                }&name=${outputAssetsPath}/[name].[ext]`,
          ].concat(
            process.env.WEBCUBE_ENABLE_IMAGE_MIN
              ? [
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
                ]
              : []
          ),
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          loader:
            isProductionEnv && !process.env.WEBCUBE_OUTPUT_DISABLE_CACHE
              ? `url-loader?limit=${
                  process.env.WEBCUBE_DATAURL_FONT_LIMIT
                }&name=${outputAssetsPath}/[name]_[hash].[ext]`
              : `url-loader?limit=${
                  process.env.WEBCUBE_DATAURL_FONT_LIMIT
                }&name=${outputAssetsPath}/[name].[ext]`,
        },
        {
          test: /\.(wav|mp3)$/,
          loader:
            isProductionEnv && !process.env.WEBCUBE_OUTPUT_DISABLE_CACHE
              ? `file?name=${outputAssetsPath}/[name]_[hash].[ext]`
              : `file?name=${outputAssetsPath}/[name].[ext]`,
        },
      ].concat(customConfig.loaders),
    },
    // https://www.npmjs.com/package/postcss-loader
    postcss() {
      return (process.env.WEBCUBE_DISABLE_CSSNEXT
        ? []
        : [
            cssnext({
              features: {
                autoprefixer: false,
              },
            }),
          ]
      )
        .concat([
          autoprefixer({
            browsers,
            // https://github.com/postcss/autoprefixer#outdated-prefixes
            remove: false,
            add: true,
            cascade: false,
          }),
          postcssReporter(),
        ])
        .concat(customConfig.postcssPlugins);
    },
    sassLoader: {
      includePaths: resolvePaths,
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
                outputCssPath +
                  (isProductionEnv && !process.env.WEBCUBE_OUTPUT_DISABLE_CACHE
                    ? '/[name]_[contenthash].css'
                    : '/[name].css'),
                { allChunks: true }
              ),
            ]
          : []
      )
      .concat([
        // https://www.npmjs.com/package/assets-webpack-plugin
        new AssetsPlugin({
          filename: 'rev-version.json',
          path: projectPath,
          fullPath: true,
          prettyPrint: true,
        }),
        new ManifestPlugin({
          fileName: process.env.WEBCUBE_OUTPUT_MANIFEST_NAME || 'manifest.json',
          publicPath: process.env.WEBCUBE_OUTPUT_MANIFEST_PREFIX || '',
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
