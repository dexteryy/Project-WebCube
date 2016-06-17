
import AppSkeleton from './AppSkeleton';
import createReduxRouterRoot from './createReduxRouterRoot';
import pureRender from './pureRender';
import connect from './connect';

const createRoot = createReduxRouterRoot;
const stateSelector = connect.stateSelector;
const actionDispatcher = connect.actionDispatcher;

export {
  AppSkeleton,
  createReduxRouterRoot,
  createRoot,
  pureRender,
  connect,
  stateSelector,
  actionDispatcher,
};
