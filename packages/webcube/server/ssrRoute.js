const path = require('path');
const fs = require('fs');
const util = require('util');
const { ensureFile } = require('fs-extra');
const { createElement } = require('react');
const { renderToString } = require('react-dom/server');
const { ServerStyleSheet, StyleSheetManager } = require('styled-components');
const { StaticRouter } = require('react-router');
const Loadable = require('react-loadable');
const { Helmet } = require('react-helmet');
const { getBundles } = require('react-loadable/webpack');
const {
  projectName,
  ssrEntries,
  entries,
  output,
  deploy,
} = require('../utils/custom');
const { entryNameToId } = require('../utils/helpers');
const { logger } = require('./logger');

// const manifest = require(path.join(output.staticRoot, 'manifest.json'));
let loadableStats = {};
try {
  const loadableManifestPath = path.join(
    output.buildRoot,
    'manifest/react-loadable.json'
  );
  fs.accessSync(loadableManifestPath);
  loadableStats = require(loadableManifestPath);
} catch (ex) {}
const { errorPageFor400, errorPageFor500 } = deploy.staticServer;

const RE_IS_CSS = /\.css$/;
const RE_IS_JS = /\.js$/;
const RE_FIRST_BODY_SCRIPT = /<body>([\s\S\n\r]*?)(<script[\s>])/;
const RE_FIRST_HEAD_SCRIPT = /<head>([\s\S\n\r]*?)(<script[\s>])/;
const RE_LAST_IN_HEAD = /<\/head>/;
const RE_TITLE = /<title>[\s\S\n\r]*?<\/title>/;
const RE_AFTER_TITLE = /<\/title>/;
const RE_HTML_ATTR = /<html[^>]*>/;
const RE_BODY_ATTR = /<body[^>]*>/;
const RE_MOUNT_CONTAINERS = {};

const entryData = {};
Object.keys(entries).forEach(entry => {
  logger.info(`[WEBCUBE] Warm up entry "${entry}"`);
  const entryHtmlPath = path.join(output.htmlRoot, entry, 'index.html');
  const entryCodePath = ssrEntries[entry]
    ? path.join(output.buildRoot, 'ssr', 'js', `${entry}.js`)
    : '';
  const exportedEntryCodePath = path.join(
    output.buildRoot,
    'ssr',
    'exports',
    `${entry}.js`
  );
  RE_MOUNT_CONTAINERS[entry] = new RegExp(
    `<div.+id="${entryNameToId(entry)}"></div>`
  );
  entryData[entry] = Promise.all([
    (async () => {
      logger.info(`[WEBCUBE] Load HTML file from ${entryHtmlPath}`);
      try {
        await util.promisify(fs.access)(entryHtmlPath);
        const entryHtml = await util.promisify(fs.readFile)(entryHtmlPath);
        return entryHtml.toString();
      } catch (ex) {
        logger.error(ex);
        return '';
      }
    })(),
    (async () => {
      try {
        logger.info(
          `[WEBCUBE] Load source code for SSR entry file from ${entryCodePath}`
        );
        if (!entryCodePath) {
          return '';
        }
        await util.promisify(fs.access)(entryCodePath);
        const entryCode = await util.promisify(fs.readFile)(entryCodePath);
        logger.info(
          `[WEBCUBE] Generate SSR entry file: ${exportedEntryCodePath}`
        );
        await util.promisify(ensureFile)(exportedEntryCodePath);
        await util.promisify(fs.writeFile)(
          exportedEntryCodePath,
          `let __WebcubeSsrExports__;${entryCode}module.exports=__WebcubeSsrExports__;`
        );
        return exportedEntryCodePath;
      } catch (ex) {
        logger.error(ex);
        return '';
      }
    })(),
  ]);
  (async () => {
    // preload all code
    let Entry;
    try {
      const [html, codePath] = await entryData[entry];
      if (!html || !codePath) {
        return;
      }
      logger.info(
        `[WEBCUBE] Import app code from "${codePath}" for warming entry "${entry}"`
      );
      try {
        Entry = require(codePath);
      } catch (ex) {
        logger.error('[WEBCUBE] Failed to import code');
        logger.error(ex);
      }
    } catch (ex) {
      logger.error("[WEBCUBE] Failed to load entry's html and code path");
      logger.error(ex);
    }
    // warm up loadable components
    // https://github.com/jamiebuilds/react-loadable#------------server-side-rendering
    // https://github.com/jamiebuilds/react-loadable#loadablepreloadall
    const urls = deploy.ssrServer.warmUpUrls[entry];
    if (urls) {
      urls.forEach(url => {
        logger.info(`[WEBCUBE] Render "${entry}" for warming up url: "${url}"`);
        ssrRender({
          Entry,
          entry,
          url,
        });
      });
    }
  })();
});
const mainEntry = Object.keys(entries).find(entry => entry === projectName);

function injectSsrHtml(
  originHtml,
  { entry, html, bundles, styleTags, helmet, store, requestId }
) {
  let entryHtml;
  try {
    entryHtml = originHtml.replace(
      RE_MOUNT_CONTAINERS[entry],
      `<div id="${entryNameToId(entry)}">${html}</div>`
    );
  } catch (ex) {
    logger.error(`[WEBCUBE] [${requestId}] Failed to inject HTML string`);
    logger.error(ex);
  }
  const hasScriptInHead = RE_FIRST_HEAD_SCRIPT.test(entryHtml);
  try {
    const cssBundles = bundles.filter(bundle =>
      RE_IS_CSS.test(bundle.publicPath)
    );
    const jsBundles = bundles.filter(bundle =>
      RE_IS_JS.test(bundle.publicPath)
    );
    if (cssBundles.length) {
      entryHtml = entryHtml.replace(
        RE_LAST_IN_HEAD,
        $0 =>
          cssBundles
            .map(
              bundle =>
                `<link rel="stylesheet" href=${bundle.publicPath}></link>`
            )
            .join('') + $0
      );
    }
    if (jsBundles.length) {
      // It is important that the bundles are included before the main bundle, so that they can be loaded by the browser prior to the app rendering.
      // https://github.com/jamiebuilds/react-loadable#------------server-side-rendering
      entryHtml = entryHtml.replace(
        hasScriptInHead ? RE_FIRST_HEAD_SCRIPT : RE_FIRST_BODY_SCRIPT,
        ($0, $1, $2) =>
          `${hasScriptInHead ? '<head>' : '<body>'}${$1}${jsBundles
            .map(bundle => `<script src=${bundle.publicPath}></script>`)
            .join('')}${$2}`
      );
    }
  } catch (ex) {
    logger.error(`[WEBCUBE] [${requestId}] Failed to inject loadable bundles`);
    logger.error(ex);
  }
  try {
    if (store) {
      const initialStateTag = `<script>window._webcubeInitialState = ${JSON.stringify(
        store.getState()
      )}</script>`;
      entryHtml = entryHtml.replace(
        hasScriptInHead ? RE_FIRST_HEAD_SCRIPT : RE_FIRST_BODY_SCRIPT,
        ($0, $1, $2) =>
          `${hasScriptInHead ? '<head>' : '<body>'}${$1}${initialStateTag}${$2}`
      );
    }
  } catch (ex) {
    logger.error(`[WEBCUBE] [${requestId}] Failed to inject inistal state tag`);
    logger.error(ex);
  }
  try {
    if (styleTags) {
      entryHtml = entryHtml.replace(RE_LAST_IN_HEAD, `${styleTags}</head>`);
    }
  } catch (ex) {
    logger.error(
      `[WEBCUBE] [${requestId}] Failed to inject styled-component tag`
    );
    logger.error(ex);
  }
  try {
    const afterTitle = [
      helmet.meta.toString(),
      helmet.link.toString(),
      helmet.style.toString(),
      helmet.script.toString(),
      helmet.noscript.toString(),
    ];
    entryHtml = entryHtml
      .replace(RE_TITLE, helmet.title.toString())
      .replace(
        RE_AFTER_TITLE,
        `</title>\n${afterTitle
          .filter(tag => /[^\S\n\r]/.test(tag))
          .join('\n')}`
      )
      .replace(RE_HTML_ATTR, `<html ${helmet.htmlAttributes.toString()}>`)
      .replace(RE_BODY_ATTR, `<body ${helmet.bodyAttributes.toString()}>`);
  } catch (ex) {
    logger.error(`[WEBCUBE] [${requestId}] Failed to inject helmet tag`);
    logger.error(ex);
  }
  return entryHtml;
}

async function ssrRender({
  Entry,
  entry,
  url,
  i18n,
  language,
  preloadedAppState,
  skipPreload,
  requestId,
}) {
  const baseUrl = entry === mainEntry ? '' : `/${entry}`;
  const context = {};
  // https://www.styled-components.com/docs/advanced#server-side-rendering
  const sheet = new ServerStyleSheet();
  // https://github.com/jamiebuilds/react-loadable#------------server-side-rendering
  const modules = [];
  const renderInfo = {};
  let html;
  const startRenderTime = Date.now();
  logger.info(
    `[WEBCUBE] [${requestId}] Rendering react app to ${
      skipPreload || preloadedAppState
        ? 'string'
        : 'collect info for preload store'
    }... ${skipPreload ? '(preload is skipped)' : ''}`
  );
  try {
    html = renderToString(
      createElement(
        StyleSheetManager,
        {
          sheet: sheet.instance,
        },
        createElement(
          Loadable.Capture,
          {
            report: moduleName => modules.push(moduleName),
          },
          createElement(Entry, {
            // https://reacttraining.com/react-router/web/guides/server-rendering
            StaticRouter,
            routerContext: context,
            currentUrl: url,
            // https://github.com/supasate/connected-react-router/blob/master/FAQ.md#how-to-set-router-props-eg-basename-initialentries-etc
            baseUrl,
            i18n,
            language,
            reportPreloadInfo: !skipPreload
              ? info => {
                  Object.assign(renderInfo, info);
                }
              : undefined,
            preloadedAppState: !skipPreload ? preloadedAppState : undefined,
          })
        )
      )
    );
  } catch (ex) {
    logger.error(
      `[WEBCUBE] [${requestId}] Failed to render to string. Error: `
    );
    logger.error(ex);
  }
  logger.info(
    `[WEBCUBE] [${requestId}] Rendered (time: ${Date.now() - startRenderTime})`
  );
  const renderedLoader = ((renderInfo && renderInfo.loaders) || []).filter(
    ({ propsMemory }) => propsMemory.props
  );
  let loadCount = renderedLoader.length;
  let timeoutCount = 0;
  if (!skipPreload && !preloadedAppState && loadCount) {
    const isLoaderAllDone = await new Promise(resolve => {
      const { store } = renderInfo;
      logger.info(
        `[WEBCUBE] [${requestId}] Fetching ${loadCount} data loaders (<${renderedLoader
          .map(({ componentName }) => componentName)
          .join('/>, <')}/>)...`
      );
      const startTime = Date.now();
      const timer = setTimeout(() => {
        logger.warn(
          `[WEBCUBE] [${requestId}] Timeout. Incomplete loaders: ${loadCount}  (time: ${Date.now() -
            startTime})`
        );
        timeoutCount = loadCount;
        loadCount = 0;
        renderInfo.store = null;
        resolve(false);
      }, deploy.ssrServer.dataLoaderTimeout);
      renderedLoader.forEach(
        ({
          componentName,
          propsMemory,
          loader,
          isLoaded,
          mapStateToPropsQueue,
          mapDispatchToPropsQueue,
          actions,
        }) => {
          function getProps() {
            const state = store.getState();
            const loadedProps = Object.assign({}, propsMemory.props);
            mapStateToPropsQueue.forEach(mapStateToProps => {
              Object.assign(loadedProps, mapStateToProps(state));
            });
            mapDispatchToPropsQueue.forEach(mapDispatchToProps => {
              Object.assign(
                loadedProps,
                mapDispatchToProps(store.dispatch, actions)
              );
            });
            return loadedProps;
          }
          let isMarked = false;
          const markLoader = (opt = {}) => {
            if (isMarked) {
              return;
            }
            isMarked = true;
            loadCount--;
            logger.info(
              `[WEBCUBE] [${requestId}] ${
                loadCount < 0 ? '(after timeout) ' : ''
              }Loader for <${componentName}/> is ${
                opt.skip ? 'skipped' : 'fetched'
              }, fetching ${
                loadCount < 0 ? --timeoutCount : loadCount
              } data loaders... (time: ${Date.now() - startTime})`
            );
            if (loadCount === 0) {
              logger.info(
                `[WEBCUBE] [${requestId}] all data loaders are done (time: ${Date.now() -
                  startTime})`
              );
              resolve(true);
              clearTimeout(timer);
            }
          };
          if (true === loader(getProps())) {
            markLoader({ skip: true });
          } else {
            const unsubscribe = store.subscribe(() => {
              if (isLoaded(getProps())) {
                unsubscribe();
                markLoader();
              }
            });
          }
        }
      );
    });
    return await ssrRender({
      Entry,
      entry,
      url,
      i18n,
      language,
      preloadedAppState: renderInfo,
      skipPreload: !isLoaderAllDone,
      requestId,
    });
  }
  return Promise.resolve({
    html,
    context,
    sheet,
    modules,
    store: preloadedAppState && preloadedAppState.store,
  });
}

module.exports = async function ssrRoute(req, res) {
  const requestId = res.get('Request-Id');
  const entry =
    req.params.entry &&
    (ssrEntries[req.params.entry] || entries[req.params.entry])
      ? req.params.entry
      : mainEntry;
  if (!ssrEntries[entry]) {
    if (entries[entry]) {
      const [entryHtml] = await entryData[entry];
      return res.send(entryHtml);
    } else {
      return res.status(404).render(errorPageFor400);
    }
  }
  let entryHtml, exportedEntryCodePath, Entry;
  try {
    [entryHtml, exportedEntryCodePath] = await entryData[entry];
  } catch (ex) {
    logger.error(
      `[WEBCUBE] [${requestId}] Failed to load entry's html and code path`
    );
    logger.error(ex);
  }
  if (!entryHtml) {
    return res.status(500).render(errorPageFor500);
  }
  try {
    Entry = require(exportedEntryCodePath);
  } catch (ex) {
    logger.error(`[WEBCUBE] [${requestId}] Failed to import code`);
    logger.error(ex);
    return res.send(entryHtml);
  }
  const { html: ssrHtml, context, sheet, modules, store } = await ssrRender({
    Entry,
    entry,
    url: req.url,
    language: req.language,
    i18n: req.i18n,
    requestId,
  });
  if (!ssrHtml) {
    return res.send(entryHtml);
  }
  if (context.url) {
    res.writeHead(301, {
      Location: context.url,
    });
    return res.end();
  }
  // https://github.com/jamiebuilds/react-loadable#------------server-side-rendering
  const bundles = getBundles(loadableStats, modules);
  // https://github.com/nfl/react-helmet
  // https://github.com/gaearon/react-side-effect
  const helmet = Helmet.renderStatic();
  entryHtml = injectSsrHtml(entryHtml, {
    entry,
    html: ssrHtml,
    bundles,
    styleTags: sheet.getStyleTags(),
    helmet,
    store,
    requestId,
  });
  return res.send(entryHtml);
};
