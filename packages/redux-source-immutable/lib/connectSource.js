import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { unwrap, bindActionCreators } from 'redux-source/lib/utils';

export default function connectSource(
  { stateName, denormalize, actions },
  { slice, actionsProp },
) {
  return OriginComponent => {
    const mapStateToProps = (oldState, ...other) => {
      const newState = unwrap(oldState);
      return createSelector(
        [
          state => slice(state).getIn([stateName, 'data']),
          state => slice(state).getIn([stateName, 'errors']),
          state => slice(state).getIn([stateName, 'isPending']),
        ],
        (data, errors, isPending) => ({
          [stateName]: {
            data: denormalize(data.toJS()),
            errors: errors.toJS(),
            isPending,
          },
        }),
      )(newState, ...other);
    };
    const mapDispatchToProps = dispatch =>
      actionsProp
        ? {
            [actionsProp]: bindActionCreators(actions, dispatch),
          }
        : {};
    return connect(mapStateToProps, mapDispatchToProps)(OriginComponent);
  };
}
