import React from 'react';
import { Route } from 'react-router-dom';
import localforage from 'localforage';
import withPersist from 'redux-cube-with-persist';

import cube from './cube';
import './ducks/starWars';
import './ducks/shops';
import Info from './containers/Info';

function PlainObjectStoreApp() {
  return <Route path="/plain" component={Info} />;
}

export default PlainObjectStoreApp
  |> cube.createApp({
    plugins: [withPersist],
    devToolsOptions: { name: 'PlainObjectStoreApp' },
    persistStorage: localforage,
    persistKey: 'plainObjectStoreRoot',
  });
