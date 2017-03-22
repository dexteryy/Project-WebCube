
import { handleActions } from 'redux-actions';

let itemId = 0;

export default handleActions({
  ADD_ITEM: (state, action) => Object.assign({}, state, {
    list: state.list.concat([
      Object.assign({}, action.payload, {
        id: ++itemId,
      }),
    ]),
  }),
  REMOVE_ITEM: (state, action) => Object.assign({}, state, {
    list: state.list.filter((item) => item.id !== action.payload),
  }),
}, {
  list: [],
  message: 'Success!',
});
