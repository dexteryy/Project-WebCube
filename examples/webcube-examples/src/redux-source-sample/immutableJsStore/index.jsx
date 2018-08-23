import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import withImmutable from 'redux-cube-with-immutable';
// import localforage from 'localforage';
// import withPersist from 'redux-cube-with-persist';
import { createApp } from 'redux-cube';

import { reducer as starWarsReducer } from './ducks/starWars';
import { reducer as shopsReducer } from './ducks/shops';
import Info from './containers/Info';

@createApp(
  {
    plugins: [
      withImmutable,
      //  withPersist,
    ],
    reducers: {
      starWars: starWarsReducer,
      shops: shopsReducer,
    },
    devToolsOptions: { name: 'ImmutableJsStoreApp' },
    // persistStorage: localforage,
    // persistKey: 'immutableJsStoreRoot',
  },
  // ),
)
export default class ImmutableJsStore extends Component {
  render() {
    return <Route path="/immutable" component={Info} />;
  }
}
