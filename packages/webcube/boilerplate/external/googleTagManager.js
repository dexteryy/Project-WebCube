// https://developers.google.com/tag-manager/quickstart
export default function googleTagManager({ googleTagManagerContainerId }) {
  return {
    load() {
      /* eslint-disable no-multi-assign */
      const dataLayer = (window.dataLayer = window.dataLayer || []);
      const gtag = (window.gtag = function gtag(...args) {
        dataLayer.push(args);
      });
      /* eslint-enable no-multi-assign */
      gtag('js', new Date());
      gtag('config', googleTagManagerContainerId);
      const point = document.getElementsByTagName('script')[0];
      const gtmScript = document.createElement('script');
      gtmScript.async = true;
      gtmScript.src = `https://www.googletagmanager.com/gtag.js?id=${
        googleTagManagerContainerId
      }`;
      point.parentNode.insertBefore(gtmScript, point);
    },
  };
}
