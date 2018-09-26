import React from 'react';
import { ErrorBoundary } from 'react-common-kit';
import withScripts, { googleAnalytics } from 'react-with-scripts';

import Sample from '../sample';

function ReactApp() {
  return (
    <ErrorBoundary>
      <Sample />
    </ErrorBoundary>
  );
}

export default ReactApp
  |> withScripts(
    googleAnalytics({
      googleAnalyticsTrackingId: 'UA-404086-14',
    }),
  );
