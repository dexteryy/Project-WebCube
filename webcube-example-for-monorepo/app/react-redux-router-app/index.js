/* eslint-disable filenames/match-exported */
import routes from './routes';
import homeModel from './main/reducers';
import AppSkeleton from 'webcube/boilerplate/AppSkeleton';
import createReduxRouterRoot from 'webcube/boilerplate/createReduxRouterRoot';

export default class App extends AppSkeleton {
  defaultOptions = {};
  createRoot = createReduxRouterRoot;
  // @TODO react-router v4
  // Root = AppRoot;
  routes = routes;
  reducers = {
    homeModel,
  };
}
/* eslint-enable filenames/match-exported */
