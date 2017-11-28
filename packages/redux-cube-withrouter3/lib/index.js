/* eslint-disable filenames/match-exported */
// https://github.com/ReactTraining/react-router/tree/v3/docs
import { browserHistory, hashHistory } from 'react-router';
// https://www.npmjs.com/package/react-router-redux
import {
  syncHistoryWithStore,
  routerMiddleware,
  routerReducer,
} from 'react-router-redux';

export default function withRouter3({
  disableHashRouter = false,
  routerHistoryConfig,
  ...config
}) {
  const history = disableHashRouter ? browserHistory : hashHistory;
  return {
    _enableRouter3: true,
    _routerReducer: routerReducer,
    _routerMiddleware: routerMiddleware,
    _routerHistory: history,
    _syncRouterHistoryWithStore: syncHistoryWithStore,
    _routerHistoryConfig: routerHistoryConfig,
    ...config,
  };
}
/* eslint-enable filenames/match-exported */
