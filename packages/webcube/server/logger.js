const pino = require('pino');
const { isProductionEnv } = require('../utils/custom');
const { getDeployConfig } = require('../utils/helpers');

const logger = pino({
  prettyPrint: !isProductionEnv ? { colorize: true } : false,
  prettifier: require('pino-pretty'),
  level:
    process.env.WEBCUBE_LOG_LEVEL ||
    (isProductionEnv && getDeployConfig().logLevel) ||
    'debug',
});

exports.logger = logger;
