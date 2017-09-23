
# webcube

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url]
[![Test Coverage][coveralls-image]][coveralls-url]

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/webcube.svg
[nodei-image]: https://nodei.co/npm/webcube.png?downloads=true
[npm-url]: https://npmjs.org/package/webcube
[travis-image]: https://img.shields.io/travis/dexteryy/webcube-example/master.svg
[travis-url]: https://travis-ci.org/dexteryy/webcube-example
[dep-image]: https://david-dm.org/dexteryy/webcube.svg
[dep-url]: https://david-dm.org/dexteryy/webcube
[coveralls-image]: https://img.shields.io/coveralls/dexteryy/webcube-example/master.svg
[coveralls-url]: https://coveralls.io/r/dexteryy/webcube-example?branch=master

![iOS Safari](https://github.com/alrra/browser-logos/raw/master/src/safari-ios/safari-ios_48x48.png) | ![Android WebView](https://github.com/alrra/browser-logos/raw/master/src/android/android_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- |
iOS 7+ ✔ | Android 4+ ✔ | 11+ ✔ |

webcube is a continuously updated JS infrastructure for modern [Universal JS]() web app/site and [static web]()

 It simplifies the integration with the latest cutting-edge JS technology and tools, automatically provides the modern software engineering environment, architecture, workflow and best practices. It also can lower the barrier of starting a new web app project.

## Features

* TODO

## Integration

* [React](http://facebook.github.io/react/) ([Router](https://www.npmjs.com/package/react-router) [TODO: v4] + [Helmet](https://www.npmjs.com/package/react-helmet) + ...)
* [Redux](http://redux.js.org/) ([FSA](https://www.npmjs.com/package/redux-actions) + [Reselect](https://www.npmjs.com/package/reselect) + [Redux Actions](https://www.npmjs.com/package/redux-actions) + [Redux Thunk](https://github.com/gaearon/redux-thunk) / [Redux Observable](https://redux-observable.js.org/) [TODO] + ...)
  * [Redux Logger](https://github.com/fcomb/redux-logger) + [Redux DevTools](https://github.com/gaearon/redux-devtools) + [Reactotron](https://github.com/infinitered/reactotron) [TODO]
* [lokka](https://github.com/kadirahq/lokka) [TODO] / [React Apollo](http://dev.apollodata.com/react/) [TODO]
* [Webpack](http://webpack.github.io/docs/) [TODO: v2]
  * [Babel v6](babeljs.io) ([babel-preset-env](https://github.com/babel/babel-preset-env) + [Object rest spread](http://babeljs.io/docs/plugins/transform-object-rest-spread/) + [Class Properties](http://babeljs.io/docs/plugins/transform-class-properties/) + [Decorator](https://www.npmjs.com/package/babel-plugin-transform-decorators-legacy) + [fast-async](https://github.com/MatAtBread/fast-async) + [JSX + Flow](http://babeljs.io/docs/plugins/preset-react/)) + [React Transform](https://github.com/gaearon/babel-plugin-react-transform) ([hmr](https://github.com/gaearon/react-transform-hmr) + [catch-errors](https://github.com/gaearon/react-transform-catch-errors) + [render-visualizer](https://github.com/spredfast/react-transform-render-visualizer))
  * [CSS in JS](https://speakerdeck.com/vjeux/react-css-in-js) ([styled-components](https://github.com/styled-components/styled-components) [TODO] / [Radium](https://github.com/FormidableLabs/radium)), [CSS Modules](https://github.com/css-modules/css-modules) + [PostCSS](https://github.com/postcss/postcss) ([CSSNext](http://cssnext.io/)) / [SCSS](https://www.npmjs.com/package/sass-loader) ([node-sass](https://www.npmjs.com/package/node-sass)) + [Autoprefixer](https://github.com/postcss/autoprefixer) + [CSSNano](http://cssnano.co/options/)
  * [imagemin](https://www.npmjs.com/package/image-webpack-loader) ([gifsicle](https://github.com/kevva/imagemin-gifsicle) + [mozjpeg](https://github.com/imagemin/imagemin-mozjpeg) + [optipng](https://github.com/kevva/imagemin-optipng) + [svgo](https://github.com/kevva/imagemin-svgo) + [pngquant](https://pngquant.org/)) + [url-loader](https://www.npmjs.com/package/url-loader) / [file-loader](https://www.npmjs.com/package/file-loader)
  * [ExtractTextPlugin](https://www.npmjs.com/package/extract-text-webpack-plugin) + [AssetsPlugin](https://www.npmjs.com/package/assets-webpack-plugin)
  * [webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html) / [webpack-hot-middleware](https://www.npmjs.com/package/webpack-hot-middleware) + [webpack-dashboard](https://github.com/FormidableLabs/webpack-dashboard)
* [Gulp](http://gulpjs.com/)
  * [ESLint v2](http://eslint.org/) ([eslint-config-webcube](https://github.com/dexteryy/eslint-config-webcube) + [Prettier](https://github.com/prettier/prettier)) + TypeScript [TODO] / [Flow](flowtype.org) [TODO] + [StyleLint](http://stylelint.io/) [TODO]
  * [UglifyJS v2](https://github.com/mishoo/UglifyJS2) / [uglify-es](https://github.com/mishoo/UglifyJS2/tree/harmony) [TODO] / [Babili](https://github.com/babel/babili) [TODO] + [Prepack](https://prepack.io/) [TODO]
  * [HTMLHint](https://github.com/yaniswang/HTMLHint) + [HTMLMinifier](https://github.com/kangax/html-minifier) + [gulp-inline-source](https://www.npmjs.com/package/gulp-inline-source/) + [gulp-replace](https://www.npmjs.com/package/gulp-replace/)
* [Jest](https://facebook.github.io/jest/) [TODO] + [Enzyme](http://airbnb.io/enzyme/) [TODO] / [Nightmare](http://nightmarejs.org/) ([electron-prebuilt](https://www.npmjs.com/package/electron-prebuilt)), AVA [TODO] / [Mocha](http://mochajs.org/) & [Chai](http://chaijs.com/) + [ChromeHeadless](https://github.com/karma-runner/karma-chrome-launcher/pull/111) [TODO])
* [dotenv](https://www.npmjs.com/package/dotenv) + [Plop](https://github.com/amwmedia/plop) ([Handlebar](http://handlebarsjs.com/) + [Inquirer](https://www.npmjs.com/package/inquirer)) + [Commitizen](https://www.npmjs.com/package/commitizen) ([cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog)) + [Husky](https://github.com/typicode/husky) + [EditorConfig](http://editorconfig.org/)
* [AWS-SDK-JS](https://github.com/aws/aws-sdk-js) / [Aliyun-SDK-JS](https://github.com/aliyun-UED/aliyun-sdk-js)
* [Wechat JS SDK](https://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html) + [Google Tag Manager](https://developers.google.com/tag-manager/) / [Google Analytics](https://www.google.com/analytics/analytics/) / [Baidu Tongji](http://tongji.baidu.com/) + [GrowingIO](https://www.growingio.com) / [ZhugeIO](https://zhugeio.com)

Boilerplate as [library](https://github.com/dexteryy/webcube/blob/master/src/boilerplate/):

- `AppSkeleton` - [exmaple A](https://github.com/dexteryy/webcube/blob/master/templates/app/entries/react/index.js), [example B](https://github.com/dexteryy/webcube-example/blob/master/templates/app/entries/react-redux-router/index.js)
- `createReactRoot` - [exmaple](https://github.com/dexteryy/webcube/blob/master/templates/app/entries/react/index.js)
- `createReactRouterRoot` - [exmaple](https://github.com/dexteryy/webcube/blob/master/templates/app/entries/react-router/index.js)
- `createReduxRoot` - [exmaple](https://github.com/dexteryy/webcube/blob/master/templates/app/entries/react-redux/index.js)
- `createReduxRouterRoot` - [exmaple](https://github.com/dexteryy/webcube/blob/master/templates/app/entries/react-redux-router/index.js)
- `stateSelector` - [exmaple](https://github.com/dexteryy/webcube/blob/master/templates/app/entries/react-redux-router/main/containers/Home.jsx)
- `actionDispatcher` - [exmaple](https://github.com/dexteryy/webcube/blob/master/templates/app/entries/react-redux-router/main/containers/Home.jsx)
- ...

## How to Create a New Web App

#### For project as a standalone repo

Step 0: copy [webcube-starter-for-standalone-repo/package.json]() into your repo:

```bash
mkdir my-project
cd my-project
curl https://raw.githubusercontent.com/dexteryy/webcube/master/webcube-starter-for-standalone-repo/package.json > package.json
```

Step 1: install dependencies

```bash
yarn
```

Step 2: scaffold

```bash
npm run webcube:setup
```

Step 3: create entry point

```bash
npm run new
```

#### For project in a monorepo (include webcube director)

Step 0: create a monorepo based on webcube's monorepo

```bash
git clone git@github.com:dexteryy/webcube.git your-monorepo
cd your-monorepo/
rm -rf .git/ ./*-example-* ./*-starter-*
```
Step 0.5: copy [webcube-starter-for-project-in-monorepo/package.json]() into your director in monorepo

```bash
mkdir my-project
cd my-project
curl https://raw.githubusercontent.com/dexteryy/webcube/master/webcube-starter-for-project-in-monorepo/package.json > package.json
```

Step 1: install dependencies in monorepo's root

```bash
cd ../
yarn
cd -
```

Step 2: scaffold

```bash
npm run webcube:setup
```

Step 3: create entry point

```bash
npm run new
```


## How to Build the Web App

```
npm run build
```

> Project-defined build scripts and config files:
>
> * [`webcube-example/package.json`][package.json]
> * [`webcube-example/configs/gulpfile.js`][custom.gulpfile]
> * [`webcube-example/configs/webpack.config.js`][custom.webpack.config]

> Underlying build scripts and config files:
>
> * [`webcube/src/configs/gulpfile.js`][gulpfile]
> * [`webcube/src/configs/webpack.config.js`][webpack.config]

Open in the browser

```
open http://localhost:8000
```

Manually start/stop static web server:

```
npm run start:staticserver
npm run stop:staticserver
```

## How to Develop the Web App

For faster recompiling ([webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html)):

```
npm run dev
```
or
```
npm run dev:dashboard
```

Enable automatic refreshing:

```
LIVE_MODE=refresh npm run dev:dashboard
```

Enable HMR (Hot Module Replacement):

```
LIVE_MODE=hmr npm run dev:dashboard
```

## How to Generate New Code

Use micro-generator:

```
npm run new
```

* `npm run new entry:react` - Add a new entry point (with React)
* `npm run new entry:react-router` - Add a new entry point (with React + Router)
* `npm run new entry:react-redux` - Add a new entry point (with React + Redux)
* `npm run new entry:react-redux-router` - Add a new entry point (with React + Redux + Router)
* `npm run new demo:react` - Add a new entry point for demo (with React)
* `npm run new demo:react-router` - Add a new entry point for demo (with React + Router)
* `npm run new demo:react-redux` - Add a new entry point for demo (with React + Redux)
* `npm run new demo:react-redux-router` - Add a new entry point for demo (with React + Redux + Router)

Project-defined generator scripts:

* [`webcube-example/configs/plopfile.js`][custom.plopfile]

Underlying generator scripts:

* [`webcube/src/configs/plopfile.js`][plopfile]

## How to Test the Web App

WIP

<!-- Functional tests:

* NodeJS + [Mocha](http://mochajs.org/) + [Nightmare](http://nightmarejs.org/)
* Naming convention: `**/*.spec.js`

Unit tests:

* [Karma](https://karma-runner.github.io/) + [PhantomJS](https://www.npmjs.com/package/karma-phantomjs-launcher)/[Chrome](https://www.npmjs.com/package/karma-chrome-launcher) + [Mocha](http://mochajs.org/)
* Naming convention: `**/*.test.js`
* Example: [webcube-example/app/example-app/effects/components/WelcomeBox/tests/index.test.js](https://github.com/dexteryy/webcube-example/blob/master/app/example-app/effects/components/WelcomeBox/tests/index.test.js)

Manually run functional tests (run automatically after building):

```
npm run test:quick
```

Manually run unit tests:

```
npm run test:unit
```

Manually run unit tests and functional tests:

```
npm run test
```

Manually run functional tests for web app in the cloud (after [deployment](#how-to-deploy-the-web-app)):

```
npm run test:cloud
```


> NOTE: Spec file of new entry point or new component can be automatically added by [micro-generator](#how-to-generate-new-code)

Karma configuration:

* [`webcube/src/configs/karma.conf.js`][karmaconf] -->

#### Code Style

WIP

<!-- Manually run static checking:

```
npm run lint
```

See the [example configuration](https://github.com/dexteryy/webcube-example/#code-style) -->

## How to Deploy the Web App

### Static Web Mode

Build for static cloud environment (e.g. [AWS S3](https://aws.amazon.com/s3/), [Aliyun OSS](https://www.aliyun.com/product/oss/), CDN), than upload `build/public/` to the cloud:

```
npm run deploy:staticweb
```

For staging environment:

```
npm run deploy:staging:staticweb
```

Before deployment, all environment variables that names begin with `WEBCUBE_DEPLOY_STATIC_` must be configured in [`env.config`][custom.env.sample.config].

For example, you must choose a static cloud provider in [`env.config`][custom.env.sample.config]:

```ini
WEBCUBE_DEPLOY_STATIC_CLOUD=oss
```

```ini
WEBCUBE_DEPLOY_STATIC_CLOUD=s3
```

### Static Server Mode

```
npm run deploy:staticserver
```

Underlying deployment scripts and adapters:

* [`webcube/src/configs/gulpfile.js`][gulpfile]
* [`webcube/src/utils/deploy/*.js`](https://github.com/dexteryy/webcube/blob/master/src/utils/deploy/)

[package.json]: https://github.com/dexteryy/webcube-example/blob/master/package.json
[env.sample.config]: https://github.com/dexteryy/webcube/blob/master/src/configs/env.sample.config
[custom.env.sample.config]: https://github.com/dexteryy/webcube-example/blob/master/configs/env.sample.config
[webpack.config]: https://github.com/dexteryy/webcube/blob/master/src/configs/webpack.config.js
[custom.webpack.config]: https://github.com/dexteryy/webcube-example/blob/master/configs/webpack.config.js
[gulpfile]: https://github.com/dexteryy/webcube/blob/master/src/configs/gulpfile.js
[custom.gulpfile]: https://github.com/dexteryy/webcube-example/blob/master/configs/gulpfile.js
[plopfile]: https://github.com/dexteryy/webcube/blob/master/src/configs/plopfile.js
[custom.plopfile]: https://github.com/dexteryy/webcube-example/blob/master/configs/plopfile.js
[karmaconf]: https://github.com/dexteryy/webcube/blob/master/src/configs/karma.conf.js
[gitignore]: https://github.com/dexteryy/webcube-example/blob/master/.gitignore
