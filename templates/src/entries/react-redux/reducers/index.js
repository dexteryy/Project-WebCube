
import { handleActions } from 'redux-actions';

let itemId = 0;

const list = handleActions({
  ADD_ITEM: (state, action) => state.concat([
    Object.assign({}, action.payload, {
      id: ++itemId,
    }),
  ]),
  REMOVE_ITEM: (state, action) =>
    state.filter((item) => item.id !== action.payload),
}, []);

export default {
  list,
};
