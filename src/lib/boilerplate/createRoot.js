/* @flow */

import React from 'react';
import {
  combineReducers,
  createStore, applyMiddleware, compose,
} from 'redux';
import thunk from 'redux-thunk';
// import promise from 'redux-promise';
import createLogger from 'redux-logger';
import { Provider } from 'react-redux';
import { Router, browserHistory, hashHistory } from 'react-router';
import {
  syncHistoryWithStore, routerMiddleware, routerReducer,
} from 'react-router-redux';

export default function createRoot(opt: Object): Function {
  const initialState = opt.initialState;
  const logger = createLogger();
  const devTools = [];
  if (!opt.isProductionEnv) {
    if (typeof window === 'object'
        && typeof window.devToolsExtension !== 'undefined') {
      devTools.push(window.devToolsExtension());
    }
    if (opt.devTools) {
      devTools.push(opt.devTools);
    }
  }
  let history = opt.isStaticWeb ? hashHistory : browserHistory;
  const store = createStore(
    combineReducers({
      ...opt.reducers,
      routing: routerReducer,
    }),
    initialState,
    compose(
      applyMiddleware(
        thunk,
        routerMiddleware(history),
        ...opt.moreMiddleware || [],
        ...(opt.isProductionEnv ? [] : [logger])
      ),
      ...opt.moreEnhancers || [],
      ...devTools,
    )
  );
  history = syncHistoryWithStore(history, store);
  return function Root() {
    // if (!opt.isProductionEnv) {
    //   return React.createElement(Provider, {
    //     store,
    //   },
    //     React.createElement(Router, {
    //       history,
    //       routes: opt.routes,
    //     }),
    //     React.createElement(DevTools),
    //   );
    // }
    return React.createElement(Provider, {
      store,
    },
      React.createElement(Router, {
        history,
        routes: opt.routes,
      }),
    );
  };
}
