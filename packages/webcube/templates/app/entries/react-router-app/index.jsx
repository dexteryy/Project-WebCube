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

// @withScripts(
//   googleTagManager({
//     googleTagManagerContainerId: '',
//   }),
// )
class {{pascalCase entryName}} extends Component {
  render() {
    const toSample = () => <Redirect to="/sample" />;
    return (
      <Switch>
        <Route path="/" exact={true} render={toSample} />
        <Route path="/sample" component={SampleApp} />
      </Switch>
    );
  }
}

export const App = {{pascalCase entryName}};
