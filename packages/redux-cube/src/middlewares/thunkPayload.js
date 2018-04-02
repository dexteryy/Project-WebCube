export default function thunkPayload(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action.payload === 'function') {
      const newAction = {
        ...action,
        // https://github.com/gaearon/redux-thunk/blob/master/src/index.js
        payload: action.payload(dispatch, getState, extraArgument),
      };
      return next(newAction);
    }
    return next(action);
  };
}
