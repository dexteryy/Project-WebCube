import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { errorBoundary } from 'react-common-kit';
import withScripts, { googleAnalytics } from 'react-with-scripts';

import { App as SampleApp } from '../sample';

@errorBoundary()
@withScripts(
  googleAnalytics({
    googleAnalyticsTrackingId: 'UA-404086-14',
  }),
)
class ReactApp extends Component {
  render() {
    return (
      <div>
        <SampleApp />
      </div>
    );
  }
}

export const App = ReactApp;
