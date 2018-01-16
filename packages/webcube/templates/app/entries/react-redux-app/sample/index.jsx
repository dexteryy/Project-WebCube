import React, { Component } from 'react';
import localforage from 'localforage';
import withPersist from 'redux-cube/lib/plugins/withPersist';
import { createApp } from 'redux-cube';

import { reducer as sampleReducer, epics } from './ducks/sample';
import Sample from './containers/Sample';

@createApp(
  withPersist({
    reducers: {
      items: sampleReducer,
    },
    epics,
    preloadedState: typeof window !== 'undefined' && window._preloadSampleData,
    devToolsOptions: { name: 'SampleApp' },
    persistStorage: localforage,
    persistKey: 'sampleRoot1',
  })
)
class SampleApp extends Component {
  render() {
    return <Sample />;
  }
}

export const App = SampleApp;
