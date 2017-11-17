import React, { PureComponent } from 'react';
import { withRouter as withRouterMeta } from 'react-router';
import localforage from 'localforage';
import withPersist from 'redux-cube/lib/plugins/withPersist';
import { createApp } from 'redux-cube';

import { reducer as todoReducer } from './reducers/todo';
import Main from './containers/Main';

@withRouterMeta
@createApp(
  withPersist({
    reducers: {
      todo: todoReducer,
    },
    persistStorage: localforage,
    persistKey: 'todoAppRoot',
    devToolsOptions: { name: 'TodoApp' },
    preloadedState: typeof window !== 'undefined' && window._preloadTodoData,
    enableDynamicConfig: true,
  }),
)
class TodoApp extends PureComponent {
  render() {
    return <Main {...this.props} />;
  }
}

export const App = TodoApp;
