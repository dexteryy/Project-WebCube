
import React from 'react';
import {
  combineReducers,
  createStore, applyMiddleware, compose,
} from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';

export default function createReduxRoot({
  isProductionEnv,
  AppRoot,
  reducers,
  initialState,
  moreMiddleware,
  moreEnhancers,
  options,
}) {
  const {
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
  const store = createStore(
    combineReducers({
      ...reducers,
    }),
    initialState,
    compose(
      applyMiddleware(
        thunk,
        ...moreMiddleware || [],
        ...(isProductionEnv ? [] : [logger])
      ),
      ...moreEnhancers || [],
      ...devTools,
    )
  );
  return function Root() {
    if (!isProductionEnv && DevTools) {
      return React.createElement(Provider, {
        store,
      },
        React.createElement('div', null,
          React.createElement(AppRoot, options),
          React.createElement(DevTools),
        )
      );
    }
    return React.createElement(Provider, {
      store,
    },
      React.createElement(AppRoot, options),
    );
  };
}
