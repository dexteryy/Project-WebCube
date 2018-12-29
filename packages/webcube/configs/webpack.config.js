const path = require('path');
const fs = require('fs');
const { pathExistsSync } = require('fs-extra');
const escapeStringRegexp = require('escape-string-regexp');
// Webpack plugins
const { DefinePlugin, ContextReplacementPlugin } = require('webpack');
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
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

const output = getOutputConfig();

const loaderRules = rules();

let faviconSource = path.join(projectPath, assets.icon.favicon);
if (!pathExistsSync(faviconSource)) {
  faviconSource = path.join(webcubePath, 'configs/webcube.png');
}
let appIconSource = path.join(projectPath, assets.icon.icon);
if (!pathExistsSync(appIconSource)) {
  appIconSource = path.join(webcubePath, 'configs/webcube.png');
}

module.exports = {
  // https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a
  mode,
  context: projectPath,
  entry: entries,
  output: {
    filename:
      isProductionEnv && !output.disableCache
        ? `${output.jsRoot}/[name]_[contenthash].js`
        : `${output.jsRoot}/[name].js`,
    chunkFilename:
      isProductionEnv && !output.disableCache
        ? `${output.jsRoot}/[name]_[contenthash].js`
        : `${output.jsRoot}/[name].js`,
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
  devtool: !output.disableSourceMap
    ? (isProductionEnv &&
        (((output.enableSourceMapOptimize ||
          // https://github.com/webpack-contrib/babel-minify-webpack-plugin/issues/68
          // bug hack
          output.minimizer === 'minify') &&
          'cheap-module-source-map') ||
          'source-map')) ||
      ((output.enableSourceMapOptimize && 'cheap-module-eval-source-map') ||
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
    minimize: isProductionEnv && !output.disableMinimize,
    minimizer: [
      ...((output.minimizer === 'minify' && [
        // https://webpack.js.org/plugins/babel-minify-webpack-plugin/
        // No tree shaking
        // https://github.com/webpack-contrib/babel-minify-webpack-plugin/issues/43
        // No babel 7
        // https://github.com/webpack-contrib/babel-minify-webpack-plugin/issues/83
        new MinifyPlugin(js.minifyOptions, {}),
      ]) ||
        (output.minimizer === 'terser' && [
          // https://github.com/webpack-contrib/terser-webpack-plugin
          new TerserPlugin({
            terserOptions: js.uglifyOptions,
            sourceMap: !output.disableSourceMap,
          }),
        ]) || [
          // https://github.com/webpack-contrib/uglifyjs-webpack-plugin
          // https://github.com/webpack/webpack/blob/master/package.json#L30
          // uglify-js v3 https://github.com/webpack-contrib/uglifyjs-webpack-plugin/issues/349
          new UglifyJsPlugin({
            uglifyOptions: js.uglifyOptions,
            sourceMap: !output.disableSourceMap,
          }),
        ]),
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
      maxSize: output.maxChunkSize,
      minSize: output.minChunkSize,
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
              isProductionEnv && !output.disableCache
                ? `${output.cssRoot}/[name]_[contenthash].css`
                : `${output.cssRoot}/[name].css`,
            chunkFilename:
              isProductionEnv && !output.disableCache
                ? `${output.cssRoot}/[name]_[contenthash].css`
                : `${output.cssRoot}/[name].css`,
          }),
        ]
      : []),
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // load `moment/locale/*.js`
    new ContextReplacementPlugin(
      /moment[/\\]locale$/,
      new RegExp(output.momentLocaleWhitelist.join('|'))
    ),
    new ManifestPlugin(),
    new ReactLoadablePlugin({
      filename: path.join(output.buildRoot, 'manifest/react-loadable.json'),
    }),
    // https://github.com/jantimon/html-webpack-plugin
    ...Object.keys(entries).map(entry => {
      const customTemplate = path.join(
        configRoot,
        getDeployConfig().staticWebRoot,
        `${entry}/index.hbs`
      );
      const customHeadHtml = path.join(
        configRoot,
        getDeployConfig().staticWebRoot,
        `${entry}/head.hbs`
      );
      const customBodyHtml = path.join(
        configRoot,
        getDeployConfig().staticWebRoot,
        `${entry}/body.hbs`
      );
      return new HtmlWebpackPlugin({
        filename: path.join(output.htmlRoot, entry, 'index.html'),
        inject: output.enableHeadInject ? 'head' : 'body',
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
          pathExistsSync(customHeadHtml) && fs.readFileSync(customHeadHtml),
        bodyHtml:
          pathExistsSync(customBodyHtml) && fs.readFileSync(customBodyHtml),
        appMountIds: output.appMountIds,
        appMountId: entryNameToId(entry),
        enableUserScalable: output.enableUserScalable,
      });
    }),
    // https://github.com/jantimon/html-webpack-harddisk-plugin
    new HtmlWebpackHarddiskPlugin(),
    // https://github.com/jantimon/favicons-webpack-plugin
    new FaviconsWebpackPlugin({
      ...assets.icon,
      logo: faviconSource,
      icons: {
        favicons: assets.icon.platforms.favicons,
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false,
      },
    }),
    new FaviconsWebpackPlugin({
      ...assets.icon,
      logo: appIconSource,
      icons: {
        ...assets.icon.platforms,
        favicons: false,
      },
    }),
    // https://www.npmjs.com/package/html-webpack-inline-source-plugin
    ...(output.enableInlineSource ? [new HtmlWebpackInlineSourcePlugin()] : []),
    // https://www.npmjs.com/package/preload-webpack-plugin
    // https://github.com/GoogleChromeLabs/preload-webpack-plugin/issues/60
    ...(output.enablePreload
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
            swDest: `${output.jsRoot}/service-worker.js`,
            importsDirectory: `${output.jsRoot}/workbox-imports`,
            importWorkboxFrom: 'local',
            excludeChunks: output.enableInlineSource
              ? getExcludeSplitChunks(entries)
              : [],
          }),
        ]
      : []),
  ],
};
