
import React from 'react';
import ReactDOM from 'react-dom';
import perfAddon from 'react-addons-perf';
import hifetch from 'hifetch';
import union from 'lodash/union';

const isProductionEnv = process.env.NODE_ENV === 'production';

// https://github.com/facebook/react/issues/436
// https://github.com/zilverline/react-tap-event-plugin
if (!process.env.WEBCUBE_DISABLE_TAP_EVENT_ADDON
    && !process.env.WEBCUBE_USE_PREACT) {
  require('react-tap-event-plugin')();
}

export default class AppSkeleton {

  defaultOptions: Object = {};
  createRoot: Function;
  Root: React.Component;
  // @TODO react-router v4: start
  routes: ?Object;
  rootProps: ?Object;
  // @TODO react-router v4: end
  reducers: ?Object;
  initialState: ?Object;
  moreMiddleware: ?Array<Function>;
  moreEnhancers: ?Array<Function>;

  builtinOptions: AppOpt = {
    disableHashRouter: false,
    DevTools: null,
    enableGoogleTagManager: false,
    googleTagManagerContainerId: '',
    enableGoogleAnalytics: false,
    googleAnalyticsTrackingId: '',
    googleOptimizeId: '',
    googleAnalyticsInit: null,
    enableBaiduTongji: false,
    baiduTongjiScript: '',
    baiduTongjiId: '',
    enableGrowingIo: false,
    growingIoAccountId: '',
    enableZhugeIo: false,
    zhugeIoAppKey: '',
    enableWechatSdk: false,
    wechatScript: 'https://res.wx.qq.com/open/js/jweixin-1.0.0.js',
    wechatSignatureApi: '',
    wechatDebug: false,
    wechatApiList: [],
    wechatShare: null,
  };
  opt: Object = {};

  _node: HTMLElement;
  _root: React.Component | void;

  constructor(userOpt: Object = {}) {
    this.config(userOpt);
    if (typeof window !== 'undefined') {
      this.loadExternalScripts();
    }
  }

  config(userOpt: AppOpt) {
    Object.assign(this.opt, this.builtinOptions, this.defaultOptions, userOpt);
  }

  mount(node: HTMLElement, cb: Function): AppSkeleton {
    const Root = this.createRoot({
      isProductionEnv,
      AppRoot: this.Root,
      // @TODO react-router v4: start
      routes: this.routes,
      rootProps: this.rootProps,
      // @TODO react-router v4: end
      reducers: this.reducers,
      initialState: this.initialState,
      moreMiddleware: this.moreMiddleware,
      moreEnhancers: this.moreEnhancers,
      options: this.opt,
    });
    perfAddon.start();
    this._root = ReactDOM.render(
      React.createElement(Root),
      node,
      () => {
        perfAddon.stop();
        perfAddon.printInclusive();
        perfAddon.printExclusive();
        perfAddon.printWasted();
        cb && cb();
      },
    );
    this._node = node;
    setTimeout(() => {
      this.wechatReady(() => {
        this.configWechatShare();
      });
    }, 0);
    return this;
  }

  unmount(): AppSkeleton {
    ReactDOM.unmountComponentAtNode(this._node);
    return this;
  }

  remount(cb: Function): AppSkeleton {
    return this.mount(this._node, cb);
  }

  loadExternalScripts() {
    const {
      enableGoogleTagManager,
      enableGoogleAnalytics,
      enableBaiduTongji,
      enableGrowingIo,
      enableZhugeIo,
      enableWechatSdk,
    } = this.opt;
    if (enableGoogleTagManager) {
      this.loadGoogleTagManagerScripts();
    }
    if (enableGoogleAnalytics) {
      this.loadGoogleAnalyticsScripts();
    }
    if (enableBaiduTongji) {
      this.loadBaiduTongjiScripts();
    }
    if (enableGrowingIo) {
      this.loadGrowingIoScripts();
    }
    if (enableZhugeIo) {
      this.loadZhugeIoScripts();
    }
    const isWechat = /micromessenger/.test(window.navigator.userAgent.toLowerCase());
    if (enableWechatSdk && isWechat) {
      this.loadWechatSdkScripts();
    }
  }

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/
  loadGoogleAnalyticsScripts() {
    const {
      googleAnalyticsInit,
      googleAnalyticsTrackingId,
      googleOptimizeId,
    } = this.opt;
    window['GoogleAnalyticsObject'] = 'ga';
    window['ga'] = window['ga'] || function (...args) {
      (window['ga'].q = window['ga'].q || []).push(args);
    };
    window['ga'].l = new Date().getTime();
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.google-analytics.com/analytics.js';
    const point = document.getElementsByTagName('script')[0];
    point.parentNode.insertBefore(gaScript, point);
    const ga = window['ga'];
    if (googleAnalyticsInit) {
      googleAnalyticsInit(ga);
    } else {
      ga('create', googleAnalyticsTrackingId, 'auto');
      if (googleOptimizeId) {
        ga('require', googleOptimizeId);
      }
      ga('send', 'pageview');
    }
  }

  // https://developers.google.com/tag-manager/quickstart
  loadGoogleTagManagerScripts() {
    const {
      googleTagManagerContainerId,
    } = this.opt;
    window['dataLayer'] = window['dataLayer'] || [];
    window['dataLayer'].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });
    const point = document.getElementsByTagName('script')[0];
    const gtmScript = document.createElement('script');
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${googleTagManagerContainerId}`;
    point.parentNode.insertBefore(gtmScript, point);
  }

  // http://tongji.baidu.com/web/help/article?id=174&type=0
  loadBaiduTongjiScripts() {
    const {
      baiduTongjiScript,
      baiduTongjiId,
    } = this.opt;
    window['_hmt'] = window['_hmt'] || [];
    const baiduScript = document.createElement('script');
    baiduScript.async = true;
    const point = document.getElementsByTagName('script')[0];
    baiduScript.src = baiduTongjiScript || `https://hm.baidu.com/hm.js?${baiduTongjiId}`;
    point.parentNode.insertBefore(baiduScript, point);
  }

  loadGrowingIoScripts() {
    const {
      growingIoAccountId,
    } = this.opt;
    const _vds = window._vds || [];
    window._vds = _vds;
    _vds.push(['setAccountId', growingIoAccountId]);
    const vds = document.createElement('script');
    vds.type = 'text/javascript';
    vds.async = true;
    const protocol = 'https:' === document.location.protocol ? 'https://' : 'http://';
    vds.src = `${protocol}dn-growing.qbox.me/vds.js`;
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(vds, s);
  }

  loadZhugeIoScripts() {
    const {
      zhugeIoAppKey,
    } = this.opt;
    window.zhuge = window.zhuge || [];
    window.zhuge.methods = '_init debug identify track trackLink trackForm page'.split(' ');
    window.zhuge.factory = function (b) {
      return function (...args) {
        const a = Array.prototype.slice.call(args);
        a.unshift(b);
        window.zhuge.push(a);
        return window.zhuge;
      };
    };
    for (let i = 0; i < window.zhuge.methods.length; i++) {
      const key = window.zhuge.methods[i];
      window.zhuge[key] = window.zhuge.factory(key);
    }
    window.zhuge.load = function (b, x) {
      if (!document.getElementById('zhuge-js')) {
        const a = document.createElement('script');
        const verDate = new Date();
        const verStr = verDate.getFullYear().toString()
          + verDate.getMonth().toString()
          + verDate.getDate().toString();
        a.type = 'text/javascript';
        a.id = 'zhuge-js';
        a.async = !0;
        a.src = (location.protocol === 'http:'
          ? 'http://sdk.zhugeio.com/zhuge.min.js?v='
          : 'https://zgsdk.zhugeio.com/zhuge.min.js?v=') + verStr;
        a.onerror = function () {
          window.zhuge.identify = window.zhuge.track = function (ename, props, callback) {
            if (callback && Object.prototype.toString.call(callback) === '[object Function]') {
              callback();
            }
          };
        };
        const c = document.getElementsByTagName('script')[0];
        c.parentNode.insertBefore(a, c);
        window.zhuge._init(b, x);
      }
    };
    window.zhuge.load(zhugeIoAppKey);
  }

  // http://mp.weixin.qq.com/wiki/11/74ad127cc054f6b80759c40f77ec03db.html
  loadWechatSdkScripts() {
    const {
      wechatScript,
      wechatSignatureApi,
      wechatDebug,
      wechatApiList,
    } = this.opt;
    const wxScript = document.createElement('script');
    wxScript.async = true;
    wxScript.src = wechatScript;
    const loadWxScript = new Promise(resolve => {
      wxScript.onload = function () {
        resolve(window.wx);
      };
    });
    const point = document.getElementsByTagName('script')[0];
    point.parentNode.insertBefore(wxScript, point);
    this._wechatReady = new Promise((resolve, reject) => {
      Promise.all([
        loadWxScript,
        hifetch({
          url: wechatSignatureApi,
          query: {
            url: window.location.href.replace(/#.*/, ''),
          },
        }).send(),
      ]).then(([wx, json]) => {
        const {
          appId,
          timestamp,
          nonceStr,
          signature,
        } = json;
        wx.config({
          debug: wechatDebug,
          appId,
          timestamp,
          nonceStr,
          signature,
          jsApiList: union(wechatApiList, [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareQZone',
          ]),
        });
        wx.ready(() => {
          resolve(wx);
        });
        wx.error(reject);
      }).catch(err => {
        console.warn(`WECHAT JS API LOADING FAILED: ${err.message}`);
      });
    });
  }

  wechatReady(fn) {
    if (!this._wechatReady) {
      return;
    }
    this._wechatReady.then(fn).catch(err => {
      console.warn('WECHAT CONFIG ERROR: ', err);
    });
  }

  configWechatShare() {
    const {
      wechatShare,
    } = this.opt;
    if (!wechatShare) {
      return;
    }
    const {
      title: customTitle,
      link: customLink,
      imgUrl: customImgUrl,
      desc: customDesc,
      success = () => {},
      cancel = () => {},
    } = wechatShare;
    this.wechatReady(wx => {
      const link = customLink
        || window.location.href;
      let title = customTitle;
      if (!customLink) {
        title = document.querySelector('title');
        title = title ? title.innerHTML : '';
      }
      let desc = customDesc;
      if (!customDesc) {
        desc = document.querySelector('meta[name=description]');
        desc = desc ? desc.getAttribute('content') : '';
      }
      let imgUrl = customImgUrl;
      if (!customImgUrl) {
        imgUrl = document.querySelector('body img');
        imgUrl = imgUrl ? imgUrl.src : '';
      }
      wx.onMenuShareTimeline({
        title,
        link,
        imgUrl,
        success,
        cancel,
      });
      wx.onMenuShareAppMessage({
        title,
        link,
        imgUrl,
        desc,
        type: '',
        dataUrl: '',
        success,
        cancel,
      });
      wx.onMenuShareQQ({
        title,
        link,
        imgUrl,
        desc,
        success,
        cancel,
      });
      wx.onMenuShareQZone({
        title,
        link,
        imgUrl,
        desc,
        success,
        cancel,
      });
    });
  }

}
