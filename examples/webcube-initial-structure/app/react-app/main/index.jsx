import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import withScripts, { googleAnalytics } from 'react-with-scripts';

import { App as SampleApp } from '../sample';

class ReactApp extends Component {
  static childContextTypes = {};

  /* eslint-disable class-methods-use-this */
  getChildContext() {
    return {};
  }

  /* eslint-enable class-methods-use-this */

  render() {
    return (
      <div>
        <SampleApp />
      </div>
    );
  }
}

export const App = withScripts(
  googleAnalytics({
    googleAnalyticsTrackingId: 'UA-404086-14',
  }),
)(ReactApp);
