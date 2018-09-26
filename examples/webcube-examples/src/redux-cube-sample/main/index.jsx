import React from 'react';
import { ErrorBoundary } from 'react-common-kit';
import withScripts, { googleAnalytics } from 'react-with-scripts';

import Sample from '../sample';
import cube from './cube';
import './ducks/renameMe';
import Layout from './containers/Layout';

function ReactReduxApp() {
  return (
    <Layout>
      <Sample />
    </Layout>
  );
}

export default ReactReduxApp
  |> cube.createApp({
    devToolsOptions: { name: 'ReactReduxApp' },
    ErrorBoundary,
  })
  |> withScripts(
    googleAnalytics({
      googleAnalyticsTrackingId: 'UA-404086-14',
    }),
  );
