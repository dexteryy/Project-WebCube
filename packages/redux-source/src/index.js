import { union, difference } from 'lodash';
import { createSource as _createSource } from 'redux-source-utils';

const combineMethods = {
  replace({ prevResult, prevEntities, result, entities }) {
    const newState = {};
    const newResults = { ...prevResult };
    for (const resultName in result) {
      newResults[resultName] = result[resultName];
    }
    const newEntities = {};
    for (const entityName in entities) {
      newEntities[entityName] = { ...(prevEntities[entityName] || {}) };
      for (const entityId in entities[entityName]) {
        newEntities[entityName][entityId] = {
          ...((prevEntities[entityName] || {})[entityId] || {}),
          ...entities[entityName][entityId],
        };
      }
    }
    if (Object.keys(result).length) {
      newState.result = {
        ...prevResult,
        ...newResults,
      };
    }
    if (Object.keys(newEntities).length) {
      newState.entities = {
        ...prevEntities,
        ...newEntities,
      };
    }
    return newState;
  },

  merge({ prevResult, prevEntities, result, entities }) {
    const newState = {};
    const newResults = { ...prevResult };
    for (const resultName in result) {
      if (
        Array.isArray(result[resultName]) &&
        (result[resultName].length === 0 ||
          typeof result[resultName][0] !== 'object')
      ) {
        newResults[resultName] = union(
          prevResult[resultName],
          result[resultName],
        );
      } else {
        newResults[resultName] = result[resultName];
      }
    }
    const newEntities = {};
    for (const entityName in entities) {
      newEntities[entityName] = { ...(prevEntities[entityName] || {}) };
      for (const entityId in entities[entityName]) {
        newEntities[entityName][entityId] = {
          ...((prevEntities[entityName] || {})[entityId] || {}),
          ...entities[entityName][entityId],
        };
      }
    }
    if (Object.keys(result).length) {
      newState.result = {
        ...prevResult,
        ...newResults,
      };
    }
    if (Object.keys(newEntities).length) {
      newState.entities = {
        ...prevEntities,
        ...newEntities,
      };
    }
    return newState;
  },

  crop({ prevResult, result }) {
    const newState = {};
    const newResult = { ...prevResult };
    let isResultChange = false;
    for (const resultName in result) {
      if (
        Array.isArray(result[resultName]) &&
        (result[resultName].length === 0 ||
          typeof result[resultName][0] !== 'object')
      ) {
        const filterd = difference(prevResult[resultName], result[resultName]);
        if (filterd.length !== prevResult[resultName].length) {
          newResult[resultName] = filterd;
          isResultChange = true;
        }
      } else if (prevResult[resultName] === result[resultName]) {
        delete newResult[resultName];
        isResultChange = true;
      }
    }
    if (isResultChange) {
      newState.result = newResult;
    }
    return newState;
  },
};

export function createSource({ schema: typeDefs, resolvers }) {
  return _createSource({
    typeDefs,
    resolvers,
    createInitialState: ({ stateName }) => ({
      [stateName]: {
        result: {},
        entities: {},
        isPending: false,
        pendingCount: 0,
        inited: false,
        errors: [],
      },
    }),
    pendingReducer: ({ stateName }) => state => {
      const newSourceState = {
        isPending: true,
        pendingCount: state[stateName].pendingCount + 1,
      };
      if (state[stateName].errors.length) {
        newSourceState.errors = [];
      }
      return {
        ...state,
        ...{
          [stateName]: {
            ...state[stateName],
            ...newSourceState,
          },
        },
      };
    },
    successReducer: ({ stateName, config }) => (state, { payload = {} }) => {
      const {
        result: prevResult,
        entities: prevEntities,
        pendingCount,
      } = state[stateName];
      const combineMethod = combineMethods[config.combineResult || 'merge'];
      const newNormalizedData =
        combineMethod({
          prevResult,
          prevEntities,
          result: payload.result || {},
          entities: payload.entities || {},
        }) || {};
      const count = pendingCount - 1;
      const newSourceState = {
        ...newNormalizedData,
        isPending: count > 0,
        pendingCount: count,
        inited: true,
      };
      if (state[stateName].errors.length) {
        newSourceState.errors = [];
      }
      return {
        ...state,
        ...{
          [stateName]: {
            ...state[stateName],
            ...newSourceState,
          },
        },
      };
    },
    errorReducer: ({ stateName }) => (state, { payload }) => {
      const count = state[stateName].pendingCount - 1;
      return {
        ...state,
        ...{
          [stateName]: {
            ...state[stateName],
            ...{
              isPending: count > 0,
              pendingCount: count,
              inited: true,
              errors: payload,
            },
          },
        },
      };
    },
  });
}
