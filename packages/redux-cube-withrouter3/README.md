# redux-cube-withrouter3

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url] -->

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/redux-cube-withrouter3.svg
[nodei-image]: https://nodei.co/npm/redux-cube-withrouter3.png?downloads=true
[npm-url]: https://npmjs.org/package/redux-cube-withrouter3
<!--
[travis-image]: https://img.shields.io/travis/dexteryy/redux-cube-withrouter3/master.svg
[travis-url]: https://travis-ci.org/dexteryy/redux-cube-withrouter3
[dep-image]: https://david-dm.org/dexteryy/redux-cube-withrouter3.svg
[dep-url]: https://david-dm.org/dexteryy/redux-cube-withrouter3
-->

![iOS Safari](https://github.com/alrra/browser-logos/raw/master/src/safari-ios/safari-ios_48x48.png) | ![Android WebView](https://github.com/alrra/browser-logos/raw/master/src/android/android_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- |
iOS 7+ ✔ | Android 4+ ✔ | 11+ ✔ |

redux-cube's pluggable module for react-router v3

```
npm install --save-dev redux-cube-withrouter3
```

For react-router v4+, use `import { withRouter } from 'redux-cube'`

## Get Started

```js
// xxx/App.jsx
import { createApp } from 'redux-cube';
import withRouter3 from 'redux-cube-withrouter3';

@createApp(withRouter3({
  reducers: {
    // ...
  },
  // below are optional
  disableHashRouter: false,
  // ...
})))
class SubApp extends PureComponent {
  render() {
    const {
      routerHistoryWithStore,
    } = this.props;
    return (
      <Router history={routerHistoryWithStore}>
        <Route path="/" component={Home}>
          <Route path="foo" component={Foo}/>
          <Route path="bar" component={Bar}/>
        </Route>
      </Router>
    );
  }
}
```
