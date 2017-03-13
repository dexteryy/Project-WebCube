
import AppSkeleton from 'webcube/boilerplate/AppSkeleton';
import createReduxRoot from 'webcube/boilerplate/createReduxRoot';
import AppRoot from './containers/App';
import reducers from './reducers/';

export default class App extends AppSkeleton {

  defaultOptions = {};
  createRoot = createReduxRoot;
  Root = AppRoot;
  reducers = reducers;

}
