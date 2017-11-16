import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import { App } from 'app/react-router-app';

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
