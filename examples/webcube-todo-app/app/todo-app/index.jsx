import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import withRouter from 'redux-cube/lib/plugins/withRouter';
import { createApp } from 'redux-cube';
import { withScripts } from 'webcube';
import googleAnalytics from 'webcube/boilerplate/external/googleAnalytics';

import { isDynamicUrl } from './common/utils';
import { App as TodoApp } from './main';
import Endnote from './common/components/Endnote';

@withScripts(
  googleAnalytics({
    /* googleAnalyticsTrackingId: '', */
    /* googleAnalyticsInit(ga) {}, */
  }),
)
@createApp(
  withRouter({
    supportHtml5History: isDynamicUrl(),
    devToolsOptions: { name: 'EntryApp' },
  }),
)
class EntryApp extends PureComponent {
  render() {
    const {
      /* scripts, */
      Router,
    } = this.props;
    return (
      <Router>
        <div>
          <Helmet
            title="Todo App - Webcube's TodoMVC Example"
            meta={[{ name: 'description', content: '' }]}
          />
          <TodoApp title="Todo App" />
          <Endnote />
        </div>
      </Router>
    );
  }
}

export const App = EntryApp;
