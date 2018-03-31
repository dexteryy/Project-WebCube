import React from 'react';
import ReactDOM from 'react-dom';
import { App } from 'app/{{entryName}}';
import 'normalize.css/normalize.css';

function run() {
  if (
    window.innerWidth &&
    window.innerHeight &&
    screen.availWidth &&
    screen.availHeight
  ) {
    ReactDOM.render(
      React.createElement(App),
      document.getElementById('mountPoint'),
    );
  } else {
    setTimeout(run, 30);
  }
}

if (
  ['complete', 'loaded', 'interactive'].includes(document.readyState) &&
  document.body
) {
  run();
} else {
  document.addEventListener('DOMContentLoaded', run, false);
}
