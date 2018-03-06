# redux-source-with-block-ui

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url] -->

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/redux-source-with-block-ui.svg
[nodei-image]: https://nodei.co/npm/redux-source-with-block-ui.png?downloads=true
[npm-url]: https://npmjs.org/package/redux-source-with-block-ui
<!--
[travis-image]: https://img.shields.io/travis/dexteryy/redux-source-with-block-ui/master.svg
[travis-url]: https://travis-ci.org/dexteryy/redux-source-with-block-ui
[dep-image]: https://david-dm.org/dexteryy/redux-source-with-block-ui.svg
[dep-url]: https://david-dm.org/dexteryy/redux-source-with-block-ui
-->

A React higher-order component for displaying [React Block UI](https://availity.github.io/react-block-ui/) based on Redux states maintained by [redux-source](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-source) automatically

```
npm install --save redux-source-with-block-ui
```

It works great with [redux-source-with-notify](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-source-with-notify)

## Get Started

For [redux-source's example](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-source#get-started):

```js
// shopManageApp/containers/ShopList.js
import { connect } from 'react-redux';
import connectSource from 'redux-source-connect';
import withBlockUi from 'redux-source-with-block-ui';
import { Loader } from 'react-loaders';
import 'loaders.css/src/animations/line-scale.scss';

import { actions, shopsSource } from '../ducks/shops';


@connectSource(shopsSource, {
  slice: state => state.shops,
})
@connect({
  actions,
})
@withBlockUi({
  loader: <Loader type="line-scale" color="#8159bb" />,
  keepInView = true, // optional
  sourceStateName = 'source', // optional
  ...otherReactBlockUiProps, // optional
})
export default class ShopList extends PureComponent {
```

Or you can create a custom wrapper:

```js
// shopManageApp/hoc/withBlockUi.js
import React from 'react';
import originWithBlockUi from 'redux-source-with-block-ui';
import { Loader } from 'react-loaders';
import 'loaders.css/src/animations/line-scale.scss';

export default function withBlockUi(config = {}) {
  const { keepInView, sourceStateName, ...otherProps } = config;
  return originWithBlockUi({
    ...otherProps,
    loader: <Loader type="line-scale" color="#8159bb" />,
    keepInView,
    sourceStateName,
  });
}
```

```js
// shopManageApp/containers/ShopList.js
import { connect } from 'react-redux';
import connectSource from 'redux-source-connect';

import withBlockUi from '../hoc/withBlockUi'
import { actions, shopsSource } from '../ducks/shops';

@connectSource(shopsSource, {
  slice: state => state.shops,
})
@connect({
  actions,
})
@withBlockUi()
export default class ShopList extends PureComponent {
```

