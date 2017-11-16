let _isDynamicUrl;

export function isDynamicUrl() {
  if (typeof window === 'undefined') {
    return false;
  }
  if (!_isDynamicUrl) {
    _isDynamicUrl = !/\/\/localhost/.test(window.location.href);
  }
  return _isDynamicUrl;
}
