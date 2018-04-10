import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { errorBoundary } from 'react-common-kit';
import withScripts, { googleAnalytics } from 'react-with-scripts';

import { App as SampleApp } from '../sample';

@errorBoundary()
@withScripts(
  googleAnalytics({
    googleAnalyticsTrackingId: '', // @TODO
  }),
)
class {{pascalCase entryName}} extends Component {
  render() {
    return (
      <div>
        <SampleApp />
      </div>
    );
  }
}

export const App = {{pascalCase entryName}};
