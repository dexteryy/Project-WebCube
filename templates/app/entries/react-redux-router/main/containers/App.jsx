
import React, { PureComponent } from 'react';
import Home from './Home';

export default class App extends PureComponent {

  render() {
    return (
      <div
        id="{{camelCase entryName}}Root">
        <Home />
      </div>
    );
  }

}
