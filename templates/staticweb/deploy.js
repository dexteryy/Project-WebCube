import 'normalize.css/normalize.css';
import App from 'app/{{entryName}}';

const app = new App({
  // enableGoogleTagManager: true,
  // googleTagManagerContainerId: 'GTM-XXXX',
  // enableGoogleAnalytics: true,
  // googleAnalyticsTrackingId: 'UA-XXXXX-Y',
  // googleOptimizeId: 'GTM-XXXXXXX'
  // googleAnalyticsInit: null,
  // enableBaiduTongji: true,
  // baiduTongjiId: 'XXXXXX',
  // enableGrowingIo: false,
  // growingIoAccountId: 'XXXXXXX',
  // enableZhugeIo: false,
  // zhugeIoAppKey: 'XXXXXX',
  // enableWechatSdk: true,
  // wechatSignatureApi: WECHAT_SIGNATURE_API,
  // wechatDebug: false,
  // wechatShare: {
  //   imgUrl: '',
  // },
});

function run() {
  if (
    window.innerWidth &&
    window.innerHeight &&
    screen.availWidth &&
    screen.availHeight
  ) {
    app.mount(document.getElementById('{{camelCase entryName}}'));
  } else {
    const INTERVAL = 30;
    setTimeout(run, INTERVAL);
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
