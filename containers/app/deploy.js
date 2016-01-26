
import './deploy.scss';
import App from '../../';

const url = String(require('data/test.json'));
const app = new App();

window.onload = function () {
  app.init({
    msg: 'This is a demo',
  });
  app.getData(url);
};
