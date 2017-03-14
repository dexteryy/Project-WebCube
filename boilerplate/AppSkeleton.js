
/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import perfAddon from 'react-addons-perf';

const isProductionEnv = process.env.NODE_ENV === 'production';

// https://github.com/facebook/react/issues/436
// https://github.com/zilverline/react-tap-event-plugin
if (!process.env.WEBCUBE_DISABLE_TAP_EVENT_ADDON
    && !process.env.WEBCUBE_USE_PREACT) {
  require('react-tap-event-plugin')();
}

type AppOpt = {
  isStaticWeb: ?boolean,
  DevTools: ?Object,
};

export default class AppSkeleton {

  defaultOptions: Object = {};
  createRoot: Function;
  Root: React.Component;
  // @TODO react-router v4: start
  routes: ?Object;
  rootProps: ?Object;
  // @TODO react-router v4: end
  reducers: ?Object;
  initialState: ?Object;
  moreMiddleware: ?Array<Function>;
  moreEnhancers: ?Array<Function>;

  builtinOptions: AppOpt = {
    isStaticWeb: false,
    DevTools: null,
  };
  opt: Object = {};

  _node: HTMLElement;
  _root: React.Component | void;

  constructor(userOpt: Object = {}) {
    this.config(userOpt);
  }

  config(userOpt: AppOpt) {
    Object.assign(this.opt, this.builtinOptions, this.defaultOptions, userOpt);
  }

  mount(node: HTMLElement, cb: Function): AppSkeleton {
    const Root = this.createRoot({
      isProductionEnv,
      AppRoot: this.Root,
      // @TODO react-router v4: start
      routes: this.routes,
      rootProps: this.rootProps,
      // @TODO react-router v4: end
      reducers: this.reducers,
      initialState: this.initialState,
      moreMiddleware: this.moreMiddleware,
      moreEnhancers: this.moreEnhancers,
      options: this.opt,
    });
    perfAddon.start();
    this._root = ReactDOM.render(
      React.createElement(Root),
      node,
      () => {
        perfAddon.stop();
        perfAddon.printInclusive();
        perfAddon.printExclusive();
        perfAddon.printWasted();
        cb && cb();
      },
    );
    this._node = node;
    return this;
  }

  unmount(): AppSkeleton {
    ReactDOM.unmountComponentAtNode(this._node);
    return this;
  }

  remount(cb: Function): AppSkeleton {
    return this.mount(this._node, cb);
  }

}
