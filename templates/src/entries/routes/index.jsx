
import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import App from '../containers/App';
import Home from '../containers/Home';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="home" />
    <Route path="home" component={Home} />
  </Route>
);
