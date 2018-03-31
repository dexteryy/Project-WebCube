import { execute } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
// https://stackoverflow.com/questions/46562561/apollo-graphql-field-type-for-object-with-dynamic-keys
import GraphQLJSON from 'graphql-type-json';
// https://www.npmjs.com/package/graphql-iso-date
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';
import { constantCase } from 'change-case';
import { schema, normalize, denormalize } from 'normalizr';
import { singular, isPlural } from 'pluralize';

const RE_LIST_SUFFIX = /_$list(_|$)/;

function astToNormalizeSchema(gqlAst, { idAttribute }) {
  const { definitions } = gqlAst;
  const framents = {};
  definitions.forEach(definition => {
    const { kind, name, alias } = definition;
    if (kind === 'FragmentDefinition') {
      framents[alias ? alias.value : name.value] = definition;
    }
  });
  const normalizeSchema = {};
  /* eslint-disable max-statements */
  const traverseProp = root => field => {
    const { name, alias, selectionSet } = field;
    const { value: originName } = name;
    if (!selectionSet || originName === idAttribute) {
      return;
    }
    const spreadSections = [];
    selectionSet.selections.forEach(selection => {
      if (selection.kind === 'FragmentSpread') {
        const fragment =
          framents[
            selection.alias ? selection.alias.value : selection.name.value
          ];
        if (!fragment || !fragment.selectionSet) {
          return;
        }
        spreadSections.push(...fragment.selectionSet.selections);
      } else if (selection.kind === 'Field') {
        spreadSections.push(selection);
      }
    });
    let hasId = false;
    for (let i = 0; i < spreadSections.length; i++) {
      if (spreadSections[i].name.value === idAttribute) {
        hasId = true;
        break;
      }
    }
    // if (!hasId && normalizeSchema === root) {
    //   throw new Error(
    //     '[redux-source] The result of query/mutation operation (an object or objects in an array) must have id attrubute',
    //   );
    // }
    const childRoot = {};
    spreadSections.forEach(traverseProp(childRoot));
    let isList = false;
    let dataName = alias ? alias.value : originName;
    if (RE_LIST_SUFFIX.test(dataName)) {
      isList = true;
      dataName = dataName.replace(RE_LIST_SUFFIX, '$1');
      if (alias) {
        alias.value = originName;
      } else {
        name.value = originName;
      }
    } else if (isPlural(dataName)) {
      isList = true;
    }
    const entity = hasId
      ? new schema.Entity(singular(dataName), childRoot, {
          idAttribute,
        })
      : childRoot;
    root[dataName] = isList ? [entity] : entity;
  };
  /* eslint-enable max-statements */
  definitions.forEach(definition => {
    const { kind, selectionSet } = definition;
    if (kind !== 'OperationDefinition') {
      return;
    }
    selectionSet.selections.forEach(traverseProp(normalizeSchema));
  });
  return normalizeSchema;
}

function getConfig(selectionSet) {
  const config = {};
  const selections = (selectionSet && selectionSet.selections) || [];
  const { name: { value: configFieldName }, selectionSet: configSelectionSet } =
    selections[0] || {};
  if (configFieldName === '__config__') {
    selections.shift();
    if (configSelectionSet) {
      configSelectionSet.selections.forEach(
        ({ alias: { value: key }, name: { value } }) => {
          config[key] = value;
        },
      );
    }
  }
  return config;
}

export default function createSource({
  typeDefs,
  resolvers,
  createInitialState,
  pendingReducer,
  successReducer,
  errorReducer,
}) {
  const executableSchema = makeExecutableSchema({
    // https://github.com/apollographql/graphql-tools/blob/master/docs/source/scalars.md
    typeDefs: `
      scalar JSON
      scalar Date
      scalar Time
      scalar DateTime
      ${typeDefs}
    `,
    resolvers: {
      JSON: GraphQLJSON,
      Date: GraphQLDate,
      Time: GraphQLTime,
      DateTime: GraphQLDateTime,
      ...resolvers,
    },
  });
  return function source(gqlAst, opt = {}) {
    const {
      stateName = 'source',
      idAttribute = 'id',
      namespace = 'REDUX_SOURCE',
      delimiter = '/',
    } = opt;
    // console.log'GQL AST', gqlAst);
    const { definitions } = gqlAst;
    const actions = {};
    const reducerMap = {};
    const initialState = createInitialState({
      stateName,
    });
    definitions.forEach(({ name, kind, operation, selectionSet }) => {
      if (kind !== 'OperationDefinition') {
        return;
      }
      const config = getConfig(selectionSet);
      const TYPE = [namespace, `${constantCase(name.value)}`].join(delimiter);
      const PENDING_TYPE = `${TYPE}_PENDING`;
      const SUCCESS_TYPE = `${TYPE}_SUCCESS`;
      const ERROR_TYPE = `${TYPE}_ERROR`;
      const actionCreator = args => dispatch => {
        dispatch({
          type: PENDING_TYPE,
        });
        execute(executableSchema, gqlAst, null, {}, args, name.value).then(
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
                ? normalize(result.data, normalizeSchema)
                : null,
            });
          },
        );
      };
      actions[TYPE] = actionCreator;
      reducerMap[PENDING_TYPE] = pendingReducer({
        stateName,
        operationName: name.value,
        operationType: operation,
        config,
      });
      reducerMap[SUCCESS_TYPE] = successReducer({
        stateName,
        operationName: name.value,
        operationType: operation,
        config,
      });
      reducerMap[ERROR_TYPE] = errorReducer({
        stateName,
        operationName: name.value,
        operationType: operation,
        config,
      });
    });
    const normalizeSchema = astToNormalizeSchema(gqlAst, { idAttribute });
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
        return normalize(data, normalizeSchema);
      },
      denormalize(result, entities) {
        return denormalize(result, normalizeSchema, entities);
      },
    };
  };
}
