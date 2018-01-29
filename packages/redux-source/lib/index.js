import { execute } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { constantCase } from 'change-case';
import { schema, normalize, denormalize } from 'normalizr';
import { isPlural } from 'pluralize';

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
      root[name.value] = isPlural(name.value) ? [entity] : entity;
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

export function createSource({ schema: typeDefs, resolvers }) {
  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  return function source(
    gqlAst,
    {
      stateName = 'source',
      idAttribute = 'id',
      namespace = 'REDUX_SOURCE',
      delimiter = '/',
    },
  ) {
    const normalizeSchema = astToNormalizeSchema(gqlAst, { idAttribute });
    const { definitions } = gqlAst;
    const actions = {};
    const reducerMap = {};
    const initialState = {
      [stateName]: {
        data: {},
        isPending: false,
        pendingCount: 0,
        errors: [],
      },
    };
    definitions.forEach(operation => {
      const { name } = operation;
      const TYPE = [namespace, `${constantCase(name.value)}`].join(delimiter);
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
              isPending: true,
              pendingCount: state[stateName].pendingCount + 1,
              errors: [],
            },
          },
        },
      });
      reducerMap[SUCCESS_TYPE] = (state, { payload }) => {
        const count = state[stateName].pendingCount - 1;
        return {
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
              isPending: count > 0,
              pendingCount: count,
              errors: [],
            },
          },
        };
      };
      reducerMap[ERROR_TYPE] = (state, { payload }) => {
        const count = state[stateName].pendingCount - 1;
        return {
          ...state,
          ...{
            [stateName]: {
              ...state[stateName],
              ...{
                isPending: count > 0,
                pendingCount: count,
                errors: payload,
              },
            },
          },
        };
      };
    });
    return {
      actions,
      reducerMap,
      initialState,
      normalizeSchema,
      stateName,
      idAttribute,
      namespace,
      delimiter,
      normalize(data) {
        const normalizedData = {};
        for (const key in data) {
          if (!normalizeSchema[key]) {
            throw new Error(
              `Invalid input. Allowed keys: ${Object.keys(normalizeSchema).join(
                ', ',
              )}`,
            );
          }
          normalizedData[key] = normalize(data[key], normalizeSchema[key]);
        }
        return normalizedData;
      },
      denormalize(normalizedData) {
        const data = {};
        for (const key in normalizedData) {
          if (!normalizeSchema[key]) {
            throw new Error(
              `Invalid input. Allowed keys: ${Object.keys(normalizeSchema).join(
                ', ',
              )}`,
            );
          }
          const { result, entities } = normalizedData[key];
          Object.assign(
            data,
            denormalize(
              { [key]: result },
              { [key]: normalizeSchema[key] },
              entities,
            ),
          );
        }
        return data;
      },
    };
  };
}
