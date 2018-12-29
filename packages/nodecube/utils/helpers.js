const { spawn } = require('child_process');
const logger = require('webcube/utils/logger');

exports.runCmd = function runCmd(cmd, opt = {}) {
  return new Promise(resolve => {
    if (!opt.quiet) {
      logger.info(cmd);
    }
    const child = spawn(cmd, {
      stdio: 'inherit',
      shell: true,
    });
    child.on('exit', code => {
      if (code) {
        process.exit(code);
      }
      resolve();
    });
  });
};
