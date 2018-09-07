const i18n = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const i18nBackend = require('i18next-node-fs-backend');
const { deploy } = require('../utils/custom');

i18n
  .use(i18nBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init(deploy.ssrServer.i18nextConfig);

exports.i18n = i18n;
