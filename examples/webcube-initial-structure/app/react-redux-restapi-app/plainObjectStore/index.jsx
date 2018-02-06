import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import localforage from 'localforage';
import withPersist from 'redux-cube-with-persist';
import { createApp } from 'redux-cube';

import { reducer as starWarsReducer } from './ducks/starWars';
import { reducer as shopsReducer } from './ducks/shops';
import Info from './containers/Info';

@createApp(
  withPersist({
    reducers: {
      starWars: starWarsReducer,
      shops: shopsReducer,
    },
    preloadedState: typeof window !== 'undefined' && window._preloadInfoData,
    devToolsOptions: { name: 'PlainObjectStoreApp' },
    persistStorage: localforage,
    persistKey: 'plainObjectStoreRoot',
  }),
)
class PlainObjectStoreApp extends Component {
  render() {
    return <Route path="/plain" component={Info} />;
  }
}

export const App = PlainObjectStoreApp;
