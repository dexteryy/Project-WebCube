/* @flow */

import { bindActionCreators } from 'redux';
import { connect as originConnect } from 'react-redux';
import { createSelector } from 'reselect';

export const createStateSelector = createSelector;

export function createActionDispatcher(
  ...actionCreators: Array<any>
): Function {
  const propName = actionCreators.pop();
  return (dispatch) => {
    return {
      [propName]: bindActionCreators(
        Object.assign({}, ...actionCreators), dispatch
      ),
    };
  };
}

export function stateSelector(...args: Array<any>): Function {
  return (Component) => {
    Component._stateSelector = createStateSelector(...args);
    return Component;
  };
}

export function actionDispatcher(
  ...actionCreators: Array<any>
): Function {
  return (Component) => {
    Component._actionDispatcher = createActionDispatcher(...actionCreators);
    return Component;
  };
}

export function connect(...args: any): Function {
  return (Component) => {
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
