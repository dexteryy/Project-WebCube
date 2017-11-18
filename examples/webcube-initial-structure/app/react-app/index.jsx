import React, { Component } from 'react';
import { withScripts } from 'webcube';
import googleTagManager from 'webcube/boilerplate/external/googleTagManager';

import { App as SampleApp } from './sample';

@withScripts(
  googleTagManager({
    googleTagManagerContainerId: 'UA-81044026-3',
  }),
)
class ReactReduxApp extends Component {
  render() {
    // const { scripts } = this.props;
    return (
      <div>
        <SampleApp />
      </div>
    );
  }
}

export const App = ReactReduxApp;
