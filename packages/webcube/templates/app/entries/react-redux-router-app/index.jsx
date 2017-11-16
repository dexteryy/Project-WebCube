import React, { PureComponent } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import withRouter from 'redux-cube/lib/plugins/withRouter';
import { createApp } from 'redux-cube';
import { withScripts } from 'webcube';
import googleAnalytics from 'webcube/boilerplate/external/googleAnalytics';

import { isDynamicUrl } from './common/utils';
import { App as SampleApp } from './sample';

@withScripts(
  googleAnalytics({
    // googleAnalyticsTrackingId: '',
    // googleAnalyticsInit(ga) {},
  }),
)
@createApp(
  withRouter({
    supportHtml5History: isDynamicUrl(),
    devToolsOptions: { name: '{{pascalCase entryName}}' },
  }),
)
class {{pascalCase entryName}} extends PureComponent {
  render() {
    const {
      // scripts,
      Router,
    } = this.props;
    const toSample = () => <Redirect to="/sample" />;
    return (
      <Router>
        <Switch>
          <Route path="/" exact={true} render={toSample} />
          <Route path="/sample" component={SampleApp} />
        </Switch>
      </Router>
    );
  }
}

export const App = {{pascalCase entryName}};
