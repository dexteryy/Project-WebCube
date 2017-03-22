
import 'normalize.css/normalize.css';
import './deploy.scss';
import App from 'app/{{entryName}}';
// import DevTools from 'app/common/containers/DevTools';

const app = new App({
  appStateSample: 'sample',
  isStaticWeb: true,
  // DevTools,
});

export default function run() {
  if (window.innerWidth && window.innerHeight
      && screen.availWidth && screen.availHeight) {
    app.mount(document.getElementById('{{camelCase entryName}}'));
  } else {
    setTimeout(run, 30);
  }
}

if (['complete', 'loaded', 'interactive'].includes(document.readyState)
    && document.body) {
  run();
} else {
  document.addEventListener('DOMContentLoaded', run, false);
}
