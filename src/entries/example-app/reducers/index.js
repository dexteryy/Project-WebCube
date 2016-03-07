
import { handleActions } from 'redux-actions';

let triggerId = 0;

const triggers = handleActions({
  ADD_EFFECT_TRIGGER: (state, action) => state.concat([
    Object.assign({}, action.payload, {
      id: ++triggerId,
    }),
  ]),
  REMOVE_EFFECT_TRIGGER: (state, action) =>
    state.filter((trigger) => trigger.id !== action.payload),
}, []);

function jobs(state = { sections: [], jobs: [] }) {
  return state;
}

export default {
  triggers,
  jobs,
};
