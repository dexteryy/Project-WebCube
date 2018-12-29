const path = require('path');
const uuidv4 = require('uuid/v4');
const express = require('express');
const ejs = require('ejs');
const compression = require('compression');
const flash = require('connect-flash');
const helmet = require('helmet');
const errorHandler = require('errorhandler');
const bugsnag = require('@bugsnag/js');
const bugsnagExpress = require('@bugsnag/plugin-express');
const pino = require('express-pino-logger');
const i18nextMiddleware = require('i18next-express-middleware');
const {
  isProductionEnv,
  projectVersion,
  projectPath,
  deploy,
} = require('../utils/custom');
const { getDeployConfig, getOutputConfig } = require('../utils/helpers');
const { i18n } = require('./i18n');
const { staticMiddleware } = require('./staticServer');
const ssrRoute = require('./ssrRoute');
const { logger } = require('./logger');

const output = getOutputConfig();

const { errorPageFor500 } = deploy.staticServer;

let bugsnagMiddleware;
if (deploy.ssrServer.bugsnag.apiKey) {
  const bugsnagClient = bugsnag(
    Object.assign(
      {
        appVersion: projectVersion,
        releaseStage: deploy.env,
        logger: {
          info(...args) {
            logger.info(...args);
          },
          warn(...args) {
            logger.warn(...args);
          },
          error(...args) {
            logger.error(...args);
          },
        },
      },
      deploy.ssrServer.bugsnag
    )
  );
  bugsnagClient.use(bugsnagExpress);
  bugsnagMiddleware = bugsnagClient.getPlugin('express');
}

// https://github.com/firebase/superstatic#api
const ssrServer = express();
const staticAssetsRouter = express.Router();
const ssrRouter = express.Router();

ssrServer.enable('trust proxy');
ssrServer.set('port', process.env.PORT || 8080);
ssrServer.engine('html', ejs.renderFile);

if (bugsnagMiddleware) {
  ssrServer.use(bugsnagMiddleware.requestHandler);
}

if (deploy.env === 'development') {
  staticAssetsRouter.use(
    staticMiddleware({
      config: Object.assign({}, deploy.staticAssetsServer.config, {
        public: path.relative(projectPath, output.staticRoot),
      }),
    })
  );
  ssrServer.use(getDeployConfig('development').staticRoot, staticAssetsRouter);
}

// https://www.npmjs.com/package/express-pino-logger
ssrRouter.use(
  pino({
    logger,
  })
);
// https://www.npmjs.com/package/compression
ssrRouter.use(compression());
// https://www.npmjs.com/connect-flash
ssrRouter.use(flash());
// https://helmetjs.github.io/
ssrRouter.use(
  helmet({
    frameguard: { action: 'sameorigin' },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  })
);
ssrRouter.use(helmet.permittedCrossDomainPolicies());
ssrRouter.use((req, res, next) => {
  res.set('Request-Id', uuidv4());
  next();
});

ssrRouter.use(
  i18nextMiddleware.handle(i18n, deploy.ssrServer.i18nextMiddlewareConfig)
);

ssrRouter.get(['/:entry/*', '/:entry', '/*'], ssrRoute);

ssrServer.use('/', ssrRouter);

if (bugsnagMiddleware) {
  ssrServer.use(bugsnagMiddleware.errorHandler);
} else if (!isProductionEnv) {
  // https://www.npmjs.com/package/errorhandler
  ssrServer.use(errorHandler());
}

ssrServer.use((err, req, res, next) => {
  if (err && (!next || res.headersSent)) {
    return null;
  }
  return res.status(500).render(errorPageFor500);
});

module.exports = ssrServer;
