/* @flow */

import './index.scss';
import ReactDOM from 'react-dom';
import AppView from './AppView';

type UserOptions = {
  root: HTMLElement;
  msg?: string;
  bgColor?: string;
};

type AppOptions = {
  root?: HTMLElement;
  msg: string;
  bgColor?: string;
};

class App {

  opt: AppOptions = {
    msg: 'For configuring',
  };

  init(userOpt: UserOptions) {
    Object.assign(this.opt, userOpt);
    if (!this.opt.root) {
      return;
    }
    ReactDOM.render(new AppView({
      message: this.opt.msg,
    }), this.opt.root);
  }

  getData(url: string, cb: Function) {
    // demo
    fetch(url).then((res) => {
      cb(res);
    });
  }

}

export default App;
