import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import withRouter from 'redux-cube-withrouter';
import { createApp } from 'redux-cube';
import { withScripts } from 'webcube';
import googleTagManager from 'webcube/boilerplate/external/googleTagManager';

import { isDynamicUrl } from './common/utils';
import { App as SampleApp } from './sample';

const toSample = () => <Redirect to="/sample" />;

@withScripts(
  googleTagManager({
    googleTagManagerContainerId: 'UA-81044026-3',
  }),
)
@createApp(
  withRouter({
    supportHtml5History: isDynamicUrl(),
    devToolsOptions: { name: 'ReactReduxRouterApp' },
  }),
)
class ReactReduxRouterApp extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact={true} render={toSample} />
        <Route path="/sample" component={SampleApp} />
      </Switch>
    );
  }
}

export const App = ReactReduxRouterApp;
