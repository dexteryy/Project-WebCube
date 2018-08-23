export function isDynamicUrl() {
  if (typeof window === 'undefined') {
    return false;
  }
  const url = window.location.href.replace(/#.*/, '');
  return !/(index.html$)/.test(url);
}
