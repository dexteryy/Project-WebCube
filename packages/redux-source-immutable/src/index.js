import { fromJS } from 'immutable';
import union from 'lodash/union';
import difference from 'lodash/difference';
import { createSource as _createSource } from 'redux-source-utils';

const combineMethods = {
  replace({ state, stateName, result, entities }) {
    for (const resultName in result) {
      state.mergeIn([stateName, 'result'], {
        [resultName]: result[resultName],
      });
    }
    for (const entityName in entities) {
      for (const entityId in entities[entityName]) {
        state.mergeIn(
          [stateName, 'entities', entityName, entityId],
          entities[entityName][entityId],
        );
      }
    }
  },
  merge({ state, stateName, prevResult, result, entities }) {
    for (const resultName in result) {
      if (
        Array.isArray(result[resultName]) &&
        (result[resultName].length === 0 ||
          typeof result[resultName][0] !== 'object')
      ) {
        const merged = union(prevResult[resultName], result[resultName]);
        state.mergeIn([stateName, 'result'], {
          [resultName]: merged,
        });
      } else {
        state.mergeIn([stateName, 'result'], {
          [resultName]: result[resultName],
        });
      }
    }
    for (const entityName in entities) {
      for (const entityId in entities[entityName]) {
        state.mergeIn(
          [stateName, 'entities', entityName, entityId],
          entities[entityName][entityId],
        );
      }
    }
  },
  crop({ state, stateName, prevResult, result }) {
    for (const resultName in result) {
      if (
        Array.isArray(result[resultName]) &&
        (result[resultName].length === 0 ||
          typeof result[resultName][0] !== 'object')
      ) {
        const filterd = difference(prevResult[resultName], result[resultName]);
        if (filterd.length !== prevResult[resultName].length) {
          state.mergeIn([stateName, 'result'], {
            [resultName]: filterd,
          });
        }
      } else if (prevResult[resultName] === result[resultName]) {
        state.deleteIn([stateName, 'result', resultName]);
      }
    }
  },
};

export function createSource({ schema: typeDefs, resolvers }) {
  return _createSource({
    typeDefs,
    resolvers,
    createInitialState: ({ stateName }) =>
      fromJS({
        [stateName]: {
          result: {},
          entities: {},
          isPending: false,
          pendingCount: 0,
          inited: false,
          errors: [],
        },
      }),
    pendingReducer: ({ stateName }) => state =>
      state.withMutations(_state => {
        _state.mergeIn([stateName], {
          isPending: true,
          pendingCount: _state.getIn([stateName, 'pendingCount']) + 1,
        });
        if (_state.getIn([stateName, 'errors']).size) {
          _state.setIn([stateName, 'errors'], fromJS([]));
        }
      }),
    successReducer: ({ stateName, config }) => (state, { payload = {} }) =>
      state.withMutations(_state => {
        const prevResult = _state.getIn([stateName, 'result']);
        // const prevEntities = _state.getIn([stateName, 'entities']);
        const count = _state.getIn([stateName, 'pendingCount']) - 1;
        const combineMethod = combineMethods[config.combineResult || 'merge'];
        _state.mergeIn([stateName], {
          isPending: count > 0,
          pendingCount: count,
          inited: true,
        });
        combineMethod({
          state: _state,
          stateName,
          prevResult: prevResult.toJS(),
          // prevEntities: prevEntities.toJS(),
          result: payload.result || {},
          entities: payload.entities || {},
        });
        if (_state.getIn([stateName, 'errors']).size) {
          _state.setIn([stateName, 'errors'], fromJS([]));
        }
      }),
    errorReducer: ({ stateName }) => (state, { payload }) => {
      const count = state.getIn([stateName, 'pendingCount']) - 1;
      return state.mergeIn([stateName], {
        isPending: count > 0,
        pendingCount: count,
        inited: true,
        errors: payload,
      });
    },
  });
}
