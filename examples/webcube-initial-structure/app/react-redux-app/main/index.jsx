import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { errorBoundary } from 'react-common-kit';
import withScripts, { googleAnalytics } from 'react-with-scripts';
import { createApp } from 'redux-cube';

import { App as SampleApp } from '../sample';
import { reducer as renameMeReducer } from './ducks/renameMe';
import Layout from './containers/Layout';

@errorBoundary()
@withScripts(
  googleAnalytics({
    googleAnalyticsTrackingId: 'UA-404086-14',
  }),
)
@createApp({
  reducers: {
    renameMe: renameMeReducer,
  },
  devToolsOptions: { name: 'ReactReduxApp' },
})
class ReactReduxApp extends Component {
  render() {
    return (
      <Layout>
        <SampleApp />
      </Layout>
    );
  }
}

export const App = ReactReduxApp;
