import React, { PureComponent } from 'react';
import { withRouter as withRouterMeta } from 'react-router';
import Sample from './containers/Sample';

@withRouterMeta
class SampleApp extends PureComponent {
  state = {};

  render() {
    return <Sample {...this.props} />;
  }
}

export const App = SampleApp;
