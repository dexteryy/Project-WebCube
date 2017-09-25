
# webcube

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url]
[![Test Coverage][coveralls-image]][coveralls-url] -->

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/webcube.svg
[nodei-image]: https://nodei.co/npm/webcube.png?downloads=true
[npm-url]: https://npmjs.org/package/webcube
<!-- [travis-image]: https://img.shields.io/travis/dexteryy/webcube-example/master.svg
[travis-url]: https://travis-ci.org/dexteryy/webcube-example
[dep-image]: https://david-dm.org/dexteryy/webcube.svg
[dep-url]: https://david-dm.org/dexteryy/webcube
[coveralls-image]: https://img.shields.io/coveralls/dexteryy/webcube-example/master.svg
[coveralls-url]: https://coveralls.io/r/dexteryy/webcube-example?branch=master -->

![iOS Safari](https://github.com/alrra/browser-logos/raw/master/src/safari-ios/safari-ios_48x48.png) | ![Android WebView](https://github.com/alrra/browser-logos/raw/master/src/android/android_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- |
iOS 7+ ✔ | Android 4+ ✔ | 11+ ✔ |

webcube is a continuously updated JS infrastructure for modern [Universal JS](https://github.com/dexteryy/spellbook-of-modern-webdev) web app/site and [static web](https://github.com/dexteryy/spellbook-of-modern-webdev)

 It simplifies the integration with the latest cutting-edge JS technology and tools, automatically provides the modern software engineering environment, architecture, workflow and best practices. It also can lower the barrier of starting a new web app project.

## Get Started

#### Usage #1: Create a Web Project As a Standalone Repo

Step 0: copy [webcube-starter-for-standalone-repo/package.json](https://github.com/dexteryy/Project-WebCube/blob/master/webcube-starter-for-standalone-repo/package.json) into your repo:

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

#### Usage #2: Create a Web Project in a Monorepo

Pre-task: [create a monorepo based on webcube for web development](https://github.com/dexteryy/Project-WebCube)

Step 0: create a monorepo based on webcube's monorepo

```bash
git clone git@github.com:dexteryy/webcube.git your-monorepo
cd your-monorepo/
rm -rf .git/ ./*-example-* ./*-starter-*
```
Step 0.5: copy [webcube-starter-for-project-in-monorepo/package.json](https://github.com/dexteryy/Project-WebCube/blob/master/webcube-starter-for-project-in-monorepo/package.json) into your directory in monorepo

```bash
mkdir my-project
cd my-project
curl https://raw.githubusercontent.com/dexteryy/webcube/master/webcube-starter-for-project-in-monorepo/package.json > package.json
```

Step #1: install dependencies in monorepo's root

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
  * [ESLint v2](http://eslint.org/) ([eslint-config-webcube](https://github.com/dexteryy/Project-WebCube/tree/master/eslint-config-webcube) + [Prettier](https://github.com/prettier/prettier)) + TypeScript [TODO] / [Flow](flowtype.org) [TODO] + [StyleLint](http://stylelint.io/) [TODO]
  * [UglifyJS v2](https://github.com/mishoo/UglifyJS2) / [uglify-es](https://github.com/mishoo/UglifyJS2/tree/harmony) [TODO] / [Babili](https://github.com/babel/babili) [TODO] + [Prepack](https://prepack.io/) [TODO]
  * [HTMLHint](https://github.com/yaniswang/HTMLHint) + [HTMLMinifier](https://github.com/kangax/html-minifier) + [gulp-inline-source](https://www.npmjs.com/package/gulp-inline-source/) + [gulp-replace](https://www.npmjs.com/package/gulp-replace/)
* [Jest](https://facebook.github.io/jest/) [TODO] + [Enzyme](http://airbnb.io/enzyme/) [TODO] / [Nightmare](http://nightmarejs.org/) ([electron-prebuilt](https://www.npmjs.com/package/electron-prebuilt)), AVA [TODO] / [Mocha](http://mochajs.org/) & [Chai](http://chaijs.com/) + [ChromeHeadless](https://github.com/karma-runner/karma-chrome-launcher/pull/111) [TODO])
* [dotenv](https://www.npmjs.com/package/dotenv) + [Plop](https://github.com/amwmedia/plop) ([Handlebar](http://handlebarsjs.com/) + [Inquirer](https://www.npmjs.com/package/inquirer)) + [Commitizen](https://www.npmjs.com/package/commitizen) ([cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog)) + [Husky](https://github.com/typicode/husky) + [EditorConfig](http://editorconfig.org/)
* [AWS-SDK-JS](https://github.com/aws/aws-sdk-js) / [Aliyun-SDK-JS](https://github.com/aliyun-UED/aliyun-sdk-js)
* [Wechat JS SDK](https://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html) + [Google Tag Manager](https://developers.google.com/tag-manager/) / [Google Analytics](https://www.google.com/analytics/analytics/) / [Baidu Tongji](http://tongji.baidu.com/) + [GrowingIO](https://www.growingio.com) / [ZhugeIO](https://zhugeio.com)

## Features

WIP

### Philosophy

[Slides (in Chinese)](https://speakerdeck.com/dexteryy/understanding-modern-web-development-at-jsconf-china-2017-zhong-wen) @ [JSConf CN 2017](http://2017.jsconf.cn/#schedule)

WIP

## How to develop

For faster recompiling ([webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html)):

```
npm run dev
```
or
```
npm run dev:dashboard
```

Enable automatically refreshing:

```
LIVE_MODE=refresh npm run dev:dashboard
```

Enable HMR (Hot Module Replacement):

```
LIVE_MODE=hmr npm run dev:dashboard
```

## How to test

WIP

## Code quality

WIP

## How to deploy

#### Static Web Mode

> NOTE: for static cloud environment (e.g. [AWS S3](https://aws.amazon.com/s3/), [Aliyun OSS](https://www.aliyun.com/product/oss/), Cloudflare, ...)

```
npm run deploy:staticweb
```

For staging environment:

```
npm run deploy:staging:staticweb
```

Environment variables: `WEBCUBE_DEPLOY_STATIC_*`

For example,

```ini
WEBCUBE_DEPLOY_STATIC_CLOUD=oss
```

```ini
WEBCUBE_DEPLOY_STATIC_CLOUD=s3
```

#### Static Server Mode

```
npm run deploy:staticserver
```

#### Server-side Rendering Mode

WIP

#### Packaged App Mode

WIP
