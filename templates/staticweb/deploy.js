
import 'normalize.css';
import './deploy.scss';
import App from 'src/entries/{{entryName}}';
// or import App from '../../';
// import DevTools from 'src/shared/containers/DevTools';

const app = new App({
  isStaticWeb: true,
  // TODO: wait for babel v5 -> v6
  // devTools: DevTools.instrument(),
});

export default function run() {
  app.mount(document.getElementById('{{camelCase entryName}}'));
}

if (['complete', 'loaded', 'interactive'].includes(document.readyState)
    && document.body) {
  run();
} else {
  document.addEventListener('DOMContentLoaded', run, false);
}
