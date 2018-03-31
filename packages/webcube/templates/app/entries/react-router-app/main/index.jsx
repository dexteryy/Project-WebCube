import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {
  BrowserRouter,
  HashRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import withScripts from 'react-with-scripts';
import googleAnalytics from 'react-with-scripts/vendors/googleAnalytics';

import { isDynamicUrl } from '../common/utils';
import { App as SampleApp } from '../sample';

const Router = isDynamicUrl() ? BrowserRouter : HashRouter;

const toSample = () => <Redirect to="/sample" />;

class {{pascalCase entryName}} extends Component {
  static childContextTypes = {};

  /* eslint-disable class-methods-use-this */
  getChildContext() {
    return {};
  }

  /* eslint-enable class-methods-use-this */

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

export const App = withScripts(
  googleAnalytics({
    googleAnalyticsTrackingId: '', // @TODO
  }),
)({{pascalCase entryName}});
