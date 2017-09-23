import { bindActionCreators } from 'redux';
import { connect as originConnect } from 'react-redux';
import { createSelector } from 'reselect';

function connect(...args: any): Function {
  return Component => {
    /* eslint-disable no-underscore-dangle */
    const selector = Component._stateSelector || null;
    const dispatcher = Component._actionDispatcher || null;
    delete Component._stateSelector;
    delete Component._actionDispatcher;
    if (selector || dispatcher) {
      return originConnect(selector, dispatcher, ...args)(Component);
    }
    return Component;
    /* eslint-enable no-underscore-dangle */
  };
}

connect.createStateSelector = createSelector;

connect.createActionDispatcher = function(
  ...actionCreators: Array<any>
): Function {
  const propName = actionCreators.pop();
  return dispatch => ({
    [propName]: bindActionCreators(
      Object.assign({}, ...actionCreators),
      dispatch,
    ),
  });
};

connect.stateSelector = function(...args: Array<any>): Function {
  /* eslint-disable no-underscore-dangle */
  return Component => {
    Component._stateSelector = connect.createStateSelector(...args);
    return Component;
  };
  /* eslint-enable no-underscore-dangle */
};

connect.actionDispatcher = function(...actionCreators: Array<any>): Function {
  /* eslint-disable no-underscore-dangle */
  return Component => {
    Component._actionDispatcher = connect.createActionDispatcher(
      ...actionCreators,
    );
    return Component;
  };
  /* eslint-enable no-underscore-dangle */
};

export default connect;
