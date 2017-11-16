import React, { PureComponent } from 'react';
import {
  BrowserRouter,
  HashRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { withScripts } from 'webcube';
import googleAnalytics from 'webcube/boilerplate/external/googleAnalytics';

import { isDynamicUrl } from './common/utils';
import { App as SampleApp } from './sample';

const Router = isDynamicUrl() ? BrowserRouter : HashRouter;

@withScripts(
  googleAnalytics({
    // googleAnalyticsTrackingId: '',
    // googleAnalyticsInit(ga) {},
  }),
)
class {{pascalCase entryName}} extends PureComponent {
  render() {
    // const { scripts } = this.props;
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
