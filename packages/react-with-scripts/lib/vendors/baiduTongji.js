// http://tongji.baidu.com/web/help/article?id=174&type=0
export default function baiduTongji({ baiduTongjiScript, baiduTongjiId }) {
  return {
    load() {
      window._hmt = window._hmt || [];
      const baiduScript = document.createElement('script');
      baiduScript.async = true;
      const point = document.getElementsByTagName('script')[0];
      baiduScript.src =
        baiduTongjiScript || `https://hm.baidu.com/hm.js?${baiduTongjiId}`;
      point.parentNode.insertBefore(baiduScript, point);
    },
  };
}
