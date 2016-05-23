/* @flow */

import React from 'react';
import AppSkeleton from 'internals/lib/boilerplate/AppSkeleton';
import Provider from './containers/App';

type AppOpt = {
  isStaticWeb?: boolean,
  enablePerf?: boolean,
}

export default class App extends AppSkeleton {

  myDefaultOpt: Object = {};

  constructor(userOpt: AppOpt) {
    super(userOpt);
    this.createRoot = () => {
      return function Root() {
        return React.createElement(Provider, {});
      };
    };
    this.initRoot();
  }

  initConfig(userOpt: AppOpt) {
    this.defaultOpt = Object.assign({}, this.defaultOpt, this.myDefaultOpt);
    super.initConfig(userOpt);
  }

}
