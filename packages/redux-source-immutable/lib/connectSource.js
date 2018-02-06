import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { unwrap, bindActionCreators } from 'redux-source/lib/utils';

export default function connectSource(
  { stateName, denormalize, actions },
  { slice, actionsProp },
) {
  const mapStateToProps = (oldState, ...other) => {
    const newState = unwrap(oldState);
    return createSelector(
      [
        state => slice(state).getIn([stateName, 'result']),
        state => slice(state).getIn([stateName, 'entities']),
        state => slice(state).getIn([stateName, 'errors']),
        state => slice(state).getIn([stateName, 'isPending']),
      ],
      (result, entities, errors, isPending) => {
        const res = denormalize(result.toJS(), entities.toJS());
        // console.log(
        //   'denormalize',
        //   { result: result.toJS(), entities: entities.toJS() },
        //   res,
        // );
        return {
          [stateName]: {
            result: res,
            errors: errors.toJS(),
            isPending,
          },
        };
      },
    )(newState, ...other);
  };
  const mapDispatchToProps = dispatch =>
    actionsProp
      ? {
          [actionsProp]: bindActionCreators(actions, dispatch),
        }
      : {};
  return connect(mapStateToProps, mapDispatchToProps);
}
