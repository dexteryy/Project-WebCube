/* @flow */

import './deploy.scss';
import App from 'app/entries/{{entryName}}';

const app = new App();

export default function run() {
  app.init({
    root: document.getElementById('root'),
  });
}

document.addEventListener('DOMContentLoaded', run, false);
