import React from 'react';
import { Route } from 'react-router';
import App from './main/containers/App';

export default (
  <Route
    path={!/localhost/.test(location.hostname) ? 'react-router-app/' : '/'}
    component={App}
  />
);
