import { execute } from 'graphql';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import changeCase from 'change-case';
import { merge } from 'lodash';
// import { normalize, schema } from 'normalizr';

const mocks = {
  Int: () => 0,
  Float: () => 0,
  String: () => '',
  Boolean: () => false,
  ID: () => Date.now() * 1000 + Math.floor(Math.random() * 1000),
};

export function createSource({
  schema: typeDefs,
  resolvers,
  defaultValues,
  namespace = 'GQL_SOURCE',
  delimiter = '/',
}) {
  const defaultStateSchema = makeExecutableSchema({ typeDefs });
  addMockFunctionsToSchema({
    schema: defaultStateSchema,
    mocks: {
      ...mocks,
      ...defaultValues,
    },
  });
  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  return function source(gqlAst, { stateName = 'source' }) {
    const { definitions } = gqlAst;
    const actions = {};
    const reducerMap = {};
    const defaultResult = {};
    definitions.forEach(operation => {
      const { name } = operation;
      merge(defaultResult, {
        [stateName]: {
          ...execute(defaultStateSchema, gqlAst, null, null, null, name.value),
          isLoading: false,
          errors: [],
        },
      });
      const TYPE = [namespace, `${changeCase.constantCase(name.value)}`].join(
        delimiter,
      );
      const PENDING_TYPE = `${TYPE}_PENDING`;
      const SUCCESS_TYPE = `${TYPE}_SUCCESS`;
      const ERROR_TYPE = `${TYPE}_ERROR`;
      const actionCreator = args => dispatch => {
        dispatch({
          type: PENDING_TYPE,
          payload: null,
        });
        execute(executableSchema, gqlAst, null, null, args, name.value).then(
          result => {
            if (result.errors && result.errors.length) {
              return dispatch({
                type: ERROR_TYPE,
                payload: result.errors,
              });
            }
            return dispatch({
              type: SUCCESS_TYPE,
              payload: result.data,
            });
          },
        );
      };
      actions[TYPE] = actionCreator;
      reducerMap[PENDING_TYPE] = state => ({
        ...state,
        ...{
          [stateName]: {
            ...state[stateName],
            ...{
              isLoading: true,
              errors: [],
            },
          },
        },
      });
      reducerMap[SUCCESS_TYPE] = (state, { payload }) => ({
        ...state,
        ...{
          [stateName]: {
            data: {
              ...state[stateName].data,
              ...payload,
            },
            isLoading: false,
            errors: [],
          },
        },
      });
      reducerMap[ERROR_TYPE] = (state, { payload }) => ({
        ...state,
        ...{
          [stateName]: {
            ...state[stateName],
            ...{
              isLoading: false,
              errors: payload,
            },
          },
        },
      });
    });
    return {
      actions,
      reducerMap,
      defaultResult,
    };
  };
}
