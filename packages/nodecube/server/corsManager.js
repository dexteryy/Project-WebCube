const cors = require('cors');
const { union } = require('lodash');

const isProductionEnv = process.env.NODE_ENV === 'production';

const METHODS = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];
const HEADERS = ['Link', 'X-API-Version'];

function corsConfig({
  whitelist = [],
  methods = [],
  headers = [],
  skipWhitelist = !isProductionEnv,
  ...options
}) {
  const whitelistSet = new Set(whitelist);
  return Object.assign(
    {
      origin: !skipWhitelist
        ? (origin, callback) => {
            callback(
              null,
              whitelistSet &&
                (whitelistSet.has('*') || whitelistSet.has(origin))
            );
          }
        : true,
      methods: union(methods, METHODS).join(','),
      exposedHeaders: union(headers, HEADERS),
      credentials: true,
    },
    options
  );
}

function corsManager(opt) {
  return (req, res, next) => cors(corsConfig(opt))(req, res, next);
}

corsManager._testConfig = corsConfig;

module.exports = corsManager;
