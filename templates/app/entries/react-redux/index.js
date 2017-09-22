/* eslint-disable filenames/match-exported */
import AppSkeleton from 'webcube/boilerplate/AppSkeleton';
import createReduxRoot from 'webcube/boilerplate/createReduxRoot';
import AppRoot from './main/containers/App';
import homeModel from './main/reducers';

export default class App extends AppSkeleton {
  defaultOptions = {};
  createRoot = createReduxRoot;
  Root = AppRoot;
  reducers = {
    homeModel,
  };
}
/* eslint-enable filenames/match-exported */
