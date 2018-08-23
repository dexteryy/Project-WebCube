import { merge } from 'lodash';
import createHub from './createHub';
import createApp from './createApp';
import connect from './connect';
import load from './load';

class Cube {
  reducers = {};

  initialStates = {};

  typeDict = {};

  type = {};

  actions = {};

  sources = {};

  loaders = [];

  constructor(opt = {}) {
    const { connectSource, ...hubConfig } = opt;
    this.connectSource = connectSource;
    this.hub = createHub(hubConfig);
  }

  createApp({ reducers, ...opt }) {
    return createApp({
      reducers: reducers || Object.assign({}, this.reducers, reducers),
      loaders: this.loaders,
      ...opt,
    });
  }

  connect({
    selectSource,
    sourceSelectors: _sourceSelectors,
    enableErrorLogger,
    loader,
    isLoaded,
    ...opt
  }) {
    return component => {
      let result = loader ? load({ loader, isLoaded })(component) : component;
      const mapStateToPropsQueue = [];
      const mapDispatchToPropsQueue = [];
      if (loader) {
        this.loaders.push({
          loader,
          isLoaded,
          mapStateToPropsQueue,
          mapDispatchToPropsQueue,
          actions: this.actions,
        });
      }
      let connectHoc = connect(
        Object.assign({}, opt, {
          actions: this.actions,
        }),
      );
      mapStateToPropsQueue.push(connectHoc.mapStateToProps);
      mapDispatchToPropsQueue.push(connectHoc.mapDispatchToProps);
      result = connectHoc(result);
      const sourceSelectors = selectSource || _sourceSelectors;
      if (sourceSelectors) {
        sourceSelectors.forEach(selector => {
          const sourceState = selector(this.sources);
          const connectToSource = source => {
            connectHoc = this.connectSource(source, {
              slice: selector,
              enableErrorLogger,
            });
            mapStateToPropsQueue.push(connectHoc.mapStateToProps);
            result = connectHoc(result);
          };
          if (sourceState.stateName) {
            connectToSource(sourceState);
          } else {
            Object.keys(sourceState).forEach(stateName =>
              connectToSource(sourceState[stateName]),
            );
          }
        });
      }
      return result;
    };
  }

  handle(sliceKey, maybeSource, initialState, ...args) {
    let hubResult;
    if (
      maybeSource &&
      typeof maybeSource === 'object' &&
      maybeSource.reducerMap &&
      maybeSource.initialState &&
      maybeSource.actions
    ) {
      const mergedState = {
        ...(this.initialStates[sliceKey] || {}),
        ...maybeSource.initialState,
      };
      this.initialStates[sliceKey] = mergedState;
      hubResult = this.hub
        .handle(
          {
            ...maybeSource.reducerMap,
          },
          mergedState,
        )
        .mergeActions(maybeSource.actions);
      if (!this.sources[sliceKey]) {
        this.sources[sliceKey] = {};
      }
      this.sources[sliceKey][maybeSource.stateName] = maybeSource;
    } else if (typeof maybeSource === 'string') {
      const mergedState = {
        ...(this.initialStates[sliceKey] || {}),
        ...args[0],
      };
      this.initialStates[sliceKey] = mergedState;
      hubResult = this.hub.handle(
        maybeSource,
        initialState,
        mergedState,
        ...args.slice(1),
      );
    } else if (typeof maybeSource === 'object') {
      const mergedState = {
        ...(this.initialStates[sliceKey] || {}),
        ...initialState,
      };
      this.initialStates[sliceKey] = mergedState;
      hubResult = this.hub.handle(maybeSource, mergedState, ...args);
    }
    const prevReducer = this.reducers[sliceKey];
    if (prevReducer) {
      this.reducers[sliceKey] = (
        state = this.initialStates[sliceKey],
        action,
      ) => hubResult.reducer(prevReducer(state, action), action);
    } else {
      this.reducers[sliceKey] = hubResult.reducer;
    }
    merge(this.typeDict, hubResult.typeDict);
    merge(this.types, hubResult.types);
    merge(this.actions, hubResult.actions);
    return this;
  }

  add(...args) {
    const hubResult = this.hub.add(...args);
    merge(this.typeDict, hubResult.typeDict);
    merge(this.types, hubResult.types);
    merge(this.actions, hubResult.actions);
    return this;
  }

  action(...args) {
    return this.hub.action(...args);
  }

  actions(...args) {
    return this.hub.actions(...args);
  }

  types(...args) {
    return this.hub.types(...args);
  }
}

export default function createCube(...args) {
  return new Cube(...args);
}
