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
  let routes = opt.routes;
  if (!React.isValidElement(routes)) {
    const rootComponent = routes.component;
    routes = Object.assign({}, routes, {
      component: (props) => {
        const newProps = Object.assign({}, opt.rootProps, props);
        delete newProps.children;
        return React.createElement(rootComponent, newProps, props.children);
      },
    });
  }
  return function Root() {
    if (!opt.isProductionEnv && opt.DevTools) {
      return React.createElement(Provider, {
        store,
      },
        React.createElement('div', null,
          React.createElement(Router, {
            history,
            routes,
          }),
          React.createElement(opt.DevTools),
        )
      );
    }
    return React.createElement(Provider, {
      store,
    },
      React.createElement(Router, {
        history,
        routes,
      }),
    );
  };
}
