/* @flow */

import React from 'react';
import AppSkeleton from 'webcube/boilerplate/AppSkeleton';
import AppRoot from './containers/App';

type AppOpt = {
  appStateSample: String,
  isStaticWeb?: boolean,
  enablePerf?: boolean,
}

export default class App extends AppSkeleton {

  myDefaultOpt: Object = {};

  constructor(userOpt: AppOpt) {
    super(userOpt);
    this.createRoot = () => {
      return function Root() {
        return React.createElement(AppRoot, {
          appStateSample: userOpt.appStateSample,
        });
      };
    };
    this.initRoot();
  }

  initConfig(userOpt: AppOpt) {
    this.defaultOpt = Object.assign({}, this.defaultOpt, this.myDefaultOpt);
    super.initConfig(userOpt);
  }

}
