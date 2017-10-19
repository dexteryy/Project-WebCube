import { bindActionCreators } from 'redux';
import { connect as originConnect } from 'react-redux';
import { createSelector } from 'reselect';

function connect(...args: any): Function {
  return Component => {
    const selector = Component._stateSelector || null;
    const dispatcher = Component._actionDispatcher || null;
    delete Component._stateSelector;
    delete Component._actionDispatcher;
    if (selector || dispatcher) {
      return originConnect(selector, dispatcher, ...args)(Component);
    }
    return Component;
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
  return Component => {
    Component._stateSelector = connect.createStateSelector(...args);
    return Component;
  };
};

connect.actionDispatcher = function(...actionCreators: Array<any>): Function {
  return Component => {
    Component._actionDispatcher = connect.createActionDispatcher(
      ...actionCreators,
    );
    return Component;
  };
};

export default connect;
