const { merge } = require('lodash');
const escapeStringRegexp = require('escape-string-regexp');
const { config, custom } = require('./base');
const deploy = require('./deploy');

const { staticAssetsServer } = deploy;

const { projectName, entries } = config;

if (!custom.dev) {
  custom.dev = {};
}

const dev = merge(
  {
    port: 8000,
  },
  custom.dev
);

if (!custom.dev.server) {
  custom.dev.server = {};
}

dev.server = merge({}, custom.dev.server);

dev.server.headers = []
  .concat(staticAssetsServer.defaultHeaders)
  .concat(custom.dev.server.headers || []);

// https://github.com/bripkens/connect-history-api-fallback#options
dev.server.rewrites = Object.keys(entries)
  .map(entry => ({
    from: new RegExp(`${escapeStringRegexp(`/${entry}`)}`),
    to(context) {
      // @bug
      const realEntry = (/^.*?\/([^/]+)/.exec(context.parsedUrl.href) || [])[1];
      if (realEntry === entry) {
        return `/${entry}/index.html`;
      }
      return context.parsedUrl.href;
    },
  }))
  .concat([
    {
      from: new RegExp(escapeStringRegexp(deploy.local.staticRoot)),
      to(context) {
        return context.parsedUrl.href.replace(
          new RegExp(`^${escapeStringRegexp(deploy.local.staticRoot)}`),
          ''
        );
      },
    },
  ])
  .concat(
    Object.keys(entries)
      .filter(entry => entry === projectName)
      .map(entry => ({
        from: /^\//,
        to: `/${entry}/index.html`,
      }))
  )
  .concat(custom.dev.server.rewrites || []);

module.exports = dev;
