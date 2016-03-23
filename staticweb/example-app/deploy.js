
import 'normalize.css/normalize.css';
import './deploy.scss';
import App from 'src/entries/example-app';
// or import App from '../../';
// import DevTools from 'src/containers/DevTools';

const app = new App({
  isStaticWeb: true,
  // TODO: wait for babel v5 -> v6
  // devTools: DevTools.instrument(),
});

export default function run() {
  app.mount(document.getElementById('exampleApp'));
}

if (['complete', 'loaded', 'interactive'].includes(document.readyState)
    && document.body) {
  run();
} else {
  document.addEventListener('DOMContentLoaded', run, false);
}
