const path = require('path');
const uuidv4 = require('uuid/v4');
const express = require('express');
const superstatic = require('superstatic');
const compression = require('compression');
const helmet = require('helmet');
const errorHandler = require('errorhandler');
const pino = require('express-pino-logger');
const {
  isProductionEnv,
  projectPath,
  output,
  deploy,
} = require('../utils/custom');
const { logger } = require('./logger');

// https://github.com/firebase/superstatic#api
const staticMiddleware = ({ config }) =>
  superstatic({
    config,
    // https://www.npmjs.com/package/compression
    compression: compression(),
    fallthrough: false,
    errorPage: deploy.staticServer.errorPageFor400,
  });

const staticServer = express();
staticServer.staticMiddleware = staticMiddleware;
const staticAssetsRouter = express.Router();
const staticRouter = express.Router();

if (deploy.env === 'local') {
  staticAssetsRouter.use(
    staticMiddleware({
      config: Object.assign({}, deploy.staticAssetsServer.config, {
        public: path.relative(projectPath, output.staticRoot),
      }),
    })
  );
  staticServer.use(deploy.local.staticRoot, staticAssetsRouter);
}

// https://www.npmjs.com/package/express-pino-logger
staticRouter.use(
  pino({
    logger,
  })
);
// https://helmetjs.github.io/
staticRouter.use(
  helmet({
    frameguard: { action: 'sameorigin' },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  })
);
staticRouter.use(helmet.permittedCrossDomainPolicies());
staticRouter.use(helmet.noCache());
staticRouter.use((req, res, next) => {
  res.set('Request-Id', uuidv4());
  next();
});
staticRouter.use(
  staticMiddleware({
    config: Object.assign({}, deploy.staticServer.config, {
      public: path.relative(projectPath, output.htmlRoot),
    }),
  })
);
staticServer.use('/', staticRouter);

if (!isProductionEnv) {
  // https://www.npmjs.com/package/errorhandler
  staticServer.use(errorHandler());
}

module.exports = staticServer;
