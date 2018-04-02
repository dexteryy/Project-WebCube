/* eslint-disable filenames/match-exported */
// https://github.com/ReactTraining/react-router/tree/v3/docs
/* eslint-disable import/named */
import { browserHistory, hashHistory } from 'react-router';
/* eslint-enable import/named */
// https://www.npmjs.com/package/react-router-redux
import {
  syncHistoryWithStore,
  routerMiddleware,
  routerReducer,
} from 'react-router-redux';

export default function withRouterLegacy({
  disableHashRouter = false,
  routerHistoryConfig,
  ...config
}) {
  const history = disableHashRouter ? browserHistory : hashHistory;
  return {
    _enableRouterLegacy: true,
    _routerReducer: routerReducer,
    _routerMiddleware: routerMiddleware,
    _routerHistory: history,
    _syncRouterHistoryWithStore: syncHistoryWithStore,
    _routerHistoryConfig: routerHistoryConfig,
    ...config,
  };
}
/* eslint-enable filenames/match-exported */
