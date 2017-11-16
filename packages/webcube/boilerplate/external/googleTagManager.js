// https://developers.google.com/tag-manager/quickstart
export default function googleTagManager({ googleTagManagerContainerId }) {
  return {
    load() {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      });
      const point = document.getElementsByTagName('script')[0];
      const gtmScript = document.createElement('script');
      gtmScript.async = true;
      gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${
        googleTagManagerContainerId
      }`;
      point.parentNode.insertBefore(gtmScript, point);
    },
  };
}
