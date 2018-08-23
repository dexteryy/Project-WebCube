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
const RE_LAST_IN_HEAD = /<\/head>/;
const RE_TITLE = /<title>[\s\S\n\r]*?<\/title>/;
const RE_AFTER_TITLE = /<\/title>/;
const RE_HTML_ATTR = /<html[^>]*>/;
const RE_BODY_ATTR = /<body[^>]*>/;
const RE_MOUNT_CONTAINERS = {};

const entryData = {};
Object.keys(entries).forEach(entry => {
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
        if (!entryCodePath) {
          return '';
        }
        await util.promisify(fs.access)(entryCodePath);
        const entryCode = await util.promisify(fs.readFile)(entryCodePath);
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
  { entry, html, bundles, styleTags, helmet, store }
) {
  let entryHtml;
  try {
    entryHtml = originHtml.replace(
      RE_MOUNT_CONTAINERS[entry],
      `<div id="${entryNameToId(entry)}">${html}</div>`
    );
  } catch (ex) {
    logger.error('[WEBCUBE] Failed to inject HTML string');
    logger.error(ex);
  }
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
        RE_FIRST_BODY_SCRIPT,
        ($0, $1, $2) =>
          `<body>${$1}${jsBundles
            .map(bundle => `<script src=${bundle.publicPath}></script>`)
            .join('')}${$2}`
      );
    }
  } catch (ex) {
    logger.error('[WEBCUBE] Failed to inject loadable bundles');
    logger.error(ex);
  }
  try {
    if (store) {
      const initialStateTag = `<script>window._webcubeInitialState = ${JSON.stringify(
        store.getState()
      )}</script>`;
      entryHtml = entryHtml.replace(
        RE_FIRST_BODY_SCRIPT,
        ($0, $1, $2) => `<body>${$1}${initialStateTag}${$2}`
      );
    }
  } catch (ex) {
    logger.error('[WEBCUBE] Failed to inject inistal state tag');
    logger.error(ex);
  }
  try {
    if (styleTags) {
      entryHtml = entryHtml.replace(RE_LAST_IN_HEAD, `${styleTags}</head>`);
    }
  } catch (ex) {
    logger.error('[WEBCUBE] Failed to inject styled-component tag');
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
    logger.error('[WEBCUBE] Failed to inject helmet tag');
    logger.error(ex);
  }
  return entryHtml;
}

async function ssrRender({ Entry, entry, url, appState }) {
  const context = {};
  // https://www.styled-components.com/docs/advanced#server-side-rendering
  const sheet = new ServerStyleSheet();
  // https://github.com/jamiebuilds/react-loadable#------------server-side-rendering
  const modules = [];
  const reportResult = {};
  let html;
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
            baseUrl: entry === mainEntry ? '' : `/${entry}`,
            reportAppState: result => {
              Object.assign(reportResult, result);
            },
            appState,
          })
        )
      )
    );
  } catch (ex) {
    logger.error('[WEBCUBE] Failed to render to string. Error: ');
    logger.error(ex);
  }
  if (!appState && reportResult.loaders && reportResult.loaders.length) {
    let loadCount = reportResult.loaders.length;
    await new Promise(resolve => {
      reportResult.loaders.forEach(
        ({
          loader,
          isLoaded,
          mapStateToPropsQueue,
          mapDispatchToPropsQueue,
          actions,
        }) => {
          function getProps() {
            const state = reportResult.store.getState();
            const loadedProps = {};
            mapStateToPropsQueue.forEach(mapStateToProps => {
              Object.assign(loadedProps, mapStateToProps(state));
            });
            mapDispatchToPropsQueue.forEach(mapDispatchToProps => {
              Object.assign(
                loadedProps,
                mapDispatchToProps(reportResult.store.dispatch, actions)
              );
            });
            return loadedProps;
          }
          reportResult.store.subscribe(() => {
            if (isLoaded(getProps())) {
              loadCount--;
            }
            if (loadCount <= 0) {
              resolve();
            }
          });
          loader(getProps());
        }
      );
    });
    return await ssrRender({ Entry, entry, url, appState: reportResult });
  }
  return Promise.resolve({
    html,
    context,
    sheet,
    modules,
    store: appState && appState.store,
  });
}

module.exports = async function ssrRoute(req, res) {
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
    logger.error("[WEBCUBE] Failed to load entry's html and code path");
    logger.error(ex);
  }
  if (!entryHtml) {
    return res.status(500).render(errorPageFor500);
  }
  try {
    Entry = require(exportedEntryCodePath);
  } catch (ex) {
    logger.error('[WEBCUBE] Failed to import code');
    logger.error(ex);
    return res.send(entryHtml);
  }
  const { html: ssrHtml, context, sheet, modules, store } = await ssrRender({
    Entry,
    entry,
    url: req.url,
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
  });
  return res.send(entryHtml);
};
