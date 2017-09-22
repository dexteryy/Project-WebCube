import AppSkeleton from './AppSkeleton';
import connect from './connect';

const { stateSelector } = connect;
const { actionDispatcher } = connect;

export { AppSkeleton, connect, stateSelector, actionDispatcher };
