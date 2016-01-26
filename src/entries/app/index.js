
import './index.scss';
import defaults from 'lodash/defaults';
import ReactDOM from 'react-dom';
import AppView from './AppView';

class App {

  init(opt) {
    defaults(opt, {
      msg: 'For configuring',
    });
    ReactDOM.render(new AppView({
      message: opt.msg,
    }), document.getElementById('welcome'));
  }

  getData(url) {
    // demo
    fetch(url).then((res) => {
      console.info(res);
    });
  }

}

export default App;
