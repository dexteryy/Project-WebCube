// https://github.com/reactjs/react-redux/
import { connect as originConnect } from 'react-redux';
// https://www.npmjs.com/package/reselect
import { createSelector } from 'reselect';
import merge from 'lodash/merge';
import { unwrap, bindActionCreators } from '../utils';

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, stateProps, dispatchProps);
}

export default function connect({
  // https://www.npmjs.com/package/reselect#creating-a-memoized-selector
  selectors = [],
  transform = () => ({}),
  // actionCreators or [actionCreators, ...]
  // https://redux.js.org/docs/api/bindActionCreators.html
  actions = {},
  // optional
  actionsProp = 'actions',
  // optional
  customDispatch: customMapDispatchToProps,
  // optional
  // https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
  ...options
}) {
  // https://www.npmjs.com/package/reselect#createselectorinputselectors--inputselectors-resultfunc
  // https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
  const mapStateToProps = (state, ...other) => {
    const newState = unwrap(state);
    return createSelector(...selectors, transform)(newState, ...other);
  };
  let actionCreators = actions;
  if (Array.isArray(actionCreators)) {
    actionCreators = merge({}, ...actions);
  }
  // https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
  const mapDispatchToProps =
    customMapDispatchToProps ||
    (dispatch => ({
      // https://redux.js.org/docs/api/bindActionCreators.html
      [actionsProp]: bindActionCreators(actionCreators, dispatch),
    }));
  // https://redux.js.org/docs/basics/UsageWithReact.html
  // https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
  return originConnect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    options,
  );
}
