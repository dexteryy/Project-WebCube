# redux-cube-with-i18next

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url] -->

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/redux-cube-with-i18next.svg
[nodei-image]: https://nodei.co/npm/redux-cube-with-i18next.png?downloads=true
[npm-url]: https://npmjs.org/package/redux-cube-with-i18next
<!--
[travis-image]: https://img.shields.io/travis/dexteryy/redux-cube-with-i18next/master.svg
[travis-url]: https://travis-ci.org/dexteryy/redux-cube-with-i18next
[dep-image]: https://david-dm.org/dexteryy/redux-cube-with-i18next.svg
[dep-url]: https://david-dm.org/dexteryy/redux-cube-with-i18next
-->

[redux-cube](https://www.npmjs.com/package/redux-cube)'s pluggable module for [react-i18next](https://react.i18next.com/)

```
npm install --save redux-cube-with-i18next
```

## Get Started

With [webcube](https://github.com/dexteryy/Project-WebCube/tree/master/packages/webcube):

```js
import React from 'react';
import withI18next from 'redux-cube-with-i18next';
import i18nResources from 'config/locales';
import cube from './cube';

function App() {
  return (
      <div/>
  );
}

export default App
  |> cube.createApp({
    plugins: [withI18next],
    i18nextConfig: {
      resources: i18nResources,
    },
  });
```

Without webcube:

WIP
