
/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import perfAddon from 'react-addons-perf';

const isProductionEnv = process.env.NODE_ENV === 'production';

// Needed for onTouchTap. Can go away when react 1.0 release
// https://github.com/zilverline/react-tap-event-plugin
if (!process.env.WEBCUBE_DISABLE_TAP_EVENT
    && !process.env.WEBCUBE_USE_PREACT) {
  require('react-tap-event-plugin')();
}

type AppOpt = {
  isStaticWeb?: boolean,
  DevTools?: Object,
};

type RootOpt = {
  routes?: Object,
  reducers?: Object,
  initialState?: Object,
  moreMiddleware?: Array<Function>,
  moreEnhancers?: Array<Function>,
};

export default class AppSkeleton {

  _node: HTMLElement;
  _root: React.Component | void;
  _Root: Object;
  Perf: Object;
  createRoot: Function;

  opt: Object = {};

  defaultOpt: AppOpt = {
    isStaticWeb: false,
  };

  constructor(userOpt: AppOpt = {}) {
    this.initConfig(userOpt);
  }

  initConfig(userOpt: AppOpt) {
    Object.assign(this.opt, this.defaultOpt, userOpt);
  }

  initRoot(opt: RootOpt = {}) {
    this._Root = this.createRoot({
      isProductionEnv,
      isStaticWeb: this.opt.isStaticWeb,
      DevTools: this.opt.DevTools,
      ...opt,
    });
  }

  mount(node: HTMLElement, cb: Function): AppSkeleton {
    perfAddon.start();
    this._root = ReactDOM.render(
      React.createElement(this._Root),
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
    delete this._root;
    return this;
  }

  remount(cb: Function): AppSkeleton {
    return this.mount(this._node, cb);
  }

}
