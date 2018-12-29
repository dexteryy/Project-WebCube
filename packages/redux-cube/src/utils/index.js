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
