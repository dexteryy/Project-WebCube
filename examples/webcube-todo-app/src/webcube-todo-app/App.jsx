import React from 'react';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';
import Helmet from 'react-helmet';
import localforage from 'localforage';
import withScripts, { googleAnalytics } from 'react-with-scripts';
import { errorBoundary } from 'react-common-kit';
import withPersist from 'redux-cube-with-persist';
import withRouter from 'redux-cube-with-router';

import { isDynamicUrl } from './utils';
import Endnote from './components/Endnote';
import Layout from './containers/Layout';
import './ducks/todo';
import cube from './cube';

function App() {
  return (
    <div>
      <Helmet titleTemplate="%s - Webcube's TodoMVC Example">
        <title>Todo App</title>
      </Helmet>
      <Layout title="Todo App" />
      <Endnote />
    </div>
  );
}

export default App
  |> cube.createApp({
    plugins: [withRouter, withPersist],
    supportHtml5History: isDynamicUrl(),
    persistStorage: localforage,
    persistKey: 'todoAppRoot',
  })
  |> withScripts(
    googleAnalytics({
      googleAnalyticsTrackingId: 'UA-404086-14',
    }),
  )
  |> errorBoundary();
