function generateSelector(history) {
  const keys = history.slice();
  return state => {
    let cursor = state;
    for (let i = 0, l = keys.length; i < l; i++) {
      cursor = cursor[keys[i]];
    }
    return cursor;
  };
}

export default function createSelectors(tree, opt = {}) {
  const { selectors = [], history = [] } = opt;
  for (const key in tree) {
    const value = tree[key];
    if (typeof value === 'object') {
      history.push(key);
      createSelectors(value, { selectors, history });
      if (history.length > 0) {
        history.length -= 1;
      }
    } else if (typeof value === 'boolean' && value) {
      const selector = generateSelector(history.concat([key]));
      selectors.push(selector);
    }
  }
  return selectors;
}
