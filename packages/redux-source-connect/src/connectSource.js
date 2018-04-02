import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { unwrap, bindActionCreators } from 'redux-source-utils';

export default function connectSource(
  { stateName, denormalize, actions },
  { slice, actionsProp, enableErrorLogger = false },
) {
  const mapStateToProps = (oldState, ...other) => {
    const newState = unwrap(oldState);
    return createSelector(
      [
        state => slice(state)[stateName].result,
        state => slice(state)[stateName].entities,
        state => slice(state)[stateName].errors,
        state => slice(state)[stateName].isPending,
      ],
      (result, entities, errors, isPending) => {
        const res = denormalize(result, entities);
        // console.log('denormalize', { result, entities }, res);
        if (
          errors.length &&
          enableErrorLogger &&
          typeof console === 'object' &&
          console.error
        ) {
          errors.forEach(error => {
            if (
              typeof error === 'object' &&
              !error._reduxSourceConnectReported
            ) {
              error._reduxSourceConnectReported = true;
              console.error(error.stack || error);
            }
          });
        }
        return {
          [stateName]: {
            result: res,
            errors,
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
