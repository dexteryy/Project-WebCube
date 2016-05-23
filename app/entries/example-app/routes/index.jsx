
import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import App from '../containers/App';
import EffectPane from '../containers/EffectPane';
import JobPane from '../containers/JobPane';
import ErrorPane from '../containers/ErrorPane';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="pane/effects" />
    <Route path="pane/effects" component={EffectPane} />
    <Route path="pane/jobs" component={JobPane} />
    <Route path="pane/*" component={ErrorPane} />
  </Route>
);
