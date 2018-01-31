import React, { Component } from 'react';
import Helmet from 'react-helmet';
import withRouter from 'redux-cube-with-router';
import { createApp } from 'redux-cube';
import { withScripts } from 'webcube';
import googleTagManager from 'webcube/boilerplate/external/googleTagManager';

import { isDynamicUrl } from './common/utils';
import { App as TodoApp } from './main';
import Endnote from './common/components/Endnote';

@withScripts(
  googleTagManager({
    googleTagManagerContainerId: 'UA-81044026-3',
  }),
)
@createApp(
  withRouter({
    supportHtml5History: isDynamicUrl(),
    devToolsOptions: { name: 'EntryApp' },
  }),
)
class EntryApp extends Component {
  render() {
    return (
      <div>
        <Helmet
          title="Todo App - Webcube's TodoMVC Example"
          meta={[{ name: 'description', content: '' }]}
        />
        <TodoApp title="Todo App" />
        <Endnote />
      </div>
    );
  }
}

export const App = EntryApp;
