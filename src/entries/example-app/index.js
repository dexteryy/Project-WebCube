/* @flow */

import { AppSkeleton } from '../../lib/boilerplate';
import routes from './routes';
import reducers from './reducers/';

type AppOpt = {
  isStaticWeb?: boolean,
}

export default class App extends AppSkeleton {

  myDefaultOpt: Object = {

  };

  constructor(userOpt: AppOpt) {
    super(userOpt);
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
