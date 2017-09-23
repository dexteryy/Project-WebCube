/* eslint-disable filenames/match-exported */
import routes from './routes';
import AppSkeleton from 'webcube/boilerplate/AppSkeleton';
import createReactRouterRoot from 'webcube/boilerplate/createReactRouterRoot';

export default class App extends AppSkeleton {
  defaultOptions = {};
  createRoot = createReactRouterRoot;
  routes = routes;
}
/* eslint-enable filenames/match-exported */
