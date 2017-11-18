import React, { Component } from 'react';
import {
  BrowserRouter,
  HashRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { withScripts } from 'webcube';
import googleTagManager from 'webcube/boilerplate/external/googleTagManager';

import { isDynamicUrl } from './common/utils';
import { App as SampleApp } from './sample';

const Router = isDynamicUrl() ? BrowserRouter : HashRouter;

@withScripts(
  googleTagManager({
    googleTagManagerContainerId: 'UA-81044026-3',
  }),
)
class ReactRouterApp extends Component {
  render() {
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

export const App = ReactRouterApp;
