// https://www.npmjs.com/package/redux-actions
import { createAction, handleAction, handleActions } from 'redux-actions';
import changeCase from 'change-case';
import deepMerge from 'lodash/merge';

const ACTION_CREATOR = '__CUSTOM_ACTION_CREATOR__';
const RE_IS_CONSTANT = /^[A-Z0-9_]+$/;
const RE_IS_ARRAY_TOSTRING = /,/;
const RE_INVALID_DELIMIER = /[_.a-zA-Z0-9]/;

function defaultMetaCreator(payload, meta) {
  return meta;
}

function normalizeActionType(key) {
  let regularKey = key;
  if (!RE_IS_CONSTANT.test(key)) {
    regularKey = changeCase.constantCase(key);
    if (!RE_IS_CONSTANT.test(regularKey)) {
      throw new Error(
        `[redux-cube] action type "${key}" must be constant case ("TEST_STRING") or camel case ("testString").`,
      );
    }
  }
  return regularKey;
}

function flattenActionNamespaces(
  obj,
  {
    flatDict = {},
    history = [],
    // https://redux-actions.js.org/docs/api/handleAction.html#handleactions
    delimiter,
  },
) {
  for (const key in obj) {
    const value = obj[key];
    let regularKey;
    if (RE_IS_ARRAY_TOSTRING.test(key)) {
      // like combineActions, but support actionMap value
      key
        .split(',')
        .map(newKey =>
          newKey
            .split(delimiter)
            .map(splitedKey => normalizeActionType(splitedKey))
            .join(delimiter),
        )
        .forEach(newKey => {
          history.push(newKey);
          flattenActionNamespaces(
            {
              [newKey]: value,
            },
            { flatDict, history, delimiter },
          );
          if (history.length > 0) {
            history.length -= 1;
          }
        });
      continue;
    } else {
      regularKey = key
        .split(delimiter)
        .map(splitedKey => normalizeActionType(splitedKey))
        .join(delimiter);
    }
    if (
      !Array.isArray(value) &&
      typeof value === 'object' &&
      !value[ACTION_CREATOR]
    ) {
      history.push(regularKey);
      flattenActionNamespaces(value, { flatDict, history, delimiter });
      if (history.length > 0) {
        history.length -= 1;
      }
    } else {
      const newKey = history.concat([regularKey]).join(delimiter);
      flatDict[newKey] = value;
    }
  }
  return flatDict;
}

function unflatten(
  regularType,
  actionCreator,
  { actions = {}, types = {}, delimiter },
) {
  let cursor = actions;
  let cursor2 = types;
  const namespaces = regularType.split(delimiter);
  namespaces.forEach((namespace, n) => {
    const key = changeCase.camelCase(namespace);
    if (n < namespaces.length - 1) {
      if (!cursor[key]) {
        cursor[key] = {};
        cursor2[key] = {};
      }
      cursor = cursor[key];
      cursor2 = cursor2[key];
    } else {
      cursor[key] = actionCreator;
      cursor2[key] = regularType;
    }
  });
  return { actions: cursor, types: cursor2 };
}

function unflattenDict(flattenDict, { actions = {}, types = {}, delimiter }) {
  Object.keys(flattenDict).forEach(regularType => {
    unflatten(regularType, flattenDict[regularType], {
      actions,
      types,
      delimiter,
    });
  });
  return { actions, types };
}

function withTypes({ delimiter }) {
  return function(typeDict) {
    /* eslint-disable babel/no-invalid-this */
    const { actions, types } = unflattenDict(typeDict, { delimiter });
    return {
      ...this,
      typeDict: Object.assign(this.typeDict, typeDict),
      actions: deepMerge(this.actions, actions),
      types: deepMerge(this.types, types),
    };
    /* eslint-enable babel/no-invalid-this */
  };
}

export class Hub {
  static defaultConfig = {
    delimiter: '/',
  };

  ACTION_CREATOR = ACTION_CREATOR;

  constructor(config = {}) {
    this.hub = {};
    this.config = Object.assign({}, Hub.defaultConfig, config);
    const { delimiter } = this.config;
    if (RE_INVALID_DELIMIER.test(delimiter)) {
      throw new Error(`[redux-cube] "${delimiter}" is not valid delimiter`);
    }
  }

  record(regularType, actionCreator) {
    const { hub } = this;
    if (hub[regularType]) {
      throw new Error(`[redux-cube] action type "${regularType}" existed`);
    }
    hub[regularType] = actionCreator;
  }

  addAction(type, payloadCreator, metaCreator = defaultMetaCreator) {
    const { delimiter } = this.config;
    const namespaces = type.split(delimiter);
    let regularType;
    if (namespaces.length > 0) {
      regularType = namespaces
        .map(ns => normalizeActionType(ns))
        .join(delimiter);
    } else {
      regularType = normalizeActionType(type);
    }
    const actionCreator = createAction(
      regularType,
      payloadCreator,
      metaCreator,
    );
    this.record(regularType, actionCreator);
    return {
      typeDict: {
        [regularType]: actionCreator,
      },
      ...unflatten(regularType, actionCreator, {
        delimiter,
      }),
    };
  }

  addActions(actionMap, ...identityActions) {
    const { delimiter } = this.config;
    const typeDict = {};
    const flatActionMap = flattenActionNamespaces(actionMap, {
      delimiter,
    });
    Object.keys(flatActionMap).forEach(regularType => {
      const value = flatActionMap[regularType];
      if (Array.isArray(value)) {
        Object.assign(typeDict, this.addAction(regularType, ...value).typeDict);
      } else if (value === true) {
        Object.assign(typeDict, this.addAction(regularType).typeDict);
      } else if (typeof value === 'object' && value[this.ACTION_CREATOR]) {
        typeDict[regularType] = value[this.ACTION_CREATOR];
      } else {
        Object.assign(typeDict, this.addAction(regularType, value).typeDict);
      }
    });
    // https://redux-actions.js.org/docs/api/createAction.html#createactionsactionmap-identityactions
    identityActions.forEach(type => {
      if (!type) {
        return;
      }
      Object.assign(typeDict, this.addAction(type).typeDict);
    });
    return {
      typeDict,
      ...unflattenDict(typeDict, { delimiter }),
    };
  }

  handleAction(type, reducer, initialState) {
    const { hub } = this;
    const { delimiter } = this.config;
    const regularType = normalizeActionType(type);
    let typeDict, actions, types;
    const actionCreator = hub[regularType];
    if (!actionCreator) {
      ({ typeDict, actions, types } = this.addAction(regularType));
    } else {
      typeDict = { [regularType]: actionCreator };
      ({ actions, types } = unflattenDict(typeDict, { delimiter }));
    }
    const res = {
      typeDict,
      types,
      actions,
      reducer: handleAction(regularType, reducer, initialState),
      mergeActions: withTypes({ delimiter }),
    };
    res.with = res.mergeActions;
    return res;
  }

  handleActions(reducerMap, initialState) {
    const { hub } = this;
    const { delimiter } = this.config;
    const typeDict = {};
    const flatReducerMap = flattenActionNamespaces(reducerMap, {
      delimiter,
    });
    Object.keys(flatReducerMap).forEach(regularType => {
      const actionCreator = hub[regularType];
      if (!actionCreator) {
        Object.assign(typeDict, this.addAction(regularType).typeDict);
      } else {
        typeDict[regularType] = actionCreator;
      }
    });
    const res = {
      typeDict,
      ...unflattenDict(typeDict, { delimiter }),
      reducer: handleActions(flatReducerMap, initialState, {
        namespace: delimiter,
      }),
      mergeActions: withTypes({ delimiter }),
    };
    res.with = res.mergeActions;
    return res;
  }

  // https://redux-actions.js.org/docs/api/createAction.html#createaction
  // https://redux-actions.js.org/docs/api/createAction.html#createactions
  // params are same as createAction and createActions
  add(type, payloadCreator, metaCreator, ...identityActions) {
    if (typeof type === 'object') {
      return this.addActions(
        type,
        payloadCreator,
        metaCreator,
        ...identityActions,
      );
    } else if (typeof type === 'string') {
      return this.addAction(type, payloadCreator, metaCreator);
    } else {
      throw new Error(
        '[redux-cube] first param of hub.add() must be an action type or an actionMap.',
      );
    }
  }

  // https://redux-actions.js.org/docs/api/handleAction.html#handleaction
  // https://redux-actions.js.org/docs/api/handleAction.html#handleactions
  // params are same as handleAction and handleActions (in addition to the below)
  handle(type, reducer, defaultState) {
    let reducerMap;
    let initialState = defaultState;
    if (Array.isArray(type)) {
      reducerMap = {
        [type]: reducer,
      };
      return this.handleActions(reducerMap, initialState);
    } else if (typeof type === 'object') {
      reducerMap = type;
      initialState = reducer;
      return this.handleActions(reducerMap, initialState);
    } else if (typeof type === 'string') {
      return this.handleAction(type, reducer, initialState);
    } else {
      throw new Error(
        '[redux-cube] first param of hub.handle() must be an action type or a reducerMap.',
      );
    }
  }

  action(path, ...args) {
    const { hub } = this;
    const { delimiter } = this.config;
    const regularType = path
      .split('.')
      .map(type => normalizeActionType(type))
      .join(delimiter);
    let actionCreator = hub[regularType];
    if (!actionCreator) {
      actionCreator = this.addAction(regularType).typeDict[regularType];
    }
    return actionCreator(...args);
  }

  types(selectorMap) {
    const { hub } = this;
    const { delimiter } = this.config;
    const paths = flattenActionNamespaces(selectorMap, { delimiter });
    const results = {};
    for (const type in hub) {
      for (const path in paths) {
        if (type === path || type.indexOf(`${path}${delimiter}`) === 0) {
          results[type] = hub[type];
        }
      }
    }
    return results;
  }

  actions(selectorMap) {
    const { delimiter } = this.config;
    const typeDict = this.types(selectorMap);
    return unflattenDict(typeDict, { delimiter }).actions;
  }
}

export default function createHub(config) {
  return new Hub(config);
}
