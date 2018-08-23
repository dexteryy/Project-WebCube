const path = require('path');
const uuidv4 = require('uuid/v4');
const express = require('express');
const ejs = require('ejs');
const compression = require('compression');
const flash = require('connect-flash');
const helmet = require('helmet');
const errorHandler = require('errorhandler');
const pino = require('express-pino-logger');
const {
  isProductionEnv,
  projectPath,
  output,
  deploy,
} = require('../utils/custom');
const { staticMiddleware } = require('./staticServer');
const ssrRoute = require('./ssrRoute');
const { logger } = require('./logger');

const { errorPageFor500 } = deploy.staticServer;

// https://github.com/firebase/superstatic#api
const ssrServer = express();
const staticAssetsRouter = express.Router();
const ssrRouter = express.Router();

ssrServer.enable('trust proxy');
ssrServer.set('port', process.env.PORT || 8080);
ssrServer.engine('html', ejs.renderFile);

if (deploy.env === 'local') {
  staticAssetsRouter.use(
    staticMiddleware({
      config: Object.assign({}, deploy.staticAssetsServer.config, {
        public: path.relative(projectPath, output.staticRoot),
      }),
    })
  );
  ssrServer.use(deploy.local.staticRoot, staticAssetsRouter);
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
ssrRouter.use(helmet.noCache());
ssrRouter.use((req, res, next) => {
  res.set('Request-Id', uuidv4());
  next();
});

ssrRouter.get(['/:entry/*', '/:entry', '/*'], ssrRoute);

ssrServer.use('/', ssrRouter);

if (!isProductionEnv) {
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
