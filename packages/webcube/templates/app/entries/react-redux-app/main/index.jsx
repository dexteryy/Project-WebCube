import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { createApp } from 'redux-cube';
import { errorBoundary } from 'react-common-kit';
import withScripts, { googleAnalytics } from 'react-with-scripts';

import { App as SampleApp } from '../sample';
import { reducer as renameMeReducer } from './ducks/renameMe';
import Layout from './containers/Layout';

@errorBoundary()
@withScripts(
  googleAnalytics({
    googleAnalyticsTrackingId: '', // @TODO
  }),
)
@createApp({
  reducers: {
    renameMe: renameMeReducer,
  },
  devToolsOptions: { name: '{{pascalCase entryName}}' },
})
class {{pascalCase entryName}} extends Component {
  render() {
    return (
      <Layout>
        <SampleApp />
      </Layout>
    );
  }
}

export const App = {{pascalCase entryName}};
