const { pick } = require('lodash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// PostCSS plugins
const postcssPresetEnv = require('postcss-preset-env');
const rucksack = require('rucksack-css');
const postcssUtilities = require('postcss-utilities');
const lostGrid = require('lost');
const easingGradients = require('postcss-easing-gradients');
const quantityQueries = require('postcss-quantity-queries');
const postCssInlineSvg = require('postcss-inline-svg');
const fontMagician = require('postcss-font-magician');
const brandColor = require('postcss-brand-colors');
const nipponColor = require('postcss-nippon-color');
const googleColor = require('postcss-google-color');
const postcssNormalize = require('postcss-normalize');
const postcssWillChange = require('postcss-will-change');
const postCssReporter = require('postcss-reporter');
const {
  isProductionEnv,
  browserslist,
  entries,
  deploy,
  css,
} = require('../../utils/custom');
const { getOutputConfig } = require('../../utils/helpers');

const output = getOutputConfig();

const { cssModules, postCss, scss, less } = css;

const styleLoaders = ({ preprocessor = '', disableCssModules = false }) => {
  const isCssModulesEnabled = cssModules.enable && !disableCssModules;
  const loaders = [
    // https://github.com/webpack-contrib/css-loader
    {
      loader: 'css-loader',
      options: {
        // https://github.com/webpack-contrib/css-loader#modules
        modules: isCssModulesEnabled,
        camelCase: isCssModulesEnabled && cssModules.enableCamelCase,
        localIdentName: cssModules.localIdentName,
        sourceMap: !output.disableSourceMap,
        importLoaders: preprocessor ? 2 : 1,
      },
    },
    // https://github.com/postcss/postcss-loader
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: !output.disableSourceMap,
        ident: 'postcss',
        plugins: () => [
          // https://github.com/seaneking/rucksack
          ...(postCss.disableRucksack ? [] : [rucksack(postCss.rucksack)]),
          // https://www.npmjs.com/package/postcss-utilities
          ...(postCss.disableUtilities
            ? []
            : [postcssUtilities(postCss.utilities)]),
          // https://github.com/peterramsing/lost/wiki/Installation#webpack
          // http://lostgrid.org/docs.html
          lostGrid(),
          // https://www.npmjs.com/package/postcss-easing-gradients
          easingGradients(),
          // https://www.npmjs.com/package/postcss-quantity-queries
          quantityQueries(),
          // https://www.npmjs.com/package/postcss-inline-svg
          postCssInlineSvg(),
          // https://www.npmjs.com/package/postcss-font-magician
          fontMagician(postCss.fontMagician),
          // https://www.npmjs.com/package/postcss-normalize
          postcssNormalize(),
          // https://www.npmjs.com/package/postcss-will-change
          ...(postCss.disableGpuHack ? [] : [postcssWillChange()]),
          // https://www.npmjs.com/package/postcss-brand-colors
          brandColor(),
          // https://www.npmjs.com/package/postcss-nippon-color
          nipponColor(),
          // https://www.npmjs.com/package/postcss-google-color
          googleColor(),
          ...postCss.plugins,
          // #-2
          // https://github.com/csstools/postcss-preset-env
          // https://preset-env.cssdb.org/features
          postcssPresetEnv({
            browsers: browserslist,
            stage: postCss.presetEnv.stage,
            features: postCss.presetEnv.features,
            autoprefixer: Object.assign({}, postCss.autoprefixer, {
              browsers: browserslist,
            }),
          }),
          // #-1
          // https://github.com/postcss/postcss-reporter
          postCssReporter(postCss.reporter),
        ],
        ...pick(postCss, ['exec', 'parser', 'syntax', 'stringifier']),
      },
    },
    // https://github.com/webpack-contrib/sass-loader
    ...(preprocessor === 'scss'
      ? [
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !output.disableSourceMap,
              data: scss.data,
            },
          },
        ]
      : []),
    // https://github.com/webpack-contrib/less-loader
    ...(preprocessor === 'less'
      ? [
          {
            loader: 'less-loader',
            options: {
              sourceMap: !output.disableSourceMap,
              paths: less.paths,
              plugins: less.plugins,
            },
          },
        ]
      : []),
  ];
  return [
    (!isProductionEnv || output.disableCssExtract) && deploy.mode !== 'ssr'
      ? // https://github.com/webpack-contrib/style-loader
        {
          loader: 'style-loader',
          options: {
            hmr: !isProductionEnv,
            sourceMap: !output.disableSourceMap,
            convertToAbsoluteUrls: !isProductionEnv,
          },
        }
      : // This plugin should be used only on production builds without style-loader in the loaders chain, especially if you want to have HMR in development.
        // https://www.npmjs.com/package/mini-css-extract-plugin#advanced-configuration-example
        MiniCssExtractPlugin.loader,
  ].concat(loaders);
};

exports.styleRules = ({ preprocessor, test }) => [
  {
    test,
    exclude: cssModules.exclude,
    use: styleLoaders({
      preprocessor,
      disableCssModules: false,
    }),
  },
  {
    test,
    include: cssModules.exclude,
    use: styleLoaders({
      preprocessor,
      disableCssModules: true,
    }),
  },
];

// https://www.npmjs.com/package/mini-css-extract-plugin#extracting-css-based-on-entry
exports.styleEntries = {};
function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}
Object.keys(entries).forEach(srcEntry => {
  exports.styleEntries[`${srcEntry}_styles`] = {
    name: srcEntry,
    test: (m, c, entry = srcEntry) =>
      m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
    chunks: 'all',
    enforce: true,
  };
});
