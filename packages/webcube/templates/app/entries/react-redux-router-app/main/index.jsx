import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
// import PropTypes from 'prop-types';
import withRouter from 'redux-cube-with-router';
import { createApp } from 'redux-cube';
import { errorBoundary } from 'react-common-kit';
import withScripts, { googleAnalytics } from 'react-with-scripts';

import { isDynamicUrl } from '../common/utils';
import { App as SampleApp } from '../sample';
import { reducer as renameMeReducer } from './ducks/renameMe';
import Layout from './containers/Layout';

const toSample = () => <Redirect to="/sample" />;

@errorBoundary()
@withScripts(
  googleAnalytics({
    googleAnalyticsTrackingId: '', // @TODO
  }),
)
@createApp(
  withRouter({
    reducers: {
      renameMe: renameMeReducer,
    },
    supportHtml5History: isDynamicUrl(),
    devToolsOptions: { name: '{{pascalCase entryName}}' },
  }),
)
class {{pascalCase entryName}} extends Component {
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

export const App = {{pascalCase entryName}};
