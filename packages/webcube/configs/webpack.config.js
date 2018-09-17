const path = require('path');
const fs = require('fs');
const { pathExistsSync } = require('fs-extra');
const escapeStringRegexp = require('escape-string-regexp');
// Webpack plugins
const { DefinePlugin } = require('webpack');
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
//
const cssNanoProcessor = require('cssnano');
const {
  projectPath,
  webcubePath,
  configRoot,
  mode,
  isProductionEnv,
  entries,
  output,
  dev,
  deploy,
  webpack,
  js,
  css,
  assets,
} = require('../utils/custom');
const {
  getDeployConfig,
  getOutputConfig,
  getExcludeSplitChunks,
  entryNameToId,
  getWebpackStats,
} = require('../utils/helpers');
const rules = require('./webpack/rules');
const { styleEntries } = require('./webpack/style');

const loaderRules = rules();

let faviconSource = path.join(projectPath, assets.favicon.logo);
if (!pathExistsSync(faviconSource)) {
  faviconSource = path.join(webcubePath, 'configs/webcube.png');
}
assets.favicon.logo = faviconSource;

module.exports = {
  // https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a
  mode,
  context: projectPath,
  entry: entries,
  output: {
    filename:
      isProductionEnv && !getOutputConfig().disableCache
        ? `${getOutputConfig().jsRoot}/[name]_[contenthash].js`
        : `${getOutputConfig().jsRoot}/[name].js`,
    chunkFilename:
      isProductionEnv && !getOutputConfig().disableCache
        ? `${getOutputConfig().jsRoot}/[name]_[contenthash].js`
        : `${getOutputConfig().jsRoot}/[name].js`,
    path: output.staticRoot,
    // https://webpack.js.org/configuration/output/#output-publicpath
    // the value of this option ends with / in most cases
    publicPath: getDeployConfig().staticRoot,
  },
  resolve: webpack.resolve,
  resolveLoader: {
    // https://webpack.js.org/configuration/resolve/#resolveloader
    modules: [path.join(webcubePath, 'node_modules'), 'node_modules'],
  },
  module: {
    // https://webpack.js.org/configuration/module/#module-noparse
    noParse: webpack.noParse,
    rules: Array.prototype.concat
      .apply(
        [],
        Object.keys(loaderRules).map(ruleName => loaderRules[ruleName])
      )
      .concat(webpack.moduleRules),
  },
  // https://webpack.js.org/configuration/devtool/
  devtool: !getOutputConfig().disableSourceMap
    ? (isProductionEnv &&
        (((getOutputConfig().enableSourceMapOptimize ||
          // https://github.com/webpack-contrib/babel-minify-webpack-plugin/issues/68
          // bug hack
          !output.enableUglify) &&
          'cheap-module-source-map') ||
          'source-map')) ||
      ((getOutputConfig().enableSourceMapOptimize &&
        'cheap-module-eval-source-map') ||
        'inline-source-map')
    : false,
  stats: getWebpackStats(),
  recordsPath: path.join(output.buildRoot, 'records/records.json'),
  // https://webpack.js.org/configuration/performance/
  performance: {
    hints: isProductionEnv ? 'warning' : false,
    maxEntrypointSize: output.maxEntrypointSize,
    maxAssetSize: output.maxAssetSize,
  },
  // optimization options affected by `mode`:
  // https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a
  optimization: {
    // https://webpack.js.org/configuration/optimization/#optimization-minimize
    minimize: isProductionEnv && !getOutputConfig().disableMinimize,
    minimizer: [
      ...(output.enableUglify
        ? [
            // https://github.com/webpack-contrib/uglifyjs-webpack-plugin
            // https://github.com/webpack/webpack/blob/master/package.json#L30
            new UglifyJsPlugin({
              sourceMap: !getOutputConfig().disableSourceMap,
            }),
          ]
        : // https://webpack.js.org/plugins/babel-minify-webpack-plugin/
          [new MinifyPlugin(js.minifyOptions, {})]),
      // https://www.npmjs.com/package/mini-css-extract-plugin#minimizing-for-production
      // https://github.com/NMFR/optimize-css-assets-webpack-plugin#configuration
      new OptimizeCSSAssetsPlugin({
        cssProcessor: cssNanoProcessor,
        cssProcessorOptions: css.cssNano,
      }),
    ],
    // https://webpack.js.org/plugins/split-chunks-plugin/
    splitChunks: {
      // https://webpack.js.org/plugins/split-chunks-plugin/#defaults
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      // must set to `async` and `1` for HtmlWebpackPlugin's `chunks`
      // solution: `excludeChunks`
      maxInitialRequests: output.maxInitialRequests,
      chunks: 'all',
      automaticNameDelimiter: output.chunkDelimiter,
      // https://webpack.js.org/plugins/split-chunks-plugin/#splitchunks-chunks
      cacheGroups: {
        // https://www.npmjs.com/package/mini-css-extract-plugin#extracting-css-based-on-entry
        ...styleEntries,
      },
    },
  },
  plugins: [
    // this plugin MUST be the FIRST (for create-cube-dev's hacking)
    // https://www.npmjs.com/package/webpack-bundle-analyzer
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: path.join(
        output.buildRoot,
        'bundle-analyzer/report.html'
      ),
      statsFilename: path.join(output.buildRoot, 'bundle-analyzer/stats.json'),
    }),
    // https://webpack.js.org/plugins/define-plugin/
    new DefinePlugin({
      ...webpack.injectedGlobalVars,
      'process.env': webpack.exposedEnv,
    }),
    // https://www.npmjs.com/package/lodash-webpack-plugin#feature-sets
    // new LodashModuleReplacementPlugin(),
    // https://github.com/erm0l0v/webpack-md5-hash/issues/19
    // https://www.npmjs.com/package/webpack-chunk-hash
    // https://codeburst.io/avoid-using-webpack-md5-hash-when-using-long-term-caching-f460a6f03551
    // ...(!output.disableMd5Hash
    //   ? [new WebpackChunkHash({ algorithm: 'md5' })]
    //   : []),
    // https://github.com/webpack-contrib/extract-text-webpack-plugin#usage
    // https://www.npmjs.com/package/mini-css-extract-plugin
    ...(!output.disableCssExtract
      ? [
          new MiniCssExtractPlugin({
            filename:
              isProductionEnv && !getOutputConfig().disableCache
                ? `${getOutputConfig().cssRoot}/[name]_[contenthash].css`
                : `${getOutputConfig().cssRoot}/[name].css`,
            chunkFilename:
              isProductionEnv && !getOutputConfig().disableCache
                ? `${getOutputConfig().cssRoot}/[name]_[contenthash].css`
                : `${getOutputConfig().cssRoot}/[name].css`,
          }),
        ]
      : []),
    new ManifestPlugin(),
    new ReactLoadablePlugin({
      filename: path.join(output.buildRoot, 'manifest/react-loadable.json'),
    }),
    // https://github.com/jantimon/html-webpack-plugin
    ...Object.keys(entries).map(entry => {
      const customTemplate = path.join(
        configRoot,
        'staticweb',
        `${entry}/index.hbs`
      );
      const customHeadHtml = path.join(
        configRoot,
        'staticweb',
        `${entry}/head.hbs`
      );
      const customBodyHtml = path.join(
        configRoot,
        'staticweb',
        `${entry}/body.hbs`
      );
      return new HtmlWebpackPlugin({
        filename: path.join(output.htmlRoot, entry, 'index.html'),
        inject: output.enableBodyInject ? 'body' : 'head',
        chunks: output.maxInitialRequests > 1 ? undefined : [entry],
        excludeChunks:
          output.maxInitialRequests > 1
            ? getExcludeSplitChunks(entries, entry)
            : '',
        minify: isProductionEnv && deploy.htmlMinifier,
        inlineSource: '.(js|css)$',
        alwaysWriteToDisk: true,
        showErrors: !isProductionEnv,
        // https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md
        // https://github.com/jantimon/html-webpack-plugin#writing-your-own-templates
        template: pathExistsSync(customTemplate)
          ? customTemplate
          : path.join(webcubePath, 'configs/template.hbs'),
        headHtml:
          (dev.enableCustomHtml || isProductionEnv) &&
          pathExistsSync(customHeadHtml) &&
          fs.readFileSync(customHeadHtml),
        bodyHtml:
          (dev.enableCustomHtml || isProductionEnv) &&
          pathExistsSync(customBodyHtml) &&
          fs.readFileSync(customBodyHtml),
        appMountIds: output.appMountIds,
        appMountId: entryNameToId(entry),
      });
    }),
    // https://github.com/jantimon/html-webpack-harddisk-plugin
    // new HtmlWebpackHarddiskPlugin(),
    // https://github.com/jantimon/favicons-webpack-plugin
    new FaviconsWebpackPlugin(assets.favicon),
    // https://www.npmjs.com/package/html-webpack-inline-source-plugin
    ...(output.enableInlineSource ? [new HtmlWebpackInlineSourcePlugin()] : []),
    // https://www.npmjs.com/package/preload-webpack-plugin
    // https://github.com/GoogleChromeLabs/preload-webpack-plugin/issues/60
    ...(!output.disablePreload
      ? [
          new PreloadWebpackPlugin({
            rel: 'preload',
            include: output.preloadInclude,
            fileBlacklist: [/\.map/]
              .concat(
                output.enableInlineSource
                  ? Object.keys(entries).map(
                      entry => new RegExp(escapeStringRegexp(entry))
                    )
                  : []
              )
              .concat(output.preloadBlacklist),
          }),
        ]
      : []),
    // https://developers.google.com/web/tools/workbox/guides/generate-service-worker/webpack
    // https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
    ...(!output.disableWorkbox
      ? [
          new WorkboxPlugin.GenerateSW({
            swDest: `${getOutputConfig().jsRoot}/service-worker.js`,
            importsDirectory: `${getOutputConfig().jsRoot}/workbox-imports`,
            importWorkboxFrom: 'local',
            excludeChunks: output.enableInlineSource
              ? getExcludeSplitChunks(entries)
              : [],
          }),
        ]
      : []),
  ],
};
