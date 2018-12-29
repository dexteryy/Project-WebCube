const pino = require('pino');
const { isProductionEnv } = require('../utils/custom');

// http://getpino.io/
const logger = pino({
  prettyPrint: !isProductionEnv ? { colorize: true } : false,
  prettifier: require('pino-pretty'),
  level:
    process.env.NODECUBE_LOG_LEVEL || (isProductionEnv && 'info') || 'debug',
});

exports.logger = logger;
