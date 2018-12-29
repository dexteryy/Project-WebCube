import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { createHoc } from 'react-common-kit';
import { bindActionCreators } from 'redux-source-utils';

export default function connectSource(
  { stateName, denormalize, actions },
  { slice, actionsProp, enableErrorLogger = false },
) {
  const mapStateToProps = createSelector(
    [
      state => slice(state)[stateName].result,
      state => slice(state)[stateName].entities,
      state => slice(state)[stateName].errors,
      state => slice(state)[stateName].isPending,
      state => slice(state)[stateName].inited,
    ],
    /* eslint-disable max-params */
    (result, entities, errors, isPending, inited) => {
      const res = denormalize(result, entities);
      // console.log('denormalize', { result, entities }, res);
      if (
        errors.length &&
        enableErrorLogger &&
        typeof console === 'object' &&
        console.error
      ) {
        errors.forEach(error => {
          if (typeof error === 'object' && !error._reduxSourceConnectReported) {
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
          inited,
        },
      };
    },
    /* eslint-enable max-params */
  );
  const mapDispatchToProps = dispatch =>
    actionsProp
      ? {
          [actionsProp]: bindActionCreators(actions, dispatch),
        }
      : {};
  const result = createHoc(
    WrappedComponent =>
      connect(
        mapStateToProps,
        mapDispatchToProps,
      )(WrappedComponent),
    { name: 'ConnectSource' },
  );
  result.mapStateToProps = mapStateToProps;
  return result;
}
