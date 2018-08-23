import React from 'react';
import { hydrate, render } from 'react-dom';
import Loadable from 'react-loadable';
import WebcubePlaceholderForEntryApp from 'WebcubePlaceholderForEntryPath';

const hydrateApp = () => {
  hydrate(
    React.createElement(WebcubePlaceholderForEntryApp, {
      /* eslint-disable no-undef */
      baseUrl: WebcubePlaceholderForBaseUrl,
      /* eslint-enable no-undef */
    }),
    document.getElementById('WebcubePlaceholderForEntryApp'),
  );
};

const renderApp = () => {
  render(
    React.createElement(WebcubePlaceholderForEntryApp, {
      /* eslint-disable no-undef */
      baseUrl: WebcubePlaceholderForBaseUrl,
      /* eslint-enable no-undef */
    }),
    document.getElementById('WebcubePlaceholderForEntryApp'),
  );
};

if (process.env.DEPLOY_MODE === 'ssr') {
  // https://github.com/jamiebuilds/react-loadable#------------server-side-rendering
  Loadable.preloadReady().then(() => {
    hydrateApp();
  });
} else {
  renderApp();
}

if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable no-undef */
  if (typeof module === 'object' && module.hot) {
    require('webpack-serve-overlay');
    if (module.hot) {
      module.hot.accept('WebcubePlaceholderForEntryPath', () => renderApp());
    }
  }
  /* eslint-enable no-undef */
}
