
import config from './webpack.config.babel';

let defaultCode = [];
for (const key in config.entry) {
  if (key !== 'common') {
    defaultCode = config.entry[key].slice(0, -1);
    break;
  }
}

Object.assign(config.entry, {
  /* DO NOT MODIFY THIS! NEW DEMO WILL BE AUTOMATICALLY APPENDED TO HERE */
});

module.exports = config;
