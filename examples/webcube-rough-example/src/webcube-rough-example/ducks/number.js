import update from 'immutability-helper';
import cube from '../cube';

cube.add({
  load: () => import('../data/data.json'),
});

cube.handle(
  'number',
  {
    increase: (state, { payload }) =>
      update(state, { value: { $set: state.value + payload } }),
    decrease: (state, { payload }) =>
      update(state, { value: { $set: state.value - payload } }),
    loadPending: state => update(state, { loading: { $set: true } }),
    loadFulfilled: (state, { payload }) =>
      update(state, {
        value: { $set: payload.default.data[2] },
        loading: { $set: false },
      }),
    reset: state => update(state, { value: { $set: 0 } }),
  },
  {
    loading: false,
    value: 0,
  },
);
