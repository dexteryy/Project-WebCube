
import AppSkeleton from 'webcube/boilerplate/AppSkeleton';
import createReactRoot from 'webcube/boilerplate/createReactRoot';
import AppRoot from './main/containers/App';

export default class App extends AppSkeleton {

  defaultOptions = {};
  createRoot = createReactRoot;
  Root = AppRoot;

}
