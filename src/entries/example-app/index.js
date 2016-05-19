/* @flow */

import { AppSkeleton, createRoot } from 'internals/lib/boilerplate';
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
    this.createRoot = createRoot;
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
