import React, { Component } from 'react';
import { Route, Redirect, NavLink } from 'react-router-dom';
import withScripts from 'react-with-scripts';
import googleAnalytics from 'react-with-scripts/vendors/googleAnalytics';
import withRouter from 'redux-cube-with-router';
import { createApp } from 'redux-cube';

import * as styles from '../common/styles/head.scss';
import { isDynamicUrl } from '../common/utils';
import { App as PlainObjectStoreApp } from '../plainObjectStore';
import { App as ImmutableJsStoreApp } from '../immutableJsStore';

const toPlain = () => <Redirect to="/plain" />;

@withScripts(
  googleAnalytics({
    googleAnalyticsTrackingId: 'UA-404086-14',
  }),
)
@createApp(
  withRouter({
    supportHtml5History: isDynamicUrl(),
    devToolsOptions: { name: 'ReactReduxRestapiApp' },
  }),
)
class ReactReduxRestapiApp extends Component {
  render() {
    return (
      <div>
        <nav className={styles.nav}>
          <ul>
            <li>
              <NavLink to={`/plain`} activeClassName={styles.selected}>
                Plain Object Store
              </NavLink>
            </li>
            <li>
              <NavLink to={`/immutable`} activeClassName={styles.selected}>
                Immutable.js Store
              </NavLink>
            </li>
          </ul>
        </nav>
        <Route path="/" exact={true} render={toPlain} />
        <PlainObjectStoreApp />
        <ImmutableJsStoreApp />
      </div>
    );
  }
}

export const App = ReactReduxRestapiApp;
