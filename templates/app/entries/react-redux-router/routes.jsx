
import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import App from './main/containers/App';
import Home from './main/containers/Home';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="home" />
    <Route path="home" component={Home} />
  </Route>
);
