# redux-source-with-notify

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url] -->

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/redux-source-with-notify.svg
[nodei-image]: https://nodei.co/npm/redux-source-with-notify.png?downloads=true
[npm-url]: https://npmjs.org/package/redux-source-with-notify
<!--
[travis-image]: https://img.shields.io/travis/dexteryy/redux-source-with-notify/master.svg
[travis-url]: https://travis-ci.org/dexteryy/redux-source-with-notify
[dep-image]: https://david-dm.org/dexteryy/redux-source-with-notify.svg
[dep-url]: https://david-dm.org/dexteryy/redux-source-with-notify
-->

A React higher-order component for displaying notifications based on Redux states maintained by [redux-source](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-source) automatically

```
npm install --save redux-source-with-notify
```

It works great with [redux-source-with-block-ui](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-source-with-block-ui)

## Examples

* "react-redux-restapi-app" in [Initial Webcube Examples](https://github.com/dexteryy/Project-WebCube/tree/master/examples/webcube-initial-structure)

## Get Started

For [redux-source's example](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-source#get-started):

```js
// shopManageApp/containers/ShopList.js
import { connect } from 'react-redux';
import connectSource from 'redux-source-connect';
import withNotify from 'redux-source-with-notify';

import MyMessage, { myMessage } from '../components/MyMessage'
import { actions, shopsSource } from '../ducks/shops';


@connectSource(shopsSource, {
  slice: state => state.shops,
})
@connect({
  actions,
})
@withNotify({
  onSuccess: (ref) => { // `ref` is a reference to `MyMessage`'s DOM node
    myMessage.success('Success!')
  },
  onError: (ref, errors) => { // `ref` is a reference to `MyMessage`'s DOM node
    myMessage.error('Operation failed. Please try again or contact admin.')
  },
  sourceStateName = 'source',  // optional
  trigger: MyMessage, // optional
  disbleErrorLogger = false,  // optional
})
export default class ShopList extends PureComponent {
```

Or you can create a custom wrapper:

For example, we use [React Notification System](http://igorprado.com/react-notification-system/)

```js
// shopManageApp/hoc/withNotify.js
import NotificationSystem from 'react-notification-system';
import originWithNotify from 'redux-source-with-notify';

export default function withNotify(config = {}) {
  const {
    position = 'tc',
    successDuration = 2,
    errorDuration = 4,
    successText = 'Success!',
    errorText = 'Operation failed. Please try again or contact admin.',
    errorTexts = {},
    ...otherConfig
  } = config;
  return originWithNotify({
    onSuccess: notify => {
      if (successText) {
        notify.addNotification({
          message: successText,
          level: 'success',
          autoDismiss: successDuration,
          position,
        });
      }
    },
    onError: (notify, errors) => {
      errors.forEach(error => {
        const text = errorTexts[error.message] || errorText;
        if (text) {
          notify.addNotification({
            message: text,
            level: 'error',
            autoDismiss: errorDuration,
            position,
          });
        }
      });
    },
    trigger: NotificationSystem,
    errorTexts,
    ...otherConfig
  });
}
```

```js
// shopManageApp/containers/ShopList.js
import { connect } from 'react-redux';
import connectSource from 'redux-source-connect';

import withNotify from '../hoc/withNotify'
import { actions, shopsSource } from '../ducks/shops';

@connectSource(shopsSource, {
  slice: state => state.shops,
})
@connect({
  actions,
})
@withNotify()
export default class ShopList extends PureComponent {
```
