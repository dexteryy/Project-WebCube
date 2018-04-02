// https://developers.google.com/tag-manager/quickstart
export default function googleTagManager({ googleTagManagerContainerId }) {
  return {
    load() {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args) {
        window.dataLayer.push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', googleTagManagerContainerId);
      const point = document.getElementsByTagName('script')[0];
      const gtmScript = document.createElement('script');
      gtmScript.async = true;
      gtmScript.src = `https://www.googletagmanager.com/gtag/js?id=${googleTagManagerContainerId}`;
      point.parentNode.insertBefore(gtmScript, point);
    },
  };
}
