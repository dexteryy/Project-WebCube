import React, { PureComponent } from 'react';
import Sample from './containers/Sample';

class SampleApp extends PureComponent {
  state = {};

  render() {
    return <Sample />;
  }
}

export const App = SampleApp;
