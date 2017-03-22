
import AppSkeleton from './AppSkeleton';
import connect from './connect';

const stateSelector = connect.stateSelector;
const actionDispatcher = connect.actionDispatcher;

export {
  AppSkeleton,
  connect,
  stateSelector,
  actionDispatcher,
};
