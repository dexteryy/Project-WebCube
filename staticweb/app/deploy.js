/* @flow */

import 'normalize.css';
import './deploy.scss';
import App from '../../';
// or import App from 'src/entries/app';

const app = new App();
const url = String(require('data/test.json'));

export default function run() {
  app.init({
    root: document.getElementById('root'),
    msg: 'This is a demo',
  });
  app.getData(url, (res) => {
    console.info(res);
  });
}

if (['complete', 'loaded', 'interactive'].includes(document.readyState)
    && document.body) {
  run();
} else {
  document.addEventListener('DOMContentLoaded', run, false);
}
