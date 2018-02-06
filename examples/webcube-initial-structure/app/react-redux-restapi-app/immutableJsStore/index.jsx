import React, { Component } from 'react';
import { Route } from 'react-router-dom';
// import localforage from 'localforage';
import withImmutable from 'redux-cube-with-immutable';
// import withPersist from 'redux-cube-with-persist';
import { createApp } from 'redux-cube';

import { reducer as starWarsReducer } from './ducks/starWars';
import { reducer as shopsReducer } from './ducks/shops';
import Info from './containers/Info';

@createApp(
  withImmutable(
    // withPersist(
    {
      reducers: {
        starWars: starWarsReducer,
        shops: shopsReducer,
      },
      preloadedState: typeof window !== 'undefined' && window._preloadInfoData,
      devToolsOptions: { name: 'ImmutableJsStoreApp' },
      // persistStorage: localforage,
      // persistKey: 'immutableJsStoreRoot',
    },
    // ),
  ),
)
class ImmutableJsStoreApp extends Component {
  render() {
    return <Route path="/immutable" component={Info} />;
  }
}

export const App = ImmutableJsStoreApp;
