import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import localforage from 'localforage';
import withPersist from 'redux-cube-with-persist';
import { createApp } from 'redux-cube';

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
    return <Route path="/plain" component={StarWarsInfo} />;
  }
}

export const App = PlainObjectStoreApp;
