# redux-cube-with-router

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url] -->

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/redux-cube-with-router.svg
[nodei-image]: https://nodei.co/npm/redux-cube-with-router.png?downloads=true
[npm-url]: https://npmjs.org/package/redux-cube-with-router
<!--
[travis-image]: https://img.shields.io/travis/dexteryy/redux-cube-with-router/master.svg
[travis-url]: https://travis-ci.org/dexteryy/redux-cube-with-router
[dep-image]: https://david-dm.org/dexteryy/redux-cube-with-router.svg
[dep-url]: https://david-dm.org/dexteryy/redux-cube-with-router
-->

[redux-cube](https://www.npmjs.com/package/redux-cube)'s pluggable module for [react-router v4+](https://reacttraining.com/react-router/) and [react-router-redux v5+](https://github.com/reacttraining/react-router/tree/master/packages/react-router-redux)

```
npm install --save redux-cube-with-router
```

For [react-router's legacy versions (< 4)](https://github.com/ReactTraining/react-router/tree/v3/docs), use [redux-cube-with-router-legacy](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-cube-with-router-legacy)

## Get Started

```js
// xxx/App.jsx
import { createApp } from 'redux-cube';
import withRouter from 'redux-cube-with-router';
import { Route } from 'react-router-dom';

@createApp(withRouter({
  reducers: {
    // ...
  },
  // optional
  // https://github.com/ReactTraining/history#usage
  supportHtml5History: false,
  // optional
  // https://github.com/ReactTraining/react-router/blob/master/packages/react-router-redux/modules/ConnectedRouter.js#L8
  routerConfig: {},
  // ...
})))
class SubApp extends PureComponent {
  render() {
    return (
      <Route path="/" component={Home}>
        <Route path="foo" component={Foo}/>
        <Route path="bar" component={Bar}/>
      </Route>
    );
  }
}
```
