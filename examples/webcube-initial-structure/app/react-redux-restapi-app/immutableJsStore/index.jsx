import React, { Component } from 'react';
import { withRouter as withRouterMeta } from 'react-router';
// import localforage from 'localforage';
import withImmutable from 'redux-cube-with-immutable';
// import withPersist from 'redux-cube-with-persist';
import { createApp } from 'redux-cube';

import { reducer as starWarsInfoReducer } from './ducks/starWarsInfo';
import StarWarsInfo from './containers/StarWarsInfo';

@withRouterMeta
@createApp(
  withImmutable(
    // withPersist(
    {
      reducers: {
        starWarsInfo: starWarsInfoReducer,
      },
      preloadedState:
        typeof window !== 'undefined' && window._preloadStarWarsData,
      devToolsOptions: { name: 'ImmutableJsStoreApp' },
      // persistStorage: localforage,
      // persistKey: 'immutableJsStoreRoot',
    },
    // ),
  ),
)
class ImmutableJsStoreApp extends Component {
  render() {
    const { location: { pathname } } = this.props;
    return <StarWarsInfo isEnabled={pathname === '/immutable'} />;
  }
}

export const App = ImmutableJsStoreApp;
