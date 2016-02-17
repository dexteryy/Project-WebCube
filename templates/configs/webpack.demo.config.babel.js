
import config from './webpack.config.babel';

const defaultCode = config.entry.app.slice(0, -1);

Object.assign(config.entry, {
  /* DO NOT MODIFY THIS! NEW DEMO WILL BE AUTOMATICALLY APPENDED TO HERE */
});

module.exports = config;
