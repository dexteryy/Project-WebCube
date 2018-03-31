import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import withScripts from 'react-with-scripts';
import googleAnalytics from 'react-with-scripts/vendors/googleAnalytics';
import { createApp } from 'redux-cube';

import { App as SampleApp } from '../sample';
import { reducer as renameMeReducer } from './ducks/renameMe';
import Layout from './containers/Layout';

class ReactReduxApp extends Component {
  static childContextTypes = {};

  /* eslint-disable class-methods-use-this */
  getChildContext() {
    return {};
  }

  /* eslint-enable class-methods-use-this */

  render() {
    return (
      <Layout>
        <SampleApp />
      </Layout>
    );
  }
}

export const App = withScripts(
  googleAnalytics({
    googleAnalyticsTrackingId: 'UA-404086-14',
  }),
)(
  createApp({
    reducers: {
      renameMe: renameMeReducer,
    },
    devToolsOptions: { name: 'ReactReduxApp' },
  })(ReactReduxApp),
);
