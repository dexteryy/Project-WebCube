# Redux Cube

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url] -->

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/redux-cube.svg
[nodei-image]: https://nodei.co/npm/redux-cube.png?downloads=true
[npm-url]: https://npmjs.org/package/redux-cube
<!--
[travis-image]: https://img.shields.io/travis/dexteryy/redux-cube/master.svg
[travis-url]: https://travis-ci.org/dexteryy/redux-cube
[dep-image]: https://david-dm.org/dexteryy/redux-cube.svg
[dep-url]: https://david-dm.org/dexteryy/redux-cube
-->

Redux Cube is a app state manager. It's a set of wrappers which simplify the use of Redux and its whole ecosystem, reduce boilerplate, and provide many features (Sub App, Reducer Bundle, ...)

```
npm install --save-dev redux-cube
```

## Overview

WIP

## Modules

### redux-cube

* `import { createApp, createHub, connect } from 'redux-cube'`
* `createApp` is mainly a wrapper of [redux API](https://redux.js.org/docs/api/) and some must-have action middlewares, store enhancers, high-order reducers and high-order components
* `createHub` is a wrapper and enhancer of [redux-actions](https://www.npmjs.com/package/redux-actions)
* `connect` is mainly a wrapper of [react-redux](https://www.npmjs.com/package/react-redux) and  [reselect](https://www.npmjs.com/package/reselect)

### redux-cube/lib/plugins

* `import withRouter from 'redux-cube/lib/plugins/withPersist'`
  * Add support to `createApp` for [redux-persist](https://www.npmjs.com/package/redux-persist)
* `import withRouter from 'redux-cube/lib/plugins/withRouter'`
  * Add support to `createApp` for [react-router v4+](https://reacttraining.com/react-router/) + [react-router-redux v5+](https://github.com/reacttraining/react-router/tree/master/packages/react-router-redux)
* `import withRouter3 from 'redux-cube-withrouter3'`
  * Add support to `createApp` for [react-router v3](https://github.com/ReactTraining/react-router/tree/v3/docs) + [react-router-redux v4](https://github.com/reactjs/react-router-redux)
* `import withImmutable from 'redux-cube/lib/plugins/withImmutable'`
  * Add support to `createApp` for [redux-immutable](https://www.npmjs.com/package/redux-immutable)

### redux-cube/lib/helpers

* `import { update, deepMerge } from 'redux-cube/lib/helpers'`
* Provide some utility fuctions, such as [immutability-helper](https://www.npmjs.com/package/immutability-helper)'s `update`

### redux-cube/lib/remote

* `import { middleware, reducers } from 'redux-cube/lib/remote/fetch'`
    * Use fetch API, based on [hifetch](https://www.npmjs.com/package/hifetch)
* `import { middleware } from 'redux-cube/lib/remote/axios'`
    * Use XHR API, a wrapper of [redux-axios-middleware](https://www.npmjs.com/package/redux-axios-middleware)

### redux-cube/lib/notify

* `import { reducers, Notify } from 'redux-cube/lib/notify'`
* Alternative or wrapper of [react-notification-system-redux](https://www.npmjs.com/package/react-notification-system-redux) / [react-redux-toastr](https://www.npmjs.com/package/react-redux-toastr)

### redux-cube/lib/loading

* `import { middleware, Loading } from 'redux-cube/lib/loading'`
* Wrapper of [react-block-ui](https://www.npmjs.com/package/react-block-ui)

### redux-cube/lib/track

* `import { middleware } from 'redux-cube/lib/track'`
* `import bugSnag from 'redux-cube/lib/track/bugSnag'`
* `import googleAnalytics from 'redux-cube/lib/track/googleAnalytics'`
* Alternative or complement to [redux-beacon](https://www.npmjs.com/package/redux-beacon), [redux-raven-middleware](https://www.npmjs.com/package/redux-raven-middleware) / [raven-for-redux](https://www.npmjs.com/package/raven-for-redux), [redux-catch](https://www.npmjs.com/package/redux-catch)

## Built-in Wrapped Packages

* [react-redux](https://www.npmjs.com/package/react-redux)
* [reselect](https://www.npmjs.com/package/reselect)
* [flux-standard-action](https://www.npmjs.com/package/flux-standard-action)
* [redux-actions](https://www.npmjs.com/package/redux-actions)
* [topologically-combine-reducers](https://www.npmjs.com/package/topologically-combine-reducers)
* [redux-logger](https://www.npmjs.com/package/redux-logger)
* [redux-thunk](https://www.npmjs.com/package/redux-thunk)
* [redux-promise-middleware](https://www.npmjs.com/package/redux-promise-middleware)
* [redux-debounced](https://www.npmjs.com/package/redux-debounced)
* [redux-observable](https://www.npmjs.com/package/redux-observable)
* [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension#1-with-redux)

## Optional Built-in Wrapped Packages

* [redux-persist](https://www.npmjs.com/package/redux-persist)
* [react-router v4+](https://reacttraining.com/react-router/) + [react-router-redux v5+](https://github.com/reacttraining/react-router/tree/master/packages/react-router-redux)
* [react-router v3](https://github.com/ReactTraining/react-router/tree/v3/docs) + [react-router-redux v4](https://github.com/reactjs/react-router-redux)
* [immutability-helper](https://www.npmjs.com/package/immutability-helper)
* [redux-immutable](https://www.npmjs.com/package/redux-immutable) + [immutable](https://www.npmjs.com/package/immutable)
* [redux-axios-middleware](https://www.npmjs.com/package/redux-axios-middleware)
* [react-block-ui](https://www.npmjs.com/package/react-block-ui)
* [react-notification-system-redux](https://www.npmjs.com/package/react-notification-system-redux)
* [react-redux-toastr](https://www.npmjs.com/package/react-redux-toastr)

## Non-wrapped Recommended Packages

* [normalizr](https://www.npmjs.com/package/normalizr)
* [redux-optimistic-ui](https://www.npmjs.com/package/redux-optimistic-ui)
* [localforage](https://www.npmjs.com/package/localforage)
* [redux-form](https://redux-form.com/)
* [redux-undo](https://www.npmjs.com/package/redux-undo)
* [react-intl-redux](https://www.npmjs.com/package/react-intl-redux)
* [redux-auth-wrapper](https://www.npmjs.com/package/redux-auth-wrapper)
* [redux-test-utils](https://www.npmjs.com/package/redux-test-utils) + [enzyme-redux](https://www.npmjs.com/package/enzyme-redux)
* [redux-testkit](https://www.npmjs.com/package/redux-testkit)

## Examples

* "react-redux-app" and "react-redux-router-app" in [webcube project's initial structure](./examples/webcube-initial-structure/)
* [webcube's TodoMVC example](./examples/webcube-todo-app/)
