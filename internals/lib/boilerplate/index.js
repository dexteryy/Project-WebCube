
import AppSkeleton from './AppSkeleton';
import createReactRouterRoot from './createReactRouterRoot';
import createReduxRouterRoot from './createReduxRouterRoot';
import pureRender from './pureRender';
import connect from './connect';
import { deprecate } from 'core-decorators';

const createRoot = deprecate(createReduxRouterRoot);

export {
  AppSkeleton,
  createReactRouterRoot,
  createReduxRouterRoot,
  createRoot,
  pureRender,
  connect,
};

export const stateSelector = connect.stateSelector;

export const actionDispatcher = connect.actionDispatcher;
