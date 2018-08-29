const { merge, union } = require('lodash');
const { config, custom } = require('./base');

const { srcRoot } = config;

if (!custom.js) {
  custom.js = {};
}

const js = merge(
  {
    // https://github.com/babel/minify/tree/master/packages/babel-preset-minify#options
    minifyOptions: {
      removeDebugger: true,
    },
  },
  custom.js
);

if (!custom.js.babel) {
  custom.js.babel = {};
}

js.babel = merge(
  {
    // https://github.com/babel/babel/tree/master/packages/babel-preset-typescript
    // http://artsy.github.io/blog/2017/11/27/Babel-7-and-TypeScript/
    // Caveats: https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-typescript
    // https://github.com/babel/babel/tree/master/packages/babel-preset-flow
    disableTypeScript: false,
    // http://2ality.com/2015/12/babel6-loose-mode.html
    enableLooseMode: false,
    // https://babeljs.io/docs/en/babel-preset-env.html#shippedproposals
    enableShippedProposals: false,
  },
  custom.js.babel,
  {
    excludePlugins: union([], custom.js.babel.excludePlugins),
    // monorepo bug, must use `require('fast-async')`
    plugins: union([], custom.js.babel.plugins),
    // https://github.com/babel/babel-loader#babel-loader-is-slow
    // https://webpack.js.org/configuration/module/#condition
    include: union(
      [
        srcRoot,
        // /react-with-scripts/,
        // /react-common-kit/,
        // /redux-cube.*/,
        // /redux-source.*/,
        // /hifetch/,
      ],
      custom.js.babel.include
    ),
    // Error: [BABEL] The new decorators proposal is not supported yet. You must pass the `"legacy": true` option
    enableLegacyDecorators: true,
  }
);

module.exports = js;
