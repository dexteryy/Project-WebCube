/* eslint-disable filenames/match-exported */
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
  routerConfig = {},
  ...config
}) {
  // https://reacttraining.com/react-router/web/api/BrowserRouter
  // https://reacttraining.com/react-router/web/api/HashRouter
  const createHistory = supportHtml5History
    ? createBrowserHistory
    : createHashHistory;
  return {
    _enableRouter: true,
    _routerReducer: routerReducer,
    _routerMiddleware: routerMiddleware,
    _routerHistory: createHistory(),
    _ConnectedRouter: ConnectedRouter,
    // allow dynamic config
    routerConfig,
    ...config,
  };
}
/* eslint-enable filenames/match-exported */
