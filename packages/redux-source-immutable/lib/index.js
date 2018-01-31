import { makeExecutableSchema } from 'graphql-tools';
import { fromJS, List, Map } from 'immutable';
import _createSource from 'redux-source/lib/createSource';

export function createSource({ schema: typeDefs, resolvers }) {
  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  return _createSource({
    executableSchema,
    createInitialState: ({ stateName }) =>
      fromJS({
        [stateName]: {
          data: {},
          isPending: false,
          pendingCount: 0,
          errors: [],
        },
      }),
    pendingReducer: ({ stateName }) => state =>
      state.mergeIn(
        [stateName],
        Map({
          isPending: true,
          pendingCount: state.getIn([stateName, 'pendingCount']) + 1,
          errors: List(),
        }),
      ),
    successReducer: ({ stateName }) => (state, { payload }) =>
      state.withMutations(_state => {
        const count = _state.getIn([stateName, 'pendingCount']) - 1;
        const data = _state.getIn([stateName, 'data']);
        _state.mergeIn(
          [stateName],
          Map({
            isPending: count > 0,
            pendingCount: count,
            errors: List(),
          }),
        );
        if (payload) {
          if (!data) {
            _state.setIn([stateName, 'data'], fromJS(payload));
          } else {
            _state.mergeIn([stateName, 'data'], fromJS(payload));
          }
        } else {
          _state.setIn([stateName, 'data'], null);
        }
      }),
    errorReducer: ({ stateName }) => (state, { payload }) => {
      const count = state.getIn([stateName, 'pendingCount']) - 1;
      return state.mergeIn(
        [stateName],
        Map({
          isPending: count > 0,
          pendingCount: count,
          errors: fromJS(payload),
        }),
      );
    },
  });
}
