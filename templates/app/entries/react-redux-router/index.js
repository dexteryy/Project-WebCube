import AppSkeleton from 'webcube/boilerplate/AppSkeleton';
import createReduxRouterRoot from 'webcube/boilerplate/createReduxRouterRoot';
import routes from './routes';
import homeModel from './main/reducers';

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
