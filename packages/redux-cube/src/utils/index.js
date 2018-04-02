const IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
const IS_RECORD_SENTINEL = '@@__IMMUTABLE_RECORD__@@';

export function unwrap(state) {
  const isImmutable = state[IS_ITERABLE_SENTINEL] || state[IS_RECORD_SENTINEL];
  const wrapperName = isImmutable
    ? state.get('_autoWrapper')
    : state._autoWrapper;
  if (wrapperName) {
    if (isImmutable) {
      return unwrap(state.get(wrapperName));
    } else {
      return unwrap(state[state._autoWrapper]);
    }
  } else {
    return state;
  }
}

export function bindActionCreator(actionCreator, dispatch) {
  return function(...args) {
    return dispatch(actionCreator(...args));
  };
}

export function bindActionCreators(actionCreators, dispatch) {
  const keys = Object.keys(actionCreators);
  const boundActionCreators = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    } else if (typeof actionCreator === 'object') {
      boundActionCreators[key] = bindActionCreators(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}

export function combineReducersWith(fn, target, ...moreArgs) {
  const newTarget = {};
  for (const key in target) {
    let value = target[key];
    let childArgs = [];
    if (Array.isArray(value)) {
      [value, ...childArgs] = value;
    }
    if (typeof value === 'object') {
      newTarget[key] = combineReducersWith(fn, value, ...childArgs);
    } else {
      newTarget[key] = target[key];
    }
  }
  return fn(newTarget, ...moreArgs);
}
