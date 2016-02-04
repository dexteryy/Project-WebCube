/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import AppView from './AppView';

type UserOptions = {
  root: HTMLElement;
};

type AppOptions = {
  root?: HTMLElement;
};

class App {

  opt: AppOptions = {

  };

  init(userOpt: UserOptions) {
    Object.assign(this.opt, userOpt);
    if (!this.opt.root) {
      return;
    }
    ReactDOM.render(React.createElement(AppView, {

    }), this.opt.root);
  }

}

export default App;
