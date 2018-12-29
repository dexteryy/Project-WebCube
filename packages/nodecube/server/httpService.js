const express = require('express');
const bodyParser = require('body-parser');
// const getRawBody = require('raw-body');
// const contentType = require('content-type');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const methodOverride = require('method-override');
const helmet = require('helmet');
const errorHandler = require('errorhandler');
const pino = require('express-pino-logger');
const responseTime = require('response-time');
const uuidv4 = require('uuid/v4');
const {
  isProductionEnv,
  // projectPath,
  // projectName,
  projectVersion,
  // ...customConfig
} = require('../utils/custom');
const { logger } = require('./logger');
const corsManager = require('./corsManager');

global.logger = logger;

module.exports = function httpService({
  connectServices = [],
  corsWhitelist = [],
  corsMethods = [],
  corsHeaders = [],
  corsOptions = {},
  version,
  disableCache,
  disableRequestId,
  disableCors,
  disableCorsPreflight,
  disableCompression,
  disableBodyParser,
}) {
  const server = express();
  const service = express.Router();

  server.enable('trust proxy');
  server.set('port', process.env.PORT || 8080);

  server.use(responseTime());

  server.use(
    pino({
      logger,
    })
  );

  if (!disableRequestId) {
    server.use((req, res, next) => {
      res.set('Request-Id', uuidv4());
      next();
    });
  }

  server.use((req, res, next) => {
    res.set('X-API-Version', version || projectVersion);
    next();
  });

  if (!disableBodyParser) {
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
  }

  server.use(cookieParser());

  if (!disableCompression) {
    server.use(compression());
  }

  server.use(methodOverride('X-HTTP-Method'));
  server.use(methodOverride('X-HTTP-Method-Override'));

  // https://helmetjs.github.io/
  server.use(helmet());

  if (disableCache) {
    server.use(helmet.noCache());
  }

  const corsConfig = Object.assign({}, corsOptions, {
    whitelist: corsWhitelist,
    methods: corsMethods,
    headers: corsHeaders,
  });
  if (!disableCors) {
    server.use(corsManager(corsConfig));
  }
  if (!disableCorsPreflight) {
    server.options('*', corsManager(corsConfig));
  }

  if (!process.env.NODECUBE_DISABLE_STAT_API) {
    server.get('/stat', (req, res) => {
      res.json({
        status: 0,
      });
    });
  }

  if (process.env.NODECUBE_ENABLE_INSPECT_API) {
    server.get('/inspect', (req, res) => {
      const { id, baseUrl, protocol, hostname, ip, ips } = req;
      res.json({
        id,
        responseTime: req.responseTime,
        matchedPattern: req.app.mountpath,
        matchedUrl: baseUrl,
        protocol,
        hostname,
        ip,
        ips,
      });
    });
  }

  server.use(service);

  if (!isProductionEnv) {
    server.use(errorHandler());
  }

  server.use((err, req, res, next) => {
    if (err && (!next || res.headersSent)) {
      return;
    }
    res.sendStatus(500);
  });

  Promise.all(connectServices).then(() => {
    server.listen(server.get('port'), () => {
      logger.info(
        `Started on port ${server.get('port')} in ${server.get('env')} mode`
      );
    });
  });

  return {
    server,
    service,
  };
};
