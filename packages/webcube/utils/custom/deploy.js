const path = require('path');
const { merge } = require('lodash');
const logger = require('../logger');
const { config, custom } = require('./base');

const { projectName, entries } = config;

if (!custom.deploy) {
  custom.deploy = {};
}

const deploy = merge(
  {
    mode: 'ssr',
    production: {
      staticCloud: 's3',
      // https://webpack.js.org/configuration/output/#output-publicpath
      // the value of this option ends with / in most cases
      staticRoot: '/static/',
    },
    staging: {
      staticCloud: 's3',
      staticRoot: '/static/',
    },
    local: {
      // used in dev server rewrites rules
      staticRoot: '/static/',
    },
  },
  custom.deploy,
  {
    env: process.env.DEPLOY_ENV || 'local',
    mode: process.env.DEPLOY_MODE || undefined,
  }
);

Object.keys(deploy).forEach(deployEnv => {
  if (
    deployEnv === 'local' ||
    typeof deployEnv !== 'object' ||
    !deployEnv.staticRoot
  ) {
    return;
  }
  if (!/\/$/.test(deployEnv.staticRoot)) {
    logger.fail(
      `Invalid deploy.${deployEnv}.staticRoot "${
        deployEnv.staticRoot
      }". It must end with "/"`
    );
  }
});
if (!/^\/(.+\/$|$)/.test(deploy.local.staticRoot)) {
  logger.fail(
    `Invalid deploy.local.staticRoot "${
      deploy.local.staticRoot
    }". It must start and end with "/"`
  );
}

// https://github.com/kangax/html-minifier#options-quick-reference
deploy.htmlMinifier = merge(
  {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true,
  },
  custom.deploy.htmlMinifier
);

if (!custom.deploy.staticServer) {
  custom.deploy.staticServer = { config: {} };
}

// https://github.com/firebase/superstatic#configuration
deploy.staticServer = merge(
  {
    config: {
      cleanUrls: true,
      trailingSlash: true,
    },
  },
  custom.deploy.staticServer,
  {
    errorPageFor400: custom.deploy.staticServer.errorPageFor400
      ? path.join(config.configRoot, custom.deploy.staticServer.errorPageFor400)
      : path.join(config.webcubePath, 'configs/404.html'),
    errorPageFor500: custom.deploy.staticServer.errorPageFor500
      ? path.join(config.configRoot, custom.deploy.staticServer.errorPageFor500)
      : path.join(config.webcubePath, 'configs/500.html'),
  }
);

deploy.staticServer.config.headers = [].concat(
  custom.deploy.staticServer.config.headers || []
);

deploy.staticServer.config.rewrites = Object.keys(entries)
  .map(entry => ({
    source: `/${entry}/**`,
    destination: `${entry}/index.html`,
  }))
  .concat(
    Object.keys(entries)
      .filter(entry => entry === projectName)
      .map(entry => ({
        source: '/**',
        destination: `${entry}/index.html`,
      }))
  )
  .concat(custom.deploy.staticServer.config.rewrites || []);

if (!custom.deploy.staticAssetsServer) {
  custom.deploy.staticAssetsServer = { config: {} };
}

// https://github.com/firebase/superstatic#configuration
deploy.staticAssetsServer = merge({}, custom.deploy.staticAssetsServer, {
  defaultHeaders: [
    {
      source: '**/*.@(woff|woff2|eot|ttf|otf|ttc)',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: '*',
        },
      ],
    },
  ],
});

deploy.staticAssetsServer.config.headers = []
  .concat(deploy.staticAssetsServer.defaultHeaders)
  .concat(custom.deploy.staticAssetsServer.config.headers || []);

deploy.staticAssetsServer.config.rewrites = [].concat(
  custom.deploy.staticAssetsServer.config.rewrites || []
);

if (!custom.deploy.ssrServer) {
  custom.deploy.ssrServer = {};
}

deploy.ssrServer = merge({}, custom.deploy.ssrServer);

const warmUpUrls = { [projectName]: [] };
(custom.deploy.ssrServer.warmUpUrls || [])
  .map(url => url.replace(/^.*?\//, '/'))
  .forEach(url => {
    const entry = /\/([^/]+)/.exec(url);
    if (entries[entry]) {
      if (!warmUpUrls[entry]) {
        warmUpUrls[entry] = [];
      }
      warmUpUrls[entry].push(url);
    } else {
      warmUpUrls[projectName].push(url);
    }
  });
deploy.ssrServer.warmUpUrls = warmUpUrls;

module.exports = deploy;
