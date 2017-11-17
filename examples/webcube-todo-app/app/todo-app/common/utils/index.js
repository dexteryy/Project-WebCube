let _isDynamicUrl;

export function isDynamicUrl() {
  if (typeof window === 'undefined') {
    return false;
  }
  const url = window.location.href.replace(/#.*/, '');
  if (!_isDynamicUrl) {
    _isDynamicUrl = !/(\/\/localhost|index.html$)/.test(url);
  }
  return _isDynamicUrl;
}
