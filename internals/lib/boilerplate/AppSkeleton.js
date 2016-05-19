
/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

const isProductionEnv = process.env.NODE_ENV === 'production';

const fakeFn = () => {};

// Needed for onTouchTap. Can go away when react 1.0 release
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

type AppOpt = {
  isStaticWeb?: boolean,
  enablePerf?: boolean,
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
    enablePerf: true,
  };

  constructor(userOpt: AppOpt = {}) {
    this.initConfig(userOpt);
    this.Perf = !isProductionEnv && this.opt.enablePerf
      ? require('react-addons-perf')
      : {
        start: fakeFn,
        stop: fakeFn,
        printInclusive: fakeFn,
        printExclusive: fakeFn,
        printWasted: fakeFn,
        printDOM: fakeFn,
        getLastMeasurements: fakeFn,
      };
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
    const { Perf } = this;
    Perf.start();
    this._root = ReactDOM.render(
      React.createElement(this._Root),
      node,
      () => {
        Perf.stop();
        Perf.printInclusive();
        Perf.printExclusive();
        Perf.printWasted();
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
