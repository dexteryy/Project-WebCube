# redux-cube-with-immutable

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url] -->

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/redux-cube-with-immutable.svg
[nodei-image]: https://nodei.co/npm/redux-cube-with-immutable.png?downloads=true
[npm-url]: https://npmjs.org/package/redux-cube-with-immutable
<!--
[travis-image]: https://img.shields.io/travis/dexteryy/redux-cube-with-immutable/master.svg
[travis-url]: https://travis-ci.org/dexteryy/redux-cube-with-immutable
[dep-image]: https://david-dm.org/dexteryy/redux-cube-with-immutable.svg
[dep-url]: https://david-dm.org/dexteryy/redux-cube-with-immutable
-->

![iOS Safari](https://github.com/alrra/browser-logos/raw/master/src/safari-ios/safari-ios_48x48.png) | ![Android WebView](https://github.com/alrra/browser-logos/raw/master/src/android/android_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- |
iOS 7+ ✔ | Android 4+ ✔ | 11+ ✔ |

redux-cube's pluggable module for [redux-immutable](https://www.npmjs.com/package/redux-immutable)

```
npm install --save-dev redux-cube-with-immutable
```

> NOTE: redux-cube-with-immutable cannot be used with [redux-cube-with-persist](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-cube-with-persist)

## Get Started

```js
// xxx/App.jsx
import { createApp } from 'redux-cube';
import withImmutable from 'redux-cube-with-immutable';
import withRouter from 'redux-cube-with-router';

@createApp(withImmutable(withRouter({
  reducers: {
    // ...
  },
  // ...
}))))
class SubApp extends PureComponent {
  render() {
    // ...
  }
}
```
