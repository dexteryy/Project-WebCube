import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Route, Redirect, Switch } from 'react-router-dom';
import withScripts, { googleAnalytics } from 'react-with-scripts';
import { errorBoundary } from 'react-common-kit';
import withRouter from 'redux-cube-with-router';
import { createApp } from 'redux-cube';

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

@errorBoundary()
@withScripts(
  googleAnalytics({
    googleAnalyticsTrackingId: 'UA-404086-14',
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
      <Switch>
        <Route path="/" exact={true} render={JumpToDefault} />
        <Route path="/" render={TodoApps} />
      </Switch>
    );
  }
}

export const App = EntryApp;
