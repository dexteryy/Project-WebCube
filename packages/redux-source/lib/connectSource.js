import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { unwrap, bindActionCreators } from './utils';

export default function connectSource(
  { stateName, denormalize, actions },
  { slice, actionsProp },
) {
  return OriginComponent => {
    const mapStateToProps = (oldState, ...other) => {
      const newState = unwrap(oldState);
      return createSelector(
        [
          state => slice(state)[stateName].data,
          state => slice(state)[stateName].errors,
          state => slice(state)[stateName].isPending,
        ],
        (data, errors, isPending) => ({
          [stateName]: {
            data: denormalize(data),
            errors,
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
