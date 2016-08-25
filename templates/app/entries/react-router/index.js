/* @flow */

import AppSkeleton from 'webcube/boilerplate/AppSkeleton';
import createReactRouterRoot from 'webcube/boilerplate/createReactRouterRoot';
import routes from './routes';

type AppOpt = {
  appStateSample: String,
  isStaticWeb?: boolean,
  enablePerf?: boolean,
}

export default class App extends AppSkeleton {

  myDefaultOpt: Object = {};

  constructor(userOpt: AppOpt) {
    super(userOpt);
    this.createRoot = createReactRouterRoot;
    this.initRoot({
      routes,
      rootProps: {
        appStateSample: userOpt.appStateSample,
      },
    });
  }

  initConfig(userOpt: AppOpt) {
    this.defaultOpt = Object.assign({}, this.defaultOpt, this.myDefaultOpt);
    super.initConfig(userOpt);
  }

}
