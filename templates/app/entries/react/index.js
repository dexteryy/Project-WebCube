
import AppSkeleton from 'webcube/boilerplate/AppSkeleton';
import createReactRoot from 'webcube/boilerplate/createReactRoot';
import AppRoot from './containers/App';

export default class App extends AppSkeleton {

  defaultOptions = {};
  createRoot = createReactRoot;
  Root = AppRoot;

}
