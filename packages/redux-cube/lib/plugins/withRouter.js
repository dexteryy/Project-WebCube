import { BrowserRouter, HashRouter } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import createHashHistory from 'history/createHashHistory';
// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware,
} from 'react-router-redux';

// https://reacttraining.com/react-router/core/guides/redux-integration/deep-integration
export default function withRouter({
  // https://github.com/ReactTraining/history#usage
  supportHtml5History = false,
  ...config
}) {
  const createHistory = supportHtml5History
    ? createBrowserHistory
    : createHashHistory;
  // https://reacttraining.com/react-router/web/api/BrowserRouter
  // https://reacttraining.com/react-router/web/api/HashRouter
  const Router = supportHtml5History ? BrowserRouter : HashRouter;
  return {
    _enableRouter: true,
    _routerReducer: routerReducer,
    _routerMiddleware: routerMiddleware,
    _routerHistory: createHistory(),
    _Router: Router,
    _ConnectedRouter: ConnectedRouter,
    ...config,
  };
}
