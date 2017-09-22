/* eslint-disable filenames/match-exported */
import AppSkeleton from 'webcube/boilerplate/AppSkeleton';
import createReactRouterRoot from 'webcube/boilerplate/createReactRouterRoot';
import routes from './routes';

export default class App extends AppSkeleton {
  defaultOptions = {};
  createRoot = createReactRouterRoot;
  routes = routes;
}
/* eslint-enable filenames/match-exported */
