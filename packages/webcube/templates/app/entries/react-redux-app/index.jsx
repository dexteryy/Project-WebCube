import React, { Component } from 'react';
// import { withScripts } from 'webcube';
// import googleTagManager from 'webcube/boilerplate/external/googleTagManager';

import { App as SampleApp } from './sample';

// @withScripts(
//   googleTagManager({
//     googleTagManagerContainerId: '',
//   }),
// )
class {{pascalCase entryName}} extends Component {
  render() {
    return (
      <div>
        <SampleApp />
      </div>
    );
  }
}

export const App = {{pascalCase entryName}};
