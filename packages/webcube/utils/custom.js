const path = require('path');
const _ = require('lodash');
const base = require('./base');

const merge = _.partialRight(
  _.mergeWith,
  (objValue, srcValue) =>
    !srcValue && srcValue !== false ? srcValue : objValue
);

let custom = {};
try {
  custom = require(path.resolve(base.projectPath, `webcube.config.js`)) || {};
} catch (ex) {}

custom.mode = process.env.NODE_ENV || 'development';
const isProductionEnv = custom.mode === 'production';

custom.base = merge(
  base,
  {
    srcRoot: 'app',
    staticRoot: 'static',
    configRoot: 'configs',
  },
  custom.base,
  {
    staticRoot: process.env.WEBCUBE_CUSTOM_STATIC_ROOT,
  }
);

custom.entries = merge({}, custom.entries);

custom.output = merge(
  {
    jsPath: 'js',
    cssPath: 'css',
    disableCache: false,
    disableMinimize: false,
    enableUglify: false,
    disableExtractCss: false,
  },
  custom.output,
  {
    jsPath: process.env.WEBCUBE_OUTPUT_CUSTOM_JS_PATH,
    cssPath: process.env.WEBCUBE_OUTPUT_CUSTOM_CSS_PATH,
    customPath: process.env.WEBCUBE_OUTPUT_CUSTOM_ROOT,
    disableCache: Boolean(process.env.WEBCUBE_OUTPUT_DISABLE_CACHE),
    disableMinimize: Boolean(process.env.WEBCUBE_OUTPUT_DISABLE_MINIMIZE),
    enableUglify: Boolean(process.env.WEBCUBE_USE_UGLIFY),
    disableExtractCss: Boolean(process.env.WEBCUBE_ENABLE_EXTRACT_CSS),
  }
);

custom.dev = merge(
  {
    port: 8000,
    host: 'localhost',
  },
  custom.dev,
  {
    port: process.env.WEBCUBE_DEVSERVER_PORT,
    host: process.env.WEBCUBE_DEVSERVER_HOST,
  }
);

custom.deploy = merge(
  {
    mode: 'staticweb',
    env: 'production',
    staticCloud: 's3',
    staticRoot: 'static',
    staging: {
      staticRoot: 'static',
    },
  },
  custom.deploy,
  {
    mode: process.env.DEPLOY_MODE,
    env: process.env.DEPLOY_ENV,
    staticCloud: process.env.WEBCUBE_DEPLOY_STATIC_CLOUD,
    staticRootUrl: process.env.WEBCUBE_CUSTOM_STATIC_ROOT_URL,
    staticRoot: process.env.WEBCUBE_DEPLOY_STATIC_ROOT,
    staging: {
      staticRoot: process.env.WEBCUBE_DEPLOY_STAGING_STATIC_ROOT,
    },
  }
);

custom.moduleLoader = merge(
  {
    alias: {},
    // noParse: new RegExp(),
  },
  custom.moduleLoader
);

_.defaults(custom.moduleLoader, {
  extensions: _.union(
    ['.js', '.jsx', '.ts', '.tsx'],
    custom.moduleLoader.extensions
  ),
});

custom.moduleRules = _.union([], custom.moduleRules);

const tool = _.defaults(custom.tool || {}, {
  // https://github.com/browserslist/browserslist
  browserslist: [
    'Android >= 2.3',
    'iOS >= 7',
    'Chrome >= 16',
    'Firefox >= 31',
    'ie >= 11',
    'Safari >= 7.1',
  ],
  rootFontSize: 16,
});

custom.tool = tool;

// https://github.com/kriasoft/isomorphic-style-loader
tool.isormophicStyle = _.defaults(tool.isormophicStyle || {}, {
  include: [],
});

tool.cssModules = merge(
  {
    disable: false,
    // https://github.com/webpack-contrib/css-loader#camelcase
    enableCamelCase: false,
  },
  tool.cssModules
);

Object.assign(tool.cssModules, {
  exclude: _.union([], tool.cssModules.exclude),
});

tool.postCss = _.defaults(tool.postCss || {}, {
  // https://github.com/postcss/postcss-loader#plugins
  plugins: [],
});

tool.postCss = merge(
  {
    // https://github.com/postcss/postcss-reporter#options
    reporter: {},
    // https://github.com/postcss/autoprefixer#options
    autoprefixer: {
      remove: false,
      cascade: false,
    },
    // http://cssnext.io/features/
    cssNext: {
      autoprefixer: false,
      // https://www.npmjs.com/package/postcss-initial#options
      initial: {
        reset: 'all',
      },
      // https://www.npmjs.com/package/pixrem
      rem: {
        browsers: tool.browserslist,
        rootValue: tool.rootFontSize,
      },
    },
    disableCssNext: false,
    // https://www.rucksackcss.org/docs/#options
    rucksack: {},
    disableRucksack: false,
    // https://www.npmjs.com/package/postcss-utilities#options
    utilities: {},
    disableUtilities: false,
    // https://www.npmjs.com/package/postcss-font-magician#options
    fontMagician: {},
    // https://dev.opera.com/articles/css-will-change-property/
    disableGpuHack: false,
  },
  tool.postCss
);

tool.scss = merge({}, tool.scss);

Object.assign(tool.scss, {
  // https://github.com/webpack-contrib/sass-loader#environment-variables
  data: `$env: ${custom.mode}; ${tool.scss.data || ''}`,
});

tool.less = merge(
  {
    // https://github.com/webpack-contrib/less-loader#imports
    // paths
  },
  tool.less
);

Object.assign(tool.less, {
  // https://github.com/webpack-contrib/less-loader#plugins
  plugins: _.union([], tool.less.plugins),
});

tool.cssNano = _.defaults(tool.cssNano || {}, {
  preset: [
    // http://cssnano.co/guides/optimisations/
    // http://cssnano.co/guides/advanced-transforms/
    'default',
    {
      autoprefixer: false,
      discardComments: {
        removeAll: true,
      },
      discardUnused: true,
      mergeIdents: true,
    },
  ],
});

tool.babel = merge(
  {
    // https://github.com/babel/babel/tree/master/packages/babel-preset-env#targets
    platforms: {
      node: 'current',
    },
    // https://github.com/babel/babel/tree/master/packages/babel-preset-typescript
    // http://artsy.github.io/blog/2017/11/27/Babel-7-and-TypeScript/
    // Caveats: https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-typescript
    // https://github.com/babel/babel/tree/master/packages/babel-preset-flow
    disableTypeScript: false,
    // http://2ality.com/2015/12/babel6-loose-mode.html
    enableLooseMode: false,
  },
  tool.babel
);

Object.assign(tool.babel, {
  excludePlugins: _.union(
    [
      // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-regenerator
      '@babel/plugin-transform-regenerator',
      // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-async-to-generator
      '@babel/plugin-transform-async-to-generator',
    ],
    tool.babel.excludePlugins
  ),
  // https://babeljs.io/docs/plugins/
  // https://github.com/babel/proposals
  // https://github.com/babel/babel/tree/master/packages
  plugins: _.union(
    [
      // https://github.com/MatAtBread/fast-async
      'module:fast-async',
      // https://github.com/babel/babel/tree/master/packages/babel-plugin-syntax-dynamic-import
      '@babel/plugin-syntax-dynamic-import',
      // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-export-default-from
      // supported by webpack 2+
      // '@babel/plugin-proposal-export-default-from',
      // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-export-namespace-from
      // supported by webpack 2+
      // '@babel/plugin-proposal-export-namespace-from',
      // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-decorators
      // https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy
      '@babel/plugin-proposal-decorators',
      // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-class-properties
      [
        '@babel/plugin-proposal-class-properties',
        {
          // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-decorators#note-order-of-plugins-matters
          // wait for the next major version of decorators (Stage 2)
          loose: true,
        },
      ],
      // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-object-rest-spread
      '@babel/plugin-proposal-object-rest-spread',
      // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-function-bind
      '@babel/plugin-proposal-function-bind',
      // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-optional-chaining
      '@babel/plugin-proposal-optional-chaining',
      // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-optional-catch-binding
      '@babel/plugin-proposal-optional-catch-binding',
      // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-numeric-separator
      '@babel/plugin-proposal-numeric-separator',
      // https://github.com/lodash/babel-plugin-lodash
      ['babel-plugin-lodash', { id: ['lodash', 'recompose'] }],
      // https://github.com/megawac/babel-plugin-ramda
      [
        'babel-plugin-ramda',
        {
          useES: true,
        },
      ],
      // https://github.com/styled-components/babel-plugin-styled-components
      [
        'babel-plugin-styled-components',
        {
          displayName: true,
          ssr: custom.deploy.mode === 'ssr',
        },
      ],
      // https://github.com/gajus/babel-plugin-react-css-modules
      // @TODO wait for babel v7: https://github.com/gajus/babel-plugin-react-css-modules/blob/master/package.json#L10
      // ...(tool.cssModules.disable
      //   ? []
      //   : [
      //       [
      //         'babel-plugin-react-css-modules',
      //         {
      //           context: base.projectPath,
      //           handleMissingStyleName: 'ignore',
      //           exclude: `(${tool.cssModules.exclude.join('|')})`,
      //         },
      //       ],
      //     ]),
      // https://github.com/gajus/babel-plugin-graphql-tag
      'babel-plugin-graphql-tag',
    ],
    tool.babel.plugins
  ),
  include: _.union(
    [
      path.resolve(base.projectPath, base.srcRoot),
      'node_modules/react-with-scripts',
      'node_modules/react-common-kit',
      'node_modules/redux-cube',
      'node_modules/redux-cube-with-immutable',
      'node_modules/redux-cube-with-persist',
      'node_modules/redux-cube-with-router',
      'node_modules/redux-cube-with-router-legacy',
      'node_modules/redux-source',
      'node_modules/redux-source-connect',
      'node_modules/redux-source-connect-immutable',
      'node_modules/redux-source-immutable',
      'node_modules/redux-source-utils',
      'node_modules/redux-source-with-block-ui',
      'node_modules/redux-source-with-notify',
      'node_modules/webcube',
      'node_modules/hifetch',
      'node_modules/ramda',
    ],
    tool.babel.include
  ),
});

module.exports = custom;
