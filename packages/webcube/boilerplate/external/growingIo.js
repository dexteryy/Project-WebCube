export default function growingIo({ growingIoAccountId }) {
  return {
    load() {
      const _vds = window._vds || [];
      window._vds = _vds;
      _vds.push(['setAccountId', growingIoAccountId]);
      const vds = document.createElement('script');
      vds.type = 'text/javascript';
      vds.async = true;
      const protocol =
        'https:' === document.location.protocol ? 'https://' : 'http://';
      vds.src = `${protocol}dn-growing.qbox.me/vds.js`;
      const s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(vds, s);
    },
  };
}
