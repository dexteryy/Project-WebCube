
import AppSkeleton from 'webcube/boilerplate/AppSkeleton';
import createReduxRouterRoot from 'webcube/boilerplate/createReduxRouterRoot';
// @TODO react-router v4
// import AppRoot from './containers/App';
import routes from './routes';
import reducers from './reducers/';

export default class App extends AppSkeleton {

  defaultOptions = {};
  createRoot = createReduxRouterRoot;
  // @TODO react-router v4
  // Root = AppRoot;
  routes = routes;
  reducers = reducers;

}
