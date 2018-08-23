import { merge } from 'lodash';
import createHub from './createHub';
import createApp from './createApp';
import connect from './connect';
import load from './load';

class Cube {
  reducers = {};

  typeDict = {};

  type = {};

  actions = {};

  sources = {};

  loaders = [];

  hub = createHub();

  constructor({ connectSource }) {
    this.connectSource = connectSource;
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
          const source = selector(this.source);
          connectHoc = this.connectSource(source, {
            slice: selector,
            enableErrorLogger,
          });
          mapStateToPropsQueue.push(connectHoc.mapStateToProps);
          result = connectHoc(result);
        });
      }
      return result;
    };
  }

  handle(sliceKey, maybeSource, ...args) {
    let hubResult;
    if (
      maybeSource &&
      typeof maybeSource === 'object' &&
      maybeSource.reducerMap &&
      maybeSource.initialState &&
      maybeSource.actions
    ) {
      hubResult = this.hub
        .handle(
          {
            ...maybeSource.reducerMap,
          },
          {
            ...maybeSource.initialState,
          },
        )
        .mergeActions(maybeSource.actions);
      if (!this.sources[sliceKey]) {
        this.sources[sliceKey] = {};
      }
      this.sources[sliceKey][maybeSource.stateName] = maybeSource;
    } else {
      hubResult = this.hub.handle(maybeSource, ...args);
    }
    this.reducers[sliceKey] = hubResult.reducer;
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
