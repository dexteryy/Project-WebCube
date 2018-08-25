const { merge } = require('lodash');
const { custom } = require('./base');

if (!custom.css) {
  custom.css = {};
}

const css = merge(
  {
    cssModules: {
      enable: false,
      exclude: ['node_modules'],
      // https://github.com/webpack-contrib/css-loader#camelcase
      enableCamelCase: false,
      localIdentName: '[local]--[hash:base64:5]',
    },
    postCss: {
      // https://github.com/postcss/postcss-loader#plugins
      plugins: [],
      // https://github.com/postcss/postcss-reporter#options
      reporter: {},
      // https://github.com/csstools/postcss-preset-env#options
      presetEnv: {
        stage: 2,
      },
      // https://github.com/postcss/autoprefixer#options
      autoprefixer: {},
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
    scss: {},
    less: {
      // https://github.com/webpack-contrib/less-loader#plugins
      plugins: [],
    },
    cssNano: {
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
    },
  },
  custom.css
);

// Object.assign(css.scss, {
//   // https://github.com/webpack-contrib/sass-loader#environment-variables
//   data: `$env: ${config.mode}; ${css.scss.data || ''}`,
// });

module.exports = css;
