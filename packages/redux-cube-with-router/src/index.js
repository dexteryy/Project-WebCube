/* eslint-disable filenames/match-exported */
import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
} from 'history';
// https://www.npmjs.com/package/connected-react-router
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware,
} from 'connected-react-router';

// https://reacttraining.com/react-router/core/guides/redux-integration/deep-integration
export default function withRouter({
  // optional
  // https://github.com/ReactTraining/history#usage
  supportHtml5History = true,
  // optional
  // https://github.com/ReactTraining/react-router/blob/master/packages/react-router-redux/modules/ConnectedRouter.js#L8
  routerConfig = {},
  ...config
}) {
  const createHistory =
    // https://medium.com/@cereallarceny/server-side-rendering-in-create-react-app-with-all-the-goodies-without-ejecting-4c889d7db25e
    (typeof location !== 'object' && createMemoryHistory) ||
    // https://reacttraining.com/react-router/web/api/BrowserRouter
    // https://reacttraining.com/react-router/web/api/HashRouter
    (supportHtml5History ? createBrowserHistory : createHashHistory);
  return {
    _enableRouter: true,
    _connectRouter: connectRouter,
    _routerMiddleware: routerMiddleware,
    _createRouterHistory: createHistory,
    _ConnectedRouter: ConnectedRouter,
    // allow dynamic config
    routerConfig,
    ...config,
  };
}
/* eslint-enable filenames/match-exported */
