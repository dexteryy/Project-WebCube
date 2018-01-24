import { execute } from 'graphql';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import changeCase from 'change-case';
import { schema, normalize } from 'normalizr';
import pluralize from 'pluralize';

const mocks = {
  Int: () => 0,
  Float: () => 0,
  String: () => '',
  Boolean: () => false,
  ID: () => Date.now() * 1000 + Math.floor(Math.random() * 1000),
};

function astToNormalizeSchema(gqlAst, { idAttribute }) {
  const normalizeSchema = {};
  const entityOption = { idAttribute };
  const { definitions } = gqlAst;
  const traverseProp = root => ({ name, selectionSet }) => {
    if (!selectionSet) {
      return;
    }
    const childRoot = {};
    selectionSet.selections.forEach(traverseProp(childRoot));
    if (name.value !== idAttribute) {
      const entity = new schema.Entity(name.value, childRoot, entityOption);
      root[name.value] = pluralize.isPlural(name.value) ? [entity] : entity;
    }
  };
  definitions.forEach(({ selectionSet: { selections } }) => {
    selections.forEach(traverseProp(normalizeSchema));
  });
  return normalizeSchema;
}

function normalizeData(originData, normalizeSchema) {
  const res = {};
  Object.keys(originData).forEach(key => {
    const value = originData[key];
    res[key] =
      value && normalizeSchema[key]
        ? normalize(value, normalizeSchema[key])
        : value;
  });
  return res;
}

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
  return function source(gqlAst, { stateName = 'source', idAttribute = 'id' }) {
    const normalizeSchema = astToNormalizeSchema(gqlAst, { idAttribute });
    const { definitions } = gqlAst;
    const actions = {};
    const reducerMap = {};
    const defaultResult = {
      [stateName]: {
        data: {},
        isLoading: false,
        errors: [],
      },
    };
    definitions.forEach(operation => {
      const { name } = operation;
      const { data: defaultData } = execute(
        defaultStateSchema,
        gqlAst,
        null,
        null,
        null,
        name.value,
      );
      if (defaultData) {
        Object.assign(
          defaultResult[stateName].data,
          normalizeData(defaultData, normalizeSchema),
        );
      }
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
              payload: result.data
                ? normalizeData(result.data, normalizeSchema)
                : null,
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
            data:
              state[stateName].data || payload
                ? {
                    ...state[stateName].data,
                    ...payload,
                  }
                : null,
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
