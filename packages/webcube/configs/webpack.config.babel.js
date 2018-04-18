/* eslint-disable node/no-unsupported-features */

import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import cssNext from 'postcss-cssnext';
import rucksack from 'rucksack-css';
import postcssUtilities from 'postcss-utilities';
import lostGrid from 'lost';
import easingGradients from 'postcss-easing-gradients';
import postCssInlineSvg from 'postcss-inline-svg';
import fontMagician from 'postcss-font-magician';
import brandColor from 'postcss-brand-colors';
import nipponColor from 'postcss-nippon-color';
import googleColor from 'postcss-google-color';
import autoprefixer from 'autoprefixer';
import postcssNormalize from 'postcss-normalize';
import postcssWillChange from 'postcss-will-change';
import postCssReporter from 'postcss-reporter';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import {
  mode,
  base,
  entries,
  output,
  dev,
  deploy,
  moduleLoader,
  moduleRules,
  tool,
} from '../utils/custom';

const {
  rootPath,
  webcubePath,
  projectPath,
  srcRoot,
  staticRoot,
  configRoot,
} = base;

const isProductionEnv = mode === 'production';
function getDeployEnvConfig(field) {
  return deploy.env === 'production'
    ? deploy[field]
    : deploy[deploy.env][field];
}

function getRealPath(paths) {
  return paths.map(relativePath =>
    fs.realpathSync(path.resolve(base.rootPath, relativePath))
  );
}

// https://github.com/babel/babel-loader
// https://babeljs.io/blog/2017/09/12/planning-for-7.0
// https://babeljs.io/blog/2017/12/27/nearing-the-7.0-release
const babelOptions = {
  presets: [
    // https://github.com/babel/babel/tree/master/packages/babel-preset-env
    [
      '@babel/preset-env',
      {
        targets: {
          // https://github.com/babel/babel/tree/master/packages/babel-preset-env#targetsbrowsers
          browsers: tool.browserslist,
          ...tool.babel.platforms,
        },
        include: [],
        exclude: tool.babel.excludePlugins,
        // https://webpack.js.org/migrate/3/#mixing-es2015-with-amd-and-commonjs
        modules: false,
        // https://babeljs.io/blog/2017/12/27/nearing-the-7.0-release#preset-env-usebuiltins-usage
        useBuiltIns: 'usage',
        shippedProposals: false,
        loose: tool.babel.enableLooseMode,
        // https://github.com/babel/babel/tree/master/packages/babel-preset-env#forcealltransforms
        forceAllTransforms: output.enableUglify,
        debug: false,
      },
    ],
    // https://github.com/babel/babel/tree/master/packages/babel-preset-react
    ['@babel/preset-react', { development: !isProductionEnv }],
    tool.babel.disableTypeScript
      ? '@babel/preset-flow'
      : '@babel/preset-typescript',
  ],
  plugins: tool.babel.plugins,
  // node_modules/.cache/babel-loader
  cacheDirectory: true,
};

const styleLoaders = ({
  preprocessor = '',
  enableIsomorphicStyleLoader = false,
  disableCssModules = false,
}) => {
  const styleLoader = enableIsomorphicStyleLoader
    ? // https://github.com/kriasoft/isomorphic-style-loader
      'isomorphic-style-loader'
    : // https://github.com/webpack-contrib/style-loader
      {
        loader: 'style-loader',
        options: {
          hmr: !isProductionEnv,
          sourceMap: !isProductionEnv,
          convertToAbsoluteUrls: !isProductionEnv,
        },
      };
  const loaders = [
    // https://github.com/webpack-contrib/css-loader
    {
      loader: 'css-loader',
      options: {
        // https://github.com/webpack-contrib/css-loader#modules
        modules: !tool.cssModules.disable && !disableCssModules,
        camelCase: !tool.cssModules.disable && tool.cssModules.enableCamelCase,
        localIdentName: '[name]__[local]___[hash:base64:5]',
        minimize: !output.disableMinimize && tool.cssNano,
        sourceMap: !isProductionEnv,
        importLoaders: preprocessor ? 2 : 1,
      },
    },
    // https://github.com/postcss/postcss-loader
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [
          // https://github.com/MoOx/postcss-cssnext
          // http://cssnext.io/usage/
          ...(tool.postCss.disableCssNext
            ? []
            : [
                cssNext({
                  browsers: tool.browserslist,
                  features: tool.postCss.cssNext,
                }),
              ]),
          // https://github.com/seaneking/rucksack
          ...(tool.postCss.disableRucksack
            ? []
            : [rucksack(tool.postCss.rucksack)]),
          // https://www.npmjs.com/package/postcss-utilities
          ...(tool.postCss.disableUtilities
            ? []
            : [postcssUtilities(tool.postCss.utilities)]),
          // https://github.com/peterramsing/lost/wiki/Installation#webpack
          // http://lostgrid.org/docs.html
          lostGrid(),
          // https://www.npmjs.com/package/postcss-easing-gradients
          easingGradients(),
          // https://www.npmjs.com/package/postcss-inline-svg
          postCssInlineSvg(),
          // https://www.npmjs.com/package/postcss-font-magician
          fontMagician(tool.postCss.fontMagician),
          // https://www.npmjs.com/package/postcss-normalize
          postcssNormalize(),
          // https://www.npmjs.com/package/postcss-will-change
          ...(tool.postCss.disableGpuHack ? [] : [postcssWillChange()]),
          // https://www.npmjs.com/package/postcss-brand-colors
          brandColor(),
          // https://www.npmjs.com/package/postcss-nippon-color
          nipponColor(),
          // https://www.npmjs.com/package/postcss-google-color
          googleColor(),
          // https://github.com/postcss/autoprefixer
          autoprefixer({
            ...tool.postCss.autoprefixer,
            browsers: tool.browserslist,
          }),
          postCssReporter(tool.postCss.reporter),
          ...tool.postCss.plugins,
        ],
        sourceMap: !isProductionEnv,
        ..._.pick(tool.postCss, ['exec', 'parser', 'syntax', 'stringifier']),
      },
    },
    // https://github.com/webpack-contrib/sass-loader
    ...(preprocessor === 'scss'
      ? [
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProductionEnv,
              data: tool.scss.data,
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
              sourceMap: !isProductionEnv,
              paths: tool.less.paths,
              plugins: tool.less.plugins,
            },
          },
        ]
      : []),
  ];
  return output.disableExtractCss || enableIsomorphicStyleLoader
    ? [...styleLoader, ...loaders]
    : ExtractTextPlugin.extract({
        fallback: styleLoader,
        use: loaders,
      });
};

const styleRules = ({ preprocessor, test }) => [
  {
    test,
    exclude: _.union(
      getRealPath(tool.cssModules.exclude),
      getRealPath(tool.isormophicStyle.include)
    ),
    use: styleLoaders({
      preprocessor,
    }),
  },
  {
    test,
    include: _.difference(
      getRealPath(tool.cssModules.exclude),
      getRealPath(tool.isormophicStyle.include)
    ),
    use: styleLoaders({
      preprocessor,
      disableCssModules: true,
    }),
  },
  {
    test,
    include: _.difference(
      getRealPath(tool.isormophicStyle.include),
      getRealPath(tool.cssModules.exclude)
    ),
    use: styleLoaders({
      preprocessor,
      enableIsomorphicStyleLoader: true,
    }),
  },
  {
    test,
    include: _.intersection(
      getRealPath(tool.isormophicStyle.include),
      getRealPath(tool.cssModules.exclude)
    ),
    use: styleLoaders({
      preprocessor,
      enableIsomorphicStyleLoader: true,
      disableCssModules: true,
    }),
  },
];

module.exports = {
  context: projectPath,
  entry: entries,
  output: {
    filename:
      isProductionEnv && !output.disableCache
        ? `${output.jsPath}/[name]_[chunkhash].js`
        : `${output.jsPath}/[name].js`,
    chunkFilename:
      isProductionEnv && !output.disableCache
        ? `${output.jsPath}/[name]_[chunkhash].js`
        : `${output.jsPath}/[name].js`,
    path: !output.customPath
      ? path.resolve(projectPath, `build/public/${staticRoot}/`)
      : path.resolve(rootPath, output.customPath),
    publicPath:
      deploy.mode === 'staticweb'
        ? getDeployEnvConfig('staticRoot')
        : deploy.staticRootUrl || `/${staticRoot}/`,
  },
  resolve: {
    alias: Object.assign(
      {
        app: path.resolve(projectPath, srcRoot),
        src: path.resolve(projectPath, srcRoot),
      },
      moduleLoader.alias
    ),
    extensions: moduleLoader.extensions,
    modules: ['node_modules'],
  },
  resolveLoader: {
    modules: ['node_modules'],
  },
  module: {
    noParse: moduleLoader.noParse,
    rules: [
      moduleLoader.js || {
        test: tool.babel.disableTypeScript ? /\.jsx?$/ : /\.[jt]sx?$/,
        use: {
          loader: 'babel-loader',
          options: babelOptions,
          include: getRealPath(tool.babel.include),
        },
      },
      ...styleRules({
        test: /\.scss$/,
        preprocessor: 'scss',
      }),
      ...styleRules({
        test: /\.less$/,
        preprocessor: 'less',
      }),
      ...styleRules({
        test: /\.css$/,
      }),
      ...moduleRules,
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      disable: output.disableExtractCss,
      filename:
        output.cssPath +
        (isProductionEnv && !output.disableCache
          ? '/[name]_[contenthash].css'
          : '/[name].css'),
      allChunks: true,
      ignoreOrder: !tool.cssModules.disable,
    }),
  ],
};

/* eslint-enable node/no-unsupported-features */
