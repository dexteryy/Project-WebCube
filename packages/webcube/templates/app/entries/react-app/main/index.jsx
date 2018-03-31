import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import withScripts from 'react-with-scripts';
import googleAnalytics from 'react-with-scripts/vendors/googleAnalytics';

import { App as SampleApp } from '../sample';

class {{pascalCase entryName}} extends Component {
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
    googleAnalyticsTrackingId: '', // @TODO
  }),
)({{pascalCase entryName}});
