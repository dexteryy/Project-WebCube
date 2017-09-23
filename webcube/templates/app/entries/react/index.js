/* eslint-disable filenames/match-exported */
import AppRoot from './main/containers/App';
import AppSkeleton from 'webcube/boilerplate/AppSkeleton';
import createReactRoot from 'webcube/boilerplate/createReactRoot';

export default class App extends AppSkeleton {
  defaultOptions = {};
  createRoot = createReactRoot;
  Root = AppRoot;
}
/* eslint-enable filenames/match-exported */
