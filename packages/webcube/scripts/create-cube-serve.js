const program = require('commander');
const logger = require('../utils/logger');
const { dev, deploy } = require('../utils/custom');

program.parse(process.argv);

const HOST = process.env.HOST || dev.host;
const PORT = process.env.PORT || dev.port;

if (deploy.mode !== 'static' && deploy.mode !== 'ssr') {
  logger.info(`The web server is not needed in "${deploy.mode}" mode`);
  process.exit(0);
}

function startServer() {
  (deploy.mode === 'ssr'
    ? require('../server/ssrServer')
    : require('../server/staticServer')
  ).listen(PORT, HOST, err => {
    if (err) {
      console.error(err);
      logger.fail();
    }
    logger.success(
      `Running successfully in ${
        deploy.mode === 'ssr' ? 'server-side rendering' : 'static server'
      } mode. Listening at http://${HOST}:${PORT}`
    );
  });
}

startServer();
