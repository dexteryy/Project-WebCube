const pino = require('pino');
const { isProductionEnv } = require('../utils/custom');

const logger = pino({
  prettyPrint: !isProductionEnv ? { colorize: true } : false,
  prettifier: require('pino-pretty'),
});

exports.logger = logger;
