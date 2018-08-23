const c = require('ansi-colors');
// https://www.npmjs.com/package/supports-color
// https://github.com/webpack/webpack-cli/blob/faeec57c50e06facd67bcae71ffe5a65cf155893/bin/cli.js#L327
const supportsColor =
  process.stdout.isTTY === true && require('supports-color').stdout;

const cyan = supportsColor ? m => c.bold.cyan(m) : m => m;
const yellow = supportsColor ? m => c.bold.yellow(m) : m => m;
const green = supportsColor ? m => c.bold.green(m) : m => m;
const red = supportsColor ? m => c.bold.red(m) : m => m;

module.exports = {
  supportsColor,
  info(msg, info = '') {
    console.info(`${cyan(`[WEBCUBE] ${msg}`)} ${info}`);
  },
  warn(msg, info = '') {
    console.info(`${yellow(`[WEBCUBE] ${msg}`)} ${info}`);
  },
  error(msg = '', info = '') {
    console.info(`${red(`[WEBCUBE] ${msg}`)} ${info}`);
  },
  success(msg = 'Success!', info = '') {
    console.info(`${green(`[WEBCUBE] ${msg}`)} ${info}`);
  },
  fail(msg = 'Failed!', info = '') {
    console.info(`${red(`[WEBCUBE] ${msg}`)} ${info}`);
    process.exit(1);
  },
};
