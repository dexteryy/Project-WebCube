# redux-source-connect

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url] -->

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/redux-source-connect.svg
[nodei-image]: https://nodei.co/npm/redux-source-connect.png?downloads=true
[npm-url]: https://npmjs.org/package/redux-source-connect
<!--
[travis-image]: https://img.shields.io/travis/dexteryy/redux-source-connect/master.svg
[travis-url]: https://travis-ci.org/dexteryy/redux-source-connect
[dep-image]: https://david-dm.org/dexteryy/redux-source-connect.svg
[dep-url]: https://david-dm.org/dexteryy/redux-source-connect
-->

Connect React components to Redux states maintained by [redux-source](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-source) automatically

```
npm install --save redux-source-connect
```

For [Immutable.js](http://facebook.github.io/immutable-js/) store: [redux-source-connect-immutable](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-source-connect-immutable)

## Get Started

For [redux-source's example](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-source#get-started):

```js
import { connect } from 'react-redux';
import connectSource from 'redux-source-connect';
import { shopsSource } from '../ducks/shops';

@connectSource(shopsSource, {
  slice: state => state.shops,
  actionsProp: 'actions', // optional
  enableErrorLogger: false, // optional
})
@connect(
  //...
)
export default class ShopList extends PureComponent {
  render() {
    const {
      source: {
        result: { shops },
        errors,
        isPending,
      },
      actions,
    } = this.props;
// ...
```

> TIPS
> * `this.props.source.result` is automatically [denormalized](https://github.com/paularmstrong/normalizr/blob/HEAD/docs/api.md#denormalizeinput-schema-entities) by `connectSource`

or with redux-cube's `connect`:

```js
import { connect } from 'redux-cube';
import connectSource from 'redux-source-connect';
import { actions, shopsSource } from '../ducks/shops';

@connectSource(shopsSource, {
  slice: state => state.shops,
})
@connect({
  // ...
  actions,
})
export default class ShopList extends PureComponent {
// ...
```

