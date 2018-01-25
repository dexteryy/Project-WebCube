import React, { Component } from 'react';
import localforage from 'localforage';
import { createApp } from 'redux-cube';
import withPersist from 'redux-cube/lib/plugins/withPersist';

import { reducer as starWarsInfoReducer } from './ducks/starWarsInfo';
import StarWarsInfo from './containers/StarWarsInfo';

@createApp(
  withPersist({
    reducers: {
      starWarsInfo: starWarsInfoReducer,
    },
    preloadedState:
      typeof window !== 'undefined' && window._preloadStarWarsData,
    devToolsOptions: { name: 'PlainObjectStoreApp' },
    persistStorage: localforage,
    persistKey: 'plainObjectStoreRoot',
  }),
)
class PlainObjectStoreApp extends Component {
  render() {
    return <StarWarsInfo />;
  }
}

export const App = PlainObjectStoreApp;
