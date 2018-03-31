// https://developers.google.com/analytics/devguides/collection/analyticsjs/
export default function googleAnalytics({
  googleAnalyticsInit,
  googleAnalyticsTrackingId,
  googleOptimizeId,
}) {
  return {
    load() {
      window.GoogleAnalyticsObject = 'ga';
      window.ga =
        window.ga ||
        function(...args) {
          (window.ga.q = window.ga.q || []).push(args);
        };
      window.ga.l = new Date().getTime();
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = 'https://www.google-analytics.com/analytics.js';
      const point = document.getElementsByTagName('script')[0];
      point.parentNode.insertBefore(gaScript, point);
      const { ga } = window;
      if (googleAnalyticsInit) {
        googleAnalyticsInit(ga);
      } else {
        ga('create', googleAnalyticsTrackingId, 'auto');
        if (googleOptimizeId) {
          ga('require', googleOptimizeId);
        }
        ga('send', 'pageview');
      }
    },
  };
}
