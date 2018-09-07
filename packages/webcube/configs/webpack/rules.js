const {
  configRoot,
  webcubePath,
  webpack,
  js,
  assets,
  marked,
} = require('../../utils/custom');
const babelOptions = require('./babel');
const { styleRules } = require('./style');
const {
  fileLoader,
  assetLoader,
  imageminLoaders,
  htmlLoader,
} = require('./loaders');

const { babel } = js;

/* eslint-disable complexity */
module.exports = (opt = {}) => ({
  babelRules: !webpack.disabledLoaders.js
    ? [
        {
          test: babel.disableTypeScript ? /\.m?jsx?$/ : /\.m?[jt]sx?$/,
          include: babel.include,
          exclude: [/\.worker\.[jt]s$/],
          use: {
            loader: 'babel-loader',
            options: babelOptions({
              isSsrBuild: opt.isSsrBuild,
            }),
          },
        },
      ]
    : [],

  styleRules: (!webpack.disabledLoaders.scss
    ? styleRules({
        test: /\.scss$/,
        preprocessor: 'scss',
      })
    : []
  )
    .concat(
      !webpack.disabledLoaders.less
        ? styleRules({
            test: /\.less$/,
            preprocessor: 'less',
          })
        : []
    )
    .concat(
      !webpack.disabledLoaders.css
        ? styleRules({
            test: /\.css$/,
          })
        : []
    ),

  // https://www.npmjs.com/package/workerize
  // https://www.npmjs.com/package/workerize-loader
  workerizeRules: !webpack.disabledLoaders.workerize
    ? [
        {
          test: /\.worker\.[jt]s$/,
          include: babel.include,
          use: {
            loader: 'workerize-loader',
          },
        },
      ]
    : [],

  i18nextRules: !webpack.disabledLoaders.i18next
    ? [
        {
          test: /locales/,
          include: [configRoot],
          use: {
            loader: '@alienfast/i18next-loader',
            options: { basenameAsNamespace: true },
          },
        },
      ]
    : [],

  // https://www.npmjs.com/package/image-webpack-loader
  imageRules: !webpack.disabledLoaders.image
    ? [
        {
          test: /\.(gif|png|jpe?g|webp)$/i,
          use: [assetLoader, ...imageminLoaders],
        },
      ]
    : [],

  // https://www.npmjs.com/package/svg-url-loader
  svgRules: (!webpack.disabledLoaders.image
    ? [
        {
          test: /\.svg$/i,
          use: [
            Object.assign({}, assetLoader, { loader: 'svg-url-loader' }),
            ...imageminLoaders,
          ],
        },
      ]
    : []
  ).concat([
    // https://www.npmjs.com/package/svg-react-loader
    {
      test: /\.svg$/i,
      include: assets.svgReact.include,
      use: [
        {
          loader: 'svg-react-loader',
          options: assets.svgReact.options,
        },
      ],
    },
  ]),

  fontRules: !webpack.disabledLoaders.font
    ? [
        {
          test: /\.(woff|woff2|eot|ttf|otf|ttc)$/,
          use: [assetLoader],
        },
      ]
    : [],

  mediaRules: !webpack.disabledLoaders.media
    ? [
        {
          // https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats
          test: /\.(webm|ogg|ogv|oga|mogg|mp4|mp3|wav|flac)$/,
          use: [fileLoader],
        },
      ]
    : [],

  // https://www.npmjs.com/package/yaml-loader
  yamlRules: !webpack.disabledLoaders.yaml
    ? [
        {
          test: /\.ya?ml$/,
          use: ['yaml-loader'],
        },
      ]
    : [],

  gqlRules: !webpack.disabledLoaders.gql
    ? [
        {
          test: /\.gql$/,
          use: ['raw-loader'],
        },
      ]
    : [],

  txtRules: !webpack.disabledLoaders.txt
    ? [
        {
          test: /\.txt$/,
          use: ['raw-loader'],
        },
      ]
    : [],

  // for below rules, use dynamic import to generate separated file

  // https://www.npmjs.com/package/html-loader
  htmlRules: !webpack.disabledLoaders.html
    ? [
        {
          test: /\.html$/,
          // https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md
          exclude: webcubePath,
          use: [htmlLoader],
        },
      ]
    : [],

  // https://www.npmjs.com/package/markdown-loader
  markdownRules: !webpack.disabledLoaders.markdown
    ? [
        {
          test: /\.(md|markdown)$/,
          use: [
            htmlLoader,
            {
              loader: 'markdown-loader',
              options: marked,
            },
          ],
        },
      ]
    : [],

  // https://webpack.js.org/migrate/3/#json-loader-is-not-required-anymore
  // jsonRules: !webpack.disabledLoaders.json
  //   ? [
  //       {
  //         // https://ilikekillnerds.com/2018/03/disable-webpack-4-native-json-loader/
  //         type: 'javascript/auto',
  //         test: /\.json$/,
  //         use: !output.disableExtractFrom.json ? [fileLoader] : [],
  //       },
  //     ]
  //   : [],

  // https://www.lucidchart.com/techblog/2018/07/16/why-json-isnt-a-good-configuration-language/
  // https://github.com/toml-lang/toml
  // https://www.npmjs.com/package/toml-loader
  // https://www.npmjs.com/package/toml
  tomlRules: !webpack.disabledLoaders.toml
    ? [
        {
          test: /\.toml$/,
          use: [
            {
              loader: 'toml-loader',
            },
          ],
        },
      ]
    : [],

  // https://www.npmjs.com/package/csv-loader
  csvRules: !webpack.disabledLoaders.csv
    ? [
        {
          test: /\.csv$/,
          use: [
            {
              loader: 'csv-loader',
            },
          ],
        },
      ]
    : [],

  // https://www.npmjs.com/package/xml-loader
  xmlRules: !webpack.disabledLoaders.xml
    ? [
        {
          test: /\.xml$/,
          use: [
            {
              loader: 'xml-loader',
            },
          ],
        },
      ]
    : [],

  // https://github.com/pcardune/handlebars-loader
  handlebarsRules: !webpack.disabledLoaders.handlebars
    ? [
        {
          test: /\.hbs$/,
          use: [
            {
              loader: 'handlebars-loader',
              options: {
                debug: false,
              },
            },
          ],
        },
      ]
    : [],
});
/* eslint-enable complexity */
