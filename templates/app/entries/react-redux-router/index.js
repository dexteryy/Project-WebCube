/* @flow */

import AppSkeleton from 'webcube/boilerplate/AppSkeleton';
import createReduxRouterRoot from 'webcube/boilerplate/createReduxRouterRoot';
import routes from './routes';
import reducers from './reducers/';

type AppOpt = {
  isStaticWeb?: boolean,
  enablePerf?: boolean,
  DevTools?: Object,
}

export default class App extends AppSkeleton {

  myDefaultOpt: Object = {};

  constructor(userOpt: AppOpt) {
    super(userOpt);
    this.createRoot = createReduxRouterRoot;
    this.initRoot({
      routes,
      reducers,
    });
  }

  initConfig(userOpt: AppOpt) {
    this.defaultOpt = Object.assign({}, this.defaultOpt, this.myDefaultOpt);
    super.initConfig(userOpt);
  }

}
