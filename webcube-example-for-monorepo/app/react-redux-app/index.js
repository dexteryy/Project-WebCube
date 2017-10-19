/* eslint-disable filenames/match-exported */
import AppRoot from './main/containers/App';
import homeModel from './main/reducers';
import AppSkeleton from 'webcube/boilerplate/AppSkeleton';
import createReduxRoot from 'webcube/boilerplate/createReduxRoot';

export default class App extends AppSkeleton {
  defaultOptions = {};

  createRoot = createReduxRoot;

  Root = AppRoot;

  reducers = {
    homeModel,
  };
}
/* eslint-enable filenames/match-exported */
