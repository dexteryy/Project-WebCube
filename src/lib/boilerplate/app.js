/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
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

const createRoot = (opt: Object): Function => {
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
};

type AppOpt = {
  isStaticWeb?: boolean,
};

type RootOpt = {
  routes: Object,
  reducers: Object,
  initialState?: Object,
  moreMiddleware?: Array<Function>,
  moreEnhancers?: Array<Function>,
};

export class AppSkeleton {

  static createRoot = createRoot;

  _node: HTMLElement;
  _root: React.Component | void;
  _Root: Object;

  opt: Object = {};

  defaultOpt: Object = {
    isStaticWeb: false,
  };

  constructor(userOpt: AppOpt = {}) {
    this.initConfig(userOpt);
  }

  initConfig(userOpt: AppOpt) {
    Object.assign(this.opt, this.defaultOpt, userOpt);
  }

  initRoot(opt: RootOpt) {
    this._Root = createRoot({
      isProductionEnv: process.env.NODE_ENV === 'production',
      isStaticWeb: this.opt.isStaticWeb,
      ...opt,
    });
  }

  mount(node: HTMLElement): AppSkeleton {
    this._root = ReactDOM.render(React.createElement(this._Root), node);
    this._node = node;
    return this;
  }

  unmount(): AppSkeleton {
    ReactDOM.unmountComponentAtNode(this._node);
    delete this._root;
    return this;
  }

  remount(): AppSkeleton {
    return this.mount(this._node);
  }

}
