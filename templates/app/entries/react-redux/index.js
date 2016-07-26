/* @flow */

import AppSkeleton from 'webcube/boilerplate/AppSkeleton';
import createReduxRoot from 'webcube/boilerplate/createReduxRoot';
import AppRoot from './containers/App';
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
    this.createRoot = createReduxRoot;
    this.initRoot({
      root: AppRoot,
      reducers,
    });
  }

  initConfig(userOpt: AppOpt) {
    this.defaultOpt = Object.assign({}, this.defaultOpt, this.myDefaultOpt);
    super.initConfig(userOpt);
  }

}
