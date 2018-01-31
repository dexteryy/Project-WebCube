import React, { Component } from 'react';
import { withRouter as withRouterMeta } from 'react-router';
import localforage from 'localforage';
import withPersist from 'redux-cube-with-persist';
import { createApp } from 'redux-cube';

import { reducer as starWarsInfoReducer } from './ducks/starWarsInfo';
import StarWarsInfo from './containers/StarWarsInfo';

@withRouterMeta
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
    const { location: { pathname } } = this.props;
    return <StarWarsInfo isEnabled={pathname === '/plain'} />;
  }
}

export const App = PlainObjectStoreApp;
