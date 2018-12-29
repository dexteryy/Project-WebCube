const { merge } = require('lodash');
const { custom } = require('./base');

if (!custom.assets) {
  custom.assets = {};
}

const assets = merge(
  {
    // https://www.npmjs.com/package/image-webpack-loader
    imagemin: {
      webp: {
        enabled: true,
      },
    },
    // https://www.npmjs.com/package/url-loader#limit
    dataUriLimit: 1024 * 8,
    // https://www.npmjs.com/package/svg-react-loader
    svgReact: {
      include: [],
      options: {
        classIdPrefix: '[name]-[hash:8]__',
      },
    },
    // https://github.com/jantimon/favicons-webpack-plugin
    icon: {
      favicon: 'config/favicon.png',
      icon: 'config/icon.png',
      prefix: 'brand/icons-[hash]/',
      // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
      // background: '#fff',
      // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
      // title: 'Webpack App',
      // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
      platforms: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: true,
        twitter: true,
        yandex: false,
        windows: true,
      },
    },
    // https://marked.js.org/#/USING_ADVANCED.md#options
    marked: {},
  },
  custom.assets,
  {
    icon: {
      persistentCache: true,
      inject: true,
    },
  }
);

module.exports = assets;
