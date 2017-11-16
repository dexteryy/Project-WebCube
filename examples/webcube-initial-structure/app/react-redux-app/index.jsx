import React, { PureComponent } from 'react';
import { withScripts } from 'webcube';
import googleAnalytics from 'webcube/boilerplate/external/googleAnalytics';

import { App as SampleApp } from './sample';

@withScripts(
  googleAnalytics({
    // googleAnalyticsTrackingId: '',
    // googleAnalyticsInit(ga) {},
  }),
)
class ReactReduxApp extends PureComponent {
  render() {
    // const { scripts } = this.props;
    return (
      <div>
        <SampleApp />
      </div>
    );
  }
}

export const App = ReactReduxApp;
