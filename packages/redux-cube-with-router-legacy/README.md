# redux-cube-with-router-legacy

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url] -->

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/redux-cube-with-router-legacy.svg
[nodei-image]: https://nodei.co/npm/redux-cube-with-router-legacy.png?downloads=true
[npm-url]: https://npmjs.org/package/redux-cube-with-router-legacy
<!--
[travis-image]: https://img.shields.io/travis/dexteryy/redux-cube-with-router-legacy/master.svg
[travis-url]: https://travis-ci.org/dexteryy/redux-cube-with-router-legacy
[dep-image]: https://david-dm.org/dexteryy/redux-cube-with-router-legacy.svg
[dep-url]: https://david-dm.org/dexteryy/redux-cube-with-router-legacy
-->

[redux-cube](https://www.npmjs.com/package/redux-cube)'s pluggable module for [react-router's legacy version (< 4)](https://github.com/ReactTraining/react-router/tree/v3/docs) and [react-router-redux v4](https://github.com/reactjs/react-router-redux)

```
npm install --save redux-cube-with-router-legacy
```

For [react-router v4+](https://reacttraining.com/react-router/), use [redux-cube-with-router](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-cube-with-router)

## Get Started

```js
// xxx/App.jsx
import { createApp } from 'redux-cube';
import withRouter from 'redux-cube-with-router-legacy';

@createApp(withRouter({
  reducers: {
    // ...
  },
  // optional
  disableHashRouter: false,
  // optional
  // https://github.com/reactjs/react-router-redux#history--synchistorywithstorehistory-store-options
  routerHistoryConfig: {
    // ...
  },
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
