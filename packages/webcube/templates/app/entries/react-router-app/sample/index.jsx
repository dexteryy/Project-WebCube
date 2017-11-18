import React, { Component } from 'react';
import { withRouter as withRouterMeta } from 'react-router';
import Sample from './containers/Sample';

@withRouterMeta
class SampleApp extends Component {
  state = {};

  render() {
    return <Sample />;
  }
}

export const App = SampleApp;
