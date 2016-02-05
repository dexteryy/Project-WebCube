/* @flow */

import 'normalize.css';
import './deploy.scss';
import App from 'src/entries/{{entryName}}';

const app = new App();

export default function run() {
  app.init({
    root: document.getElementById('root'),
  });
}

document.addEventListener('DOMContentLoaded', run, false);
