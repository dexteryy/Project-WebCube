import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Route, Redirect, Switch } from 'react-router-dom';
import withRouter from 'redux-cube/lib/plugins/withRouter';
import { createApp } from 'redux-cube';
import { withScripts } from 'webcube';
import googleTagManager from 'webcube/boilerplate/external/googleTagManager';

import { isDynamicUrl } from '../todo-app/common/utils';
import { App as TodoApp } from '../todo-app/main';
import Endnote from '../todo-app/common/components/Endnote';

const JediTodoApp = () => (
  <TodoApp
    title="Jedi Todo"
    routePath="/jedi-todo"
    appConfig={{
      persistKey: 'jediTodoRoot',
      devToolsOptions: { name: 'JediTodoApp' },
      preloadedState:
        typeof window !== 'undefined' && window._preloadJediTodoData,
    }}
  />
);
const SithTodoApp = () => (
  <TodoApp
    title="Sith Todo"
    routePath="/sith-todo"
    appConfig={{
      persistKey: 'sithTodoRoot',
      devToolsOptions: { name: 'SithTodoApp' },
      preloadedState:
        typeof window !== 'undefined' && window._preloadSithTodoData,
    }}
  />
);

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
    const TodoApps = () => (
      <div>
        <Helmet
          title="Multiple Todo Apps - Webcube's TodoMVC Example"
          meta={[{ name: 'description', content: '' }]}
        />
        <JediTodoApp />
        <SithTodoApp />
        <Endnote />
      </div>
    );
    const JumpToDefault = () => <Redirect to="jedi-todo/" />;
    return (
      <Switch>
        <Route path="/" exact={true} render={JumpToDefault} />
        <Route path="/" render={TodoApps} />
      </Switch>
    );
  }
}

export const App = EntryApp;
