# react-with-scripts

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url] -->

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/react-with-scripts.svg
[nodei-image]: https://nodei.co/npm/react-with-scripts.png?downloads=true
[npm-url]: https://npmjs.org/package/react-with-scripts
<!--
[travis-image]: https://img.shields.io/travis/dexteryy/react-with-scripts/master.svg
[travis-url]: https://travis-ci.org/dexteryy/react-with-scripts
[dep-image]: https://david-dm.org/dexteryy/react-with-scripts.svg
[dep-url]: https://david-dm.org/dexteryy/react-with-scripts
-->

Add third party script tags, JS SDK and tracking code without modifying any HTML code

```
npm install --save react-with-scripts
```


## Examples

* [webcube-todo-app](../examples/webcube-todo-app)
* [webcube-examples](../examples/webcube-examples)

## Get Started

```js
import React, { Component } from 'react';
import withScripts, { googleAnalytics } from 'react-with-scripts';

@withScripts(
  googleAnalytics({
    googleAnalyticsTrackingId: 'UA-XXXXX-XX',
  }),
)
class App extends Component {
  render() {
    return (
      <AppRoot>
        {/* ... */}
      </AppRoot>
    )
  }
}
```

or

```js
import React from 'react';
import withScripts, { googleAnalytics } from 'react-with-scripts';

export const App = withScripts(
  googleAnalytics({
    googleAnalyticsTrackingId: 'UA-XXXXX-XX',
  }),
)((props) => {
  return (
    <AppRoot>
      {/* ... */}
    </AppRoot>
  )
});
```

## Options

### `googleAnalytics()`

* `googleAnalyticsTrackingId`
* `googleOptimizeId`
* `googleAnalyticsInit` (optional)
  * type - Function
  * params - `ga`

### `baiduTongji()`

* `baiduTongjiId`
* `baiduTongjiScript` (optional)

### `wechatSdk()`

* `wechatScript`
  * type - String
* `wechatSignatureApi`
  * type - String
* `wechatDebug`
  * type - Boolean
  * `wx.config({ debug: true,`
* `wechatApiList`
  * type - Array
  * `wx.config({ jsApiList: [],`

### `growingIo()`

* `growingIoAccountId`

### `zhugeIo()`

* `zhugeIoAppKey`
