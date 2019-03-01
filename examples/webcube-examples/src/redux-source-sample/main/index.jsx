import React from 'react';
import { Route, Redirect, NavLink } from 'react-router-dom';
import { ErrorBoundary } from 'react-common-kit';
import withScripts, { googleAnalytics } from 'react-with-scripts';
import withRouter from 'redux-cube-with-router';

import { createCube } from 'redux-cube';
import * as styles from '../common/styles/head.scss';
import { isDynamicUrl } from '../common/utils';
import PlainObjectStoreApp from '../plainObjectStore';
// import ImmutableJsStoreApp from '../immutableJsStore';

const cube = createCube();

const toPlain = () => <Redirect to="/plain" />;

function ReactReduxRestapiApp() {
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
              Immutable.js Store (Unavailable Now)
            </NavLink>
          </li>
        </ul>
      </nav>
      <Route path="/" exact={true} render={toPlain} />
      <PlainObjectStoreApp />
      {/* <ImmutableJsStoreApp /> */}
    </div>
  );
}

export default ReactReduxRestapiApp
  |> cube.createApp({
    plugins: [withRouter],
    supportHtml5History: isDynamicUrl(),
    devToolsOptions: { name: 'ReactReduxRestapiApp' },
    ErrorBoundary,
  })
  |> withScripts(
    googleAnalytics({
      googleAnalyticsTrackingId: 'UA-404086-14',
    }),
  );
