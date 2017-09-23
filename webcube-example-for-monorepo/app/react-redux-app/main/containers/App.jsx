import React, { PureComponent } from 'react';
import Home from './Home';

export default class App extends PureComponent {
  componentWillMount() {
    //
  }

  componentWillUpdate() {
    //
  }
  render() {
    return (
      <div id="reactReduxAppRoot">
        <Home />
      </div>
    );
  }
}
