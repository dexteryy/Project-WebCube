
import 'normalize.css/normalize.css';
import './deploy.scss';
import App from 'app/{{entryName}}';
// import DevTools from 'app/common/containers/DevTools';

const app = new App({
  appStateSample: 'sample',
  isStaticWeb: true,
  // enableGoogleTagManager: true,
  // googleTagManagerContainerId: 'GTM-XXXX',
  // enableGoogleAnalytics: true,
  // googleAnalyticsTrackingId: 'UA-XXXXX-Y',
  // googleOptimizeId: 'GTM-XXXXXXX'
  // googleAnalyticsInit: null,
  // enableBaiduTongji: true,
  // baiduTongjiId: 'XXXXXX',
  // enableGrowingIo: true,
  // growingIoAccountId: 'XXXXXXX',
  // enableWechatSdk: true,
  // wechatSignatureApi: WECHAT_SIGNATURE_API,
  // wechatDebug: false,
  // wechatShare: {
  //   imgUrl: '',
  // },
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
