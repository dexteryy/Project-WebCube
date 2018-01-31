import { makeExecutableSchema } from 'graphql-tools';
import _createSource from './createSource';

export function createSource({ schema: typeDefs, resolvers }) {
  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  return _createSource({
    executableSchema,
    createInitialState: ({ stateName }) => ({
      [stateName]: {
        data: {},
        isPending: false,
        pendingCount: 0,
        errors: [],
      },
    }),
    pendingReducer: ({ stateName }) => state => ({
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
    }),
    successReducer: ({ stateName }) => (state, { payload }) => {
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
              errors: payload,
            },
          },
        },
      };
    },
  });
}
