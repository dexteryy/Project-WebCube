/* @flow */

import './deploy.scss';
import App from '../../';

const url = String(require('data/test.json'));
const app = new App();

window.onload = function () {
  app.init({
    root: document.getElementById('welcome'),
    msg: 'This is a demo',
  });
  app.getData(url, (res) => {
    console.info(res);
  });
};
