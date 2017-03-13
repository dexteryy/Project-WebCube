
import React from 'react';
import {
  combineReducers,
  createStore, applyMiddleware, compose,
} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { Provider } from 'react-redux';
// @TODO react-router v4: start
// import createBrowserHistory from 'history/createBrowserHistory';
// import createHashHistory from 'history/createHashHistory';
// import {
//   ConnectedRouter,
//   routerMiddleware,
//   routerReducer,
// } from 'react-router-redux/es';
import { Router, browserHistory, hashHistory } from 'react-router';
import {
  syncHistoryWithStore, routerMiddleware, routerReducer,
} from 'react-router-redux';
// @TODO react-router v4: end

export default function createReduxRouterRoot({
  isProductionEnv,
  // @TODO react-router v4: start
  // AppRoot,
  routes: originalRoutes,
  rootProps,
  // @TODO react-router v4: end
  reducers,
  initialState,
  moreMiddleware,
  moreEnhancers,
  options,
}) {
  const {
    isStaticWeb,
    DevTools,
  } = options;
  const logger = createLogger();
  const devTools = [];
  if (!isProductionEnv) {
    if (DevTools) {
      devTools.push(DevTools.instrument());
    } else if (typeof window === 'object'
        && typeof window.devToolsExtension !== 'undefined') {
      devTools.push(window.devToolsExtension());
    }
  }
  // @TODO react-router v4: start
  // const history = isStaticWeb
  //   ? createHashHistory() : createBrowserHistory();
  let history = isStaticWeb ? hashHistory : browserHistory;
  // @TODO react-router v4: end
  const store = createStore(
    combineReducers({
      ...reducers,
      // @TODO react-router v4: start
      // router: routerReducer,
      routing: routerReducer,
      // @TODO react-router v4: end
    }),
    initialState,
    compose(
      applyMiddleware(
        thunk,
        routerMiddleware(history),
        ...moreMiddleware || [],
        ...(isProductionEnv ? [] : [logger])
      ),
      ...moreEnhancers || [],
      ...devTools,
    )
  );
  // @TODO react-router v4: start
  history = syncHistoryWithStore(history, store);
  let routes = originalRoutes;
  if (!React.isValidElement(originalRoutes)) {
    const rootComponent = originalRoutes.component;
    routes = Object.assign({}, originalRoutes, {
      component: (props) => {
        const newProps = Object.assign({}, rootProps, props);
        delete newProps.children;
        return React.createElement(rootComponent, newProps, props.children);
      },
    });
  }
  // @TODO react-router v4: end
  return function Root() {
    if (!isProductionEnv && DevTools) {
      return React.createElement(Provider, {
        store,
      },
        React.createElement('div', null,
          // @TODO react-router v4: start
          // React.createElement(ConnectedRouter, {
          //   history,
          // }, React.createElement(AppRoot, options)),
          React.createElement(Router, {
            history,
            routes,
          }),
          // @TODO react-router v4: end
          React.createElement(DevTools),
        )
      );
    }
    return React.createElement(Provider, {
      store,
    },
      // @TODO react-router v4: start
      // React.createElement(ConnectedRouter, {
      //   history,
      // }, React.createElement(AppRoot, options)),
      React.createElement(Router, {
        history,
        routes,
      }),
      // @TODO react-router v4: end
    );
  };
}
