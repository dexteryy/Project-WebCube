
import shallowCompare from 'react-addons-shallow-compare';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {
  AppSkeleton,
} from './app';
import {
  stateSelector,
  actionDispatcher,
  connect,
  createActionDispatcher,
} from './connectors';

// Needed for onTouchTap. Can go away when react 1.0 release
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const pureRender = () => {
  return (Component) => {
    Component.prototype.shouldComponentUpdate
      = function (nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
      };
    return Component;
  };
};

export {
  AppSkeleton,
  stateSelector,
  actionDispatcher,
  connect,
  createActionDispatcher,
  pureRender,
};
