import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {
  BrowserRouter,
  HashRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { errorBoundary } from 'react-common-kit';
import withScripts, { googleAnalytics } from 'react-with-scripts';

import { isDynamicUrl } from '../common/utils';
import { App as SampleApp } from '../sample';

const Router = isDynamicUrl() ? BrowserRouter : HashRouter;

const toSample = () => <Redirect to="/sample" />;

@errorBoundary()
@withScripts(
  googleAnalytics({
    googleAnalyticsTrackingId: 'UA-404086-14',
  }),
)
class ReactRouterApp extends Component {
  render() {
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

export const App = ReactRouterApp;
