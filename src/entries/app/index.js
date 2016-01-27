/* @flow */

import './index.scss';
import ReactDOM from 'react-dom';
import AppView from './AppView';

type UserOptions = {
  msg?: string;
  bgColor?: string;
};

type AppOptions = {
  msg: string;
  bgColor?: string;
};

class App {

  opt: AppOptions = {
    msg: 'For configuring',
  };

  init(userOpt: UserOptions) {
    Object.assign(this.opt, userOpt);
    ReactDOM.render(new AppView({
      message: this.opt.msg,
    }), document.getElementById('welcome'));
  }

  getData(url: string) {
    // demo
    fetch(url).then((res) => {
      console.info(res);
    });
  }

}

export default App;
