/* @flow */

import React from 'react';
import {
  combineReducers,
  createStore, applyMiddleware, compose,
} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { Provider } from 'react-redux';

export default function createReduxRouterRoot(opt: Object): Function {
  const initialState = opt.initialState;
  const logger = createLogger();
  const devTools = [];
  if (!opt.isProductionEnv) {
    if (opt.DevTools) {
      devTools.push(opt.DevTools.instrument());
    } else if (typeof window === 'object'
        && typeof window.devToolsExtension !== 'undefined') {
      devTools.push(window.devToolsExtension());
    }
  }
  const store = createStore(
    combineReducers({
      ...opt.reducers,
    }),
    initialState,
    compose(
      applyMiddleware(
        thunk,
        ...opt.moreMiddleware || [],
        ...(opt.isProductionEnv ? [] : [logger])
      ),
      ...opt.moreEnhancers || [],
      ...devTools,
    )
  );
  return function Root() {
    if (!opt.isProductionEnv && opt.DevTools) {
      return React.createElement(Provider, {
        store,
      },
        React.createElement('div', null,
          React.createElement(opt.root, opt.rootProps || {}),
          React.createElement(opt.DevTools),
        )
      );
    }
    return React.createElement(Provider, {
      store,
    },
      React.createElement(opt.root, opt.rootProps || {}),
    );
  };
}
