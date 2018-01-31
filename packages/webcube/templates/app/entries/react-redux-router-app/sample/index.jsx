import React, { Component } from 'react';
import { withRouter as withRouterMeta } from 'react-router';
import localforage from 'localforage';
import withPersist from 'redux-cube-with-persist';
import { createApp } from 'redux-cube';

import { reducer as sampleReducer, epics } from './ducks/sample';
import Sample from './containers/Sample';

@withRouterMeta
@createApp(
  withPersist({
    reducers: {
      items: sampleReducer,
    },
    epics,
    preloadedState: typeof window !== 'undefined' && window._preloadSampleData,
    devToolsOptions: { name: 'SampleApp' },
    persistStorage: localforage,
    persistKey: 'sampleRoot2',
  })
)
class SampleApp extends Component {
  render() {
    return <Sample />;
  }
}

export const App = SampleApp;
