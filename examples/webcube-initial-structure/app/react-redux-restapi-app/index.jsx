import React, { Component } from 'react';
import { withScripts } from 'webcube';
import googleTagManager from 'webcube/boilerplate/external/googleTagManager';

import { App as PlainObjectStoreApp } from './plainObjectStore';

@withScripts(
  googleTagManager({
    googleTagManagerContainerId: 'UA-81044026-3',
  }),
)
class ReactReduxRestapiApp extends Component {
  render() {
    return <PlainObjectStoreApp />;
  }
}

export const App = ReactReduxRestapiApp;
