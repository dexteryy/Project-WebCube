import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import withRouter from 'redux-cube/lib/plugins/withRouter';
import { createApp } from 'redux-cube';
import { withScripts } from 'webcube';
import googleTagManager from 'webcube/boilerplate/external/googleTagManager';

import { isDynamicUrl } from './common/utils';
import { App as SampleApp } from './sample';

// @withScripts(
//   googleTagManager({
//     googleTagManagerContainerId: '',
//   }),
// )
@createApp(
  withRouter({
    supportHtml5History: isDynamicUrl(),
    devToolsOptions: { name: '{{pascalCase entryName}}' },
  }),
)
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
