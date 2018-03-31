import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
// import PropTypes from 'prop-types';
import withScripts from 'react-with-scripts';
import googleAnalytics from 'react-with-scripts/vendors/googleAnalytics';
import withRouter from 'redux-cube-with-router';
import { createApp } from 'redux-cube';

import { isDynamicUrl } from '../common/utils';
import { App as SampleApp } from '../sample';
import { reducer as renameMeReducer } from './ducks/renameMe';
import Layout from './containers/Layout';

const toSample = () => <Redirect to="/sample" />;

class ReactReduxRouterApp extends Component {
  static childContextTypes = {};

  /* eslint-disable class-methods-use-this */
  getChildContext() {
    return {};
  }

  /* eslint-enable class-methods-use-this */

  render() {
    return (
      <Layout>
        <Switch>
          <Route path="/" exact={true} render={toSample} />
          <Route path="/sample" component={SampleApp} />
        </Switch>
      </Layout>
    );
  }
}

export const App = withScripts(
  googleAnalytics({
    googleAnalyticsTrackingId: 'UA-404086-14',
  }),
)(
  createApp(
    withRouter({
      reducers: {
        renameMe: renameMeReducer,
      },
      supportHtml5History: isDynamicUrl(),
      devToolsOptions: { name: 'ReactReduxRouterApp' },
    }),
  )(ReactReduxRouterApp),
);
