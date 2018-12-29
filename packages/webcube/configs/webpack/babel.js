const {
  isProductionEnv,
  deploy,
  browserslist,
  js,
} = require('../../utils/custom');
const { getOutputConfig } = require('../../utils/helpers');

const output = getOutputConfig();

const { babel } = js;

// https://github.com/babel/babel-loader
// https://babeljs.io/blog/2017/09/12/planning-for-7.0
// https://babeljs.io/blog/2017/12/27/nearing-the-7.0-release
// https://babeljs.io/docs/en/v7-migration
module.exports = ({ isSsrBuild, isServiceBuild }) => ({
  presets: [
    // https://babeljs.io/docs/en/babel-preset-env.html
    [
      // monorepo bug, must use `require('fast-async')`
      require('@babel/preset-env'),
      {
        // https://babeljs.io/docs/en/babel-preset-env.html#browserslist-support
        // https://babeljs.io/docs/en/babel-preset-env.html#targets
        targets:
          isSsrBuild || isServiceBuild
            ? {
                node: 'current',
              }
            : {
                browsers: browserslist,
              },
        // https://babeljs.io/docs/en/babel-preset-env.html#spec
        spec: false,
        // https://babeljs.io/docs/en/babel-preset-env.html#loose
        loose: babel.enableLooseMode,
        // https://babeljs.io/docs/en/babel-preset-env.html#modules
        // https://webpack.js.org/migrate/3/#mixing-es2015-with-amd-and-commonjs
        modules: isServiceBuild,
        // https://babeljs.io/docs/en/babel-preset-env.html#debug
        debug: false,
        // https://babeljs.io/docs/en/babel-preset-env.html#include
        include: [],
        // https://babeljs.io/docs/en/babel-preset-env.html#exclude
        exclude: [
          // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-async-to-generator
          'transform-regenerator',
          'transform-async-to-generator',
        ].concat(babel.excludePlugins),
        // https://babeljs.io/blog/2017/12/27/nearing-the-7.0-release#preset-env-usebuiltins-usage
        // https://babeljs.io/docs/en/babel-preset-env.html#usebuiltins
        useBuiltIns: 'usage',
        // https://babeljs.io/docs/en/babel-preset-env.html#forcealltransforms
        forceAllTransforms: !output.minimizer || output.minimizer === 'uglify',
        // https://babeljs.io/docs/en/babel-preset-env.html#shippedproposals
        shippedProposals: babel.enableShippedProposals,
      },
    ],
    // https://github.com/babel/babel/tree/master/packages/babel-preset-react
    [require('@babel/preset-react'), { development: !isProductionEnv }],
    babel.disableTypeScript
      ? require('@babel/preset-flow')
      : [
          require('@babel/preset-typescript'),
          {
            isTSX: true,
            allExtensions: true,
          },
        ],
    // faster but incomplete compression, use MinifyPlugin instead
    // https://github.com/babel/minify/tree/master/packages/babel-preset-minify#options
    // ...(isProductionEnv &&
    // output.minimizer === 'minify' &&
    // !output.disableMinimize
    //   ? [[require('babel-preset-minify'), js.minifyOptions]]
    //   : []),
  ],
  // https://babeljs.io/docs/plugins/
  // https://github.com/babel/proposals
  // https://github.com/babel/babel/tree/master/packages
  // monorepo bug, must use `require('fast-async')`
  plugins: [
    // https://babeljs.io/docs/en/babel-plugin-transform-es2015-modules-commonjs.html
    // https://github.com/59naga/babel-plugin-add-module-exports#readme
    // https://blog.kentcdodds.com/misunderstanding-es6-modules-upgrading-babel-tears-and-a-solution-ad2d5ab93ce0
    // DO NOT USE THIS PLUGIN
    // require('babel-plugin-add-module-exports'),
    // https://github.com/MatAtBread/fast-async
    ...(!isSsrBuild && !isServiceBuild ? [require('fast-async')] : []),
    // https://github.com/babel/babel/tree/master/packages/babel-plugin-syntax-dynamic-import
    // https://medium.com/webpack/webpack-4-import-and-commonjs-d619d626b655
    require('@babel/plugin-syntax-dynamic-import'),
    ...(isSsrBuild || isServiceBuild
      ? [require('babel-plugin-dynamic-import-node')]
      : []),
    // https://github.com/jamiebuilds/react-loadable#------------server-side-rendering
    // https://github.com/jamiebuilds/react-loadable#babel-plugin
    require('react-loadable/babel'),
    // https://babeljs.io/docs/en/babel-plugin-proposal-decorators.html#legacy
    [
      require('@babel/plugin-proposal-decorators'),
      {
        // https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy
        legacy: babel.enableLegacyDecorators,
      },
    ],
    // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-class-properties
    [
      require('@babel/plugin-proposal-class-properties'),
      {
        // https://babeljs.io/docs/en/babel-plugin-proposal-class-properties.html#loose
        // https://babeljs.io/docs/en/babel-plugin-proposal-decorators.html#note-compatibility-with-babel-plugin-proposal-class-properties
        loose: babel.enableLegacyDecorators,
      },
    ],
    // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-object-rest-spread
    ...(!isSsrBuild && !isServiceBuild
      ? [require('@babel/plugin-proposal-object-rest-spread')]
      : []),
    // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-function-bind
    require('@babel/plugin-proposal-function-bind'),
    // https://babeljs.io/docs/en/babel-plugin-proposal-export-default-from.html
    require('@babel/plugin-proposal-export-default-from'),
    // https://babeljs.io/docs/en/babel-plugin-proposal-export-namespace-from.html
    require('@babel/plugin-proposal-export-namespace-from'),
    // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-optional-chaining
    require('@babel/plugin-proposal-optional-chaining'),
    // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-optional-catch-binding
    require('@babel/plugin-proposal-optional-catch-binding'),
    // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-numeric-separator
    require('@babel/plugin-proposal-numeric-separator'),
    // https://babeljs.io/docs/en/babel-plugin-proposal-pipeline-operator.html
    // https://docs.google.com/presentation/d/1eFFRK1wLIazIuK0F6fY974OIDvvWXS890XAMB59PUBA/edit#slide=id.p
    [
      require('@babel/plugin-proposal-pipeline-operator'),
      {
        // https://babeljs.io/blog/2018/07/19/whats-happening-with-the-pipeline-proposal
        proposal: 'minimal',
      },
    ],
    // https://github.com/lodash/babel-plugin-lodash
    // @BUG conflict with `import { Bind } from 'lodash-decorators';`
    [require('babel-plugin-lodash'), { id: ['lodash', 'recompose'] }],
    // https://github.com/megawac/babel-plugin-ramda
    [
      require('babel-plugin-ramda'),
      {
        useES: true,
      },
    ],
    // https://www.styled-components.com/docs/advanced#avoiding-conflicts-with-thirdparty-styles-and-scripts
    // https://github.com/QuickBase/babel-plugin-styled-components-css-namespace
    require('@quickbaseoss/babel-plugin-styled-components-css-namespace'),
    // https://github.com/styled-components/babel-plugin-styled-components
    [
      require('babel-plugin-styled-components'),
      {
        displayName: true,
        ssr: deploy.mode === 'ssr',
      },
    ],
    // https://github.com/gajus/babel-plugin-react-css-modules
    // @TODO wait for babel v7: https://github.com/gajus/babel-plugin-react-css-modules/blob/master/package.json#L10
    // ...(!css.cssModules.enable
    //   ? []
    //   : [
    //       [
    //         'babel-plugin-react-css-modules',
    //         {
    //           context: projectPath,
    //           handleMissingStyleName: 'ignore',
    //           exclude: `(${css.cssModules.exclude.join('|')})`,
    //         },
    //       ],
    //     ]),
    // https://github.com/gajus/babel-plugin-graphql-tag
    require('babel-plugin-graphql-tag'),
  ].concat(babel.plugins),
  ...((isServiceBuild && {
    // https://github.com/babel/babel-loader#options
    // node_modules/.cache/babel-loader
    cacheDirectory: true,
  }) ||
    {}),
});
