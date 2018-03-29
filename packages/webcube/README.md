
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
<!--
[travis-image]: https://img.shields.io/travis/dexteryy/webcube-example/master.svg
[travis-url]: https://travis-ci.org/dexteryy/webcube-example
[dep-image]: https://david-dm.org/dexteryy/webcube.svg
[dep-url]: https://david-dm.org/dexteryy/webcube
-->

webcube is a continuously updated JS infrastructure for modern Universal JS web app/site and static web.

It is part of my effort to simplify the usage of all 'mainstream' tools and best practices mentioned in the [Spellbook of Modern Web Dev](https://github.com/dexteryy/spellbook-of-modern-webdev/).

 It can automatically provides the modern software engineering environment, architecture, workflow and best practices. It also can lower the barrier of starting a new web app project.


<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->
<!-- code_chunk_output -->

* [Get Started](#get-started)
	* [Usage #1: create a web project as a standalone repo](#usage-1-create-a-web-project-as-a-standalone-repo)
	* [Usage #2: create a web project in a monorepo](#usage-2-create-a-web-project-in-a-monorepo)
* [How To Develop](#how-to-develop)
	* [Dev Server](#dev-server)
	* [Full Build](#full-build)
	* [View Result](#view-result)
* [How To Test (WIP)](#how-to-test-wip)
* [How To Deploy](#how-to-deploy)
		* [Static Web Mode](#static-web-mode)
		* [Static Server Mode](#static-server-mode)
		* [Server-side Rendering Mode (WIP)](#server-side-rendering-mode-wip)
		* [Packaged App Mode (WIP)](#packaged-app-mode-wip)
* [Integration](#integration)
* [Features (WIP)](#features-wip)
* [Philosophy (WIP)](#philosophy-wip)

<!-- /code_chunk_output -->


## Get Started

### Usage #1: create a web project as a standalone repo

Step 0:

Copy [webcube-starter-for-standalone-repo/package.json](https://github.com/dexteryy/Project-WebCube/blob/master/starters/webcube-app-as-standalone/package.json) into your repo

```bash
mkdir my-project
cd my-project && curl https://raw.githubusercontent.com/dexteryy/Project-WebCube/master/starters/webcube-app-as-standalone/package.json > package.json
```

Step 1:

Install dependencies

```bash
git init
npm run update
```

Step 2:

Scaffold

```bash
npm run webcube:setup
```

Step 3:

Create an entry point

```bash
npm run new
```

### Usage #2: create a web project in a monorepo

Pre-task:

Create a monorepo based on [webcube's monorepo](https://github.com/dexteryy/Project-WebCube)

```bash
git clone git@github.com:dexteryy/webcube.git your-monorepo
cd your-monorepo/
rm -rf .git examples starters yarn.lock
mkdir entries
mkdir services
git init
```

> NOTE: If you need not to fork webcube's packages, you should remove these files:
>
> ```
> rm -rf packages/*
> ```

Step 0:

Create your project as a [monorepo workspace directory](https://github.com/dexteryy/webcube/blob/master/package.json#L34)

```bash
mkdir -p entries/my-project
```

Copy [webcube-starter-for-project-in-monorepo/package.json](https://github.com/dexteryy/Project-WebCube/blob/master/starters/webcube-app-in-monorepo/package.json) into your project

```bash
cd entries/my-project && curl https://raw.githubusercontent.com/dexteryy/Project-WebCube/master/starters/webcube-app-in-monorepo/package.json > package.json
```

Edit `entries/my-project/package.json`, replace fields surrounded by angle brackets with correct configuration.

Step #1:

Install dependencies in monorepo's root

```bash
cd ../../
npm run update
cd -
```

Step 2:

Scaffold

```bash
npm run webcube:setup
```

Step 3:

Create entry point

```bash
npm run new
```

## How To Develop

### Dev Server

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

### Full Build

```bash
npm run build
```

For production environment:

```bash
NODE_ENV=production npm run build
```

### View Result

http://[WEBCUBE_DEVSERVER_HOST](https://github.com/dexteryy/Project-WebCube/blob/master/packages/webcube/templates/configs/env.sample.config#L2):[WEBCUBE_DEVSERVER_PORT](https://github.com/dexteryy/Project-WebCube/blob/master/packages/webcube/templates/configs/env.sample.config#L3)/[entrypoint](https://github.com/dexteryy/Project-WebCube/blob/master/examples/webcube-initial-structure/configs/env.sample.config#L119)


## How To Test (WIP)


## How To Deploy

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

#### Server-side Rendering Mode (WIP)


#### Packaged App Mode (WIP)


## Integration

* [React](http://facebook.github.io/react/) ([Router](https://www.npmjs.com/package/react-router) + [Helmet](https://www.npmjs.com/package/react-helmet) + ...)
* [Redux](http://redux.js.org/) ([redux-cube](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-cube))
* [lokka](https://github.com/kadirahq/lokka) [TODO] / [React Apollo](http://dev.apollodata.com/react/) [TODO]
* [Webpack](http://webpack.github.io/docs/) [TODO: v2+]
  * [Babel v6](babeljs.io) ([JSX + Flow](http://babeljs.io/docs/plugins/preset-react/) + [babel-preset-env](https://github.com/babel/babel-preset-env) + [Object rest spread](http://babeljs.io/docs/plugins/transform-object-rest-spread/) + [Class Properties](http://babeljs.io/docs/plugins/transform-class-properties/) + [Decorator](https://www.npmjs.com/package/babel-plugin-transform-decorators-legacy) + [dynamic-import](https://www.npmjs.com/package/babel-plugin-syntax-dynamic-import) + [fast-async](https://github.com/MatAtBread/fast-async) + [rewire](https://www.npmjs.com/package/babel-rewire-plugin) + [webpack-alias](https://www.npmjs.com/package/babel-plugin-webpack-alias) + [react-css-modules](https://www.npmjs.com/package/babel-plugin-react-css-modules) + [lodash](https://www.npmjs.com/package/babel-plugin-lodash) + [ramda](https://www.npmjs.com/package/babel-plugin-ramda) + ...)
  * [CSS in JS](https://speakerdeck.com/vjeux/react-css-in-js) ([styled-components](https://github.com/styled-components/styled-components) / [Radium](https://github.com/FormidableLabs/radium)), [CSS Modules](https://github.com/css-modules/css-modules) + [PostCSS](https://github.com/postcss/postcss) ([CSSNext](http://cssnext.io/)) / [SCSS](https://www.npmjs.com/package/sass-loader) ([node-sass](https://www.npmjs.com/package/node-sass)) + [Autoprefixer](https://github.com/postcss/autoprefixer) + [CSSNano](http://cssnano.co/options/)
  * [imagemin](https://www.npmjs.com/package/image-webpack-loader) ([gifsicle](https://github.com/kevva/imagemin-gifsicle) + [mozjpeg](https://github.com/imagemin/imagemin-mozjpeg) + [optipng](https://github.com/kevva/imagemin-optipng) + [svgo](https://github.com/kevva/imagemin-svgo) + [pngquant](https://pngquant.org/)) + [url-loader](https://www.npmjs.com/package/url-loader) / [file-loader](https://www.npmjs.com/package/file-loader) + ...
  * [webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html) / [webpack-hot-middleware](https://www.npmjs.com/package/webpack-hot-middleware) + [webpack-dashboard](https://github.com/FormidableLabs/webpack-dashboard)
* [ESLint](http://eslint.org/) + [Prettier](https://github.com/prettier/prettier) ([eslint-config-webcube](https://github.com/dexteryy/Project-WebCube/tree/master/packages/eslint-config-webcube))
* [Gulp](http://gulpjs.com/)
  * [babel-minify](https://github.com/babel/minify) / [uglify-es](https://github.com/mishoo/UglifyJS2/tree/harmony) + [Prepack](https://prepack.io/) [TODO]
  * [HTMLHint](https://github.com/yaniswang/HTMLHint) + [HTMLMinifier](https://github.com/kangax/html-minifier) + [gulp-inline-source](https://www.npmjs.com/package/gulp-inline-source/) + [gulp-replace](https://www.npmjs.com/package/gulp-replace/)
* [Jest](https://facebook.github.io/jest/) [TODO] + [Enzyme](http://airbnb.io/enzyme/) [TODO] + [ChromeHeadless](https://github.com/karma-runner/karma-chrome-launcher/pull/111) [TODO])
* [dotenv](https://www.npmjs.com/package/dotenv) + [Plop](https://github.com/amwmedia/plop) ([Handlebar](http://handlebarsjs.com/) + [Inquirer](https://www.npmjs.com/package/inquirer)) + [Commitizen](https://www.npmjs.com/package/commitizen) ([cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog)) + [Husky](https://github.com/typicode/husky) + [EditorConfig](http://editorconfig.org/)
* [AWS-SDK-JS](https://github.com/aws/aws-sdk-js) / [Aliyun-SDK-JS](https://github.com/aliyun-UED/aliyun-sdk-js)
* [Wechat JS SDK](https://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html) + [Google Tag Manager](https://developers.google.com/tag-manager/) / [Google Analytics](https://www.google.com/analytics/analytics/) / [Baidu Tongji](http://tongji.baidu.com/) + [GrowingIO](https://www.growingio.com) / [ZhugeIO](https://zhugeio.com)

## Features (WIP)

## Philosophy (WIP)

[Slides (in Chinese)](https://speakerdeck.com/dexteryy/understanding-modern-web-development-at-jsconf-china-2017-zhong-wen) @ [JSConf CN 2017](http://2017.jsconf.cn/#schedule)

