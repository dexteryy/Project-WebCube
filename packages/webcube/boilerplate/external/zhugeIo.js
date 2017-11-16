export default function zhugeIo({ zhugeIoAppKey }) {
  return {
    load() {
      window.zhuge = window.zhuge || [];
      window.zhuge.methods = '_init debug identify track trackLink trackForm page'.split(
        ' ',
      );
      window.zhuge.factory = function(b) {
        return function(...args) {
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
      window.zhuge.load = function(b, x) {
        if (!document.getElementById('zhuge-js')) {
          const a = document.createElement('script');
          const verDate = new Date();
          const verStr =
            verDate.getFullYear().toString() +
            verDate.getMonth().toString() +
            verDate.getDate().toString();
          a.type = 'text/javascript';
          a.id = 'zhuge-js';
          a.async = !0;
          a.src =
            (location.protocol === 'http:'
              ? 'http://sdk.zhugeio.com/zhuge.min.js?v='
              : 'https://zgsdk.zhugeio.com/zhuge.min.js?v=') + verStr;
          a.onerror = function() {
            const track = function(ename, props, callback) {
              if (
                callback &&
                Object.prototype.toString.call(callback) === '[object Function]'
              ) {
                return callback();
              }
              return null;
            };
            window.zhuge.identify = track;
            window.zhuge.track = track;
          };
          const c = document.getElementsByTagName('script')[0];
          c.parentNode.insertBefore(a, c);
          window.zhuge._init(b, x);
        }
      };
      window.zhuge.load(zhugeIoAppKey);
    },
  };
}
