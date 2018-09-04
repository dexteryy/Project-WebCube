#!/usr/bin/env node
const program = require('commander');
const logger = require('../utils/logger');
const { dev, deploy } = require('../utils/custom');

program.parse(process.argv);

const { PORT = dev.port, HOST } = process.env;

if (deploy.mode !== 'static' && deploy.mode !== 'ssr') {
  logger.info(`The web server is not needed in "${deploy.mode}" mode`);
  process.exit(0);
}

function listener(err) {
  if (err) {
    console.error(err);
    logger.fail();
  }
  logger.success(
    `Running successfully in ${
      deploy.mode === 'ssr' ? 'server-side rendering' : 'static server'
    } mode. Listening at http://${HOST || 'localhost'}:${PORT}`
  );
}

function startServer() {
  const server =
    deploy.mode === 'ssr'
      ? require('../server/ssrServer')
      : require('../server/staticServer');
  if (HOST) {
    server.listen(PORT, HOST, listener);
  } else {
    server.listen(PORT, listener);
  }
}

startServer();
