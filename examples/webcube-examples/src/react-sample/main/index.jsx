import React from 'react';
import { errorBoundary } from 'react-common-kit';
import withScripts, { googleAnalytics } from 'react-with-scripts';

import Sample from '../sample';

function ReactApp() {
  return <Sample />;
}

export default ReactApp
  |> withScripts(
    googleAnalytics({
      googleAnalyticsTrackingId: 'UA-404086-14',
    }),
  )
  |> errorBoundary();
