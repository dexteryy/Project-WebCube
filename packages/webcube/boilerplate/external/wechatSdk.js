import 'isomorphic-fetch';
import union from 'lodash/union';

// http://mp.weixin.qq.com/wiki/11/74ad127cc054f6b80759c40f77ec03db.html
export default function wechatSdk({
  wechatScript,
  wechatSignatureApi,
  wechatDebug,
  wechatApiList,
}) {
  const isWechat = /micromessenger/.test(
    window.navigator.userAgent.toLowerCase(),
  );
  let wechatReady;
  return {
    load() {
      if (wechatReady || !isWechat) {
        return;
      }
      const wxScript = document.createElement('script');
      wxScript.async = true;
      wxScript.src = wechatScript;
      const loadWxScript = new Promise(resolve => {
        wxScript.onload = function() {
          resolve(window.wx);
        };
      });
      const point = document.getElementsByTagName('script')[0];
      point.parentNode.insertBefore(wxScript, point);
      wechatReady = new Promise((resolve, reject) => {
        Promise.all([
          loadWxScript,
          fetch(
            `${wechatSignatureApi}?url=${window.location.href.replace(
              /#.*/,
              '',
            )}`,
          ).then(response => response.json()),
        ])
          .then(([wx, json]) => {
            const { appId, timestamp, nonceStr, signature } = json;
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
          })
          .catch(err => {
            console.warn(
              `[webcube] wechat JS SDK cannot be loaded: ${err.message}`,
            );
          });
      });
    },

    ready(fn) {
      if (!wechatReady) {
        return;
      }
      wechatReady.then(fn).catch(err => {
        console.warn('[webcube] wrong settings of wechat JS SDK: ', err);
      });
    },

    configShare({
      title: customTitle,
      link: customLink,
      imgUrl: customImgUrl,
      desc: customDesc,
      success = () => {
        // placeholder
      },
      cancel = () => {
        // placeholder
      },
    }) {
      this.ready(wx => {
        const link = customLink || window.location.href;
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
        const config = {
          title,
          link,
          imgUrl,
          desc,
          success,
          cancel,
        };
        wx.onMenuShareTimeline(config);
        wx.onMenuShareAppMessage({
          type: '',
          dataUrl: '',
          ...config,
        });
        wx.onMenuShareQQ(config);
        wx.onMenuShareQZone(config);
      });
    },
  };
}
