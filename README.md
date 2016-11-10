
# WebCube

Out-of-the-box configuration and toolkits for Static/Universal Web App (ES6 + React + Redux + ...)

> * webcube-cli: TODO
> * Example App: https://github.com/dexteryy/webcube-example/

## Features

* TODO

## Integration

* [React](http://facebook.github.io/react/) ([Router](https://www.npmjs.com/package/react-router) + [Helmet](https://www.npmjs.com/package/react-helmet) + [CSS Modules](https://www.npmjs.com/package/react-css-modules) + ...) + [Redux](http://redux.js.org/) ([FSA](https://www.npmjs.com/package/redux-actions) + [Reselect](https://www.npmjs.com/package/reselect) + [Logger](https://github.com/fcomb/redux-logger) + [DevTools](https://github.com/gaearon/redux-devtools) + ...)
* [Webpack](http://webpack.github.io/docs/)
  * [Babel v6](babeljs.io) ([ES2015 + ES2016](https://babeljs.io/docs/learn-es2015/) + [Object rest spread](http://babeljs.io/docs/plugins/transform-object-rest-spread/) + [Class Properties](http://babeljs.io/docs/plugins/transform-class-properties/) + [Legacy Decorator](https://www.npmjs.com/package/babel-plugin-transform-decorators-legacy) + [async/await to Promise](https://github.com/marten-de-vries/kneden) + [JSX + Flow](http://babeljs.io/docs/plugins/preset-react/)) + [React Transform](https://github.com/gaearon/babel-plugin-react-transform) ([hmr](https://github.com/gaearon/react-transform-hmr) + [catch-errors](https://github.com/gaearon/react-transform-catch-errors) + [render-visualizer](https://github.com/spredfast/react-transform-render-visualizer))
  * [CSS in JS](https://speakerdeck.com/vjeux/react-css-in-js) ([Radium](https://github.com/FormidableLabs/radium)), [CSS Modules](https://github.com/css-modules/css-modules) + [SCSS](https://www.npmjs.com/package/sass-loader) ([node-sass](https://www.npmjs.com/package/node-sass)) + [PostCSS](https://github.com/postcss/postcss) ([CSSNext](http://cssnext.io/)) + [Autoprefixer](https://github.com/postcss/autoprefixer) + [CSSNano](http://cssnano.co/options/)
  * [imagemin](https://www.npmjs.com/package/image-webpack-loader) ([gifsicle](https://github.com/kevva/imagemin-gifsicle) + [jpegtran](https://github.com/kevva/imagemin-jpegtran) + [optipng](https://github.com/kevva/imagemin-optipng) + [svgo](https://github.com/kevva/imagemin-svgo) + [pngquant](https://pngquant.org/)) + [url-loader](https://www.npmjs.com/package/url-loader) / [file-loader](https://www.npmjs.com/package/file-loader)
  * [ExtractTextPlugin](https://www.npmjs.com/package/extract-text-webpack-plugin) + [AssetsPlugin](https://www.npmjs.com/package/assets-webpack-plugin)
  * [webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html) / [webpack-hot-middleware](https://www.npmjs.com/package/webpack-hot-middleware) + [webpack-dashboard](https://github.com/FormidableLabs/webpack-dashboard)
* [Gulp](http://gulpjs.com/)
  * [Flow](flowtype.org) + [ESLint v2](http://eslint.org/) ([babel](https://www.npmjs.com/package/babel-eslint) + [flow-vars](https://www.npmjs.com/package/eslint-plugin-flow-vars) + [react](https://www.npmjs.com/package/eslint-plugin-react))
  * [StyleLint](http://stylelint.io/) / [SASS-Lint](https://github.com/sasstools/sass-lint) + [CSSComb](http://csscomb.com/) ([SMACSS](https://smacss.com/book/formatting)-like property order)
  * [webpack-stream](https://www.npmjs.com/package/webpack-stream/) + [UglifyJS2](https://github.com/mishoo/UglifyJS2)
  * [HTMLHint](https://github.com/yaniswang/HTMLHint) + [HTMLMinifier](https://github.com/kangax/html-minifier) + [gulp-inline-source](https://www.npmjs.com/package/gulp-inline-source/) + [gulp-replace](https://www.npmjs.com/package/gulp-replace/)
* [Karma](https://karma-runner.github.io/) ([PhantomJS](http://phantomjs.org/)) / [Nightmare](http://nightmarejs.org/) ([electron-prebuilt](https://www.npmjs.com/package/electron-prebuilt)) + [Mocha](http://mochajs.org/) + [Chai](http://chaijs.com/)
* [dotenv](https://www.npmjs.com/package/dotenv) + [Plop](https://github.com/amwmedia/plop) ([Handlebar](http://handlebarsjs.com/) + [Inquirer](https://www.npmjs.com/package/inquirer)) + [Commitizen](https://www.npmjs.com/package/commitizen) ([cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog)) + [Ghooks](https://www.npmjs.com/package/ghooks) + [EditorConfig](http://editorconfig.org/)
* [AWS-SDK-JS](https://github.com/aws/aws-sdk-js) / [Aliyun-SDK-JS](https://github.com/aliyun-UED/aliyun-sdk-js)

Boilerplate as [library](https://github.com/dexteryy/webcube/blob/master/src/boilerplate/AppSkeleton.js):

- `AppSkeleton` - [exmaple A](https://github.com/dexteryy/webcube/blob/master/templates/app/entries/react/index.js), [example B](https://github.com/dexteryy/webcube-example/blob/master/templates/app/entries/react-redux-router/index.js)
- `createReactRouterRoot` - [exmaple](https://github.com/dexteryy/webcube/blob/master/templates/app/entries/react-router/index.js)
- `createReduxRoot` - [exmaple](https://github.com/dexteryy/webcube/blob/master/templates/app/entries/react-redux/index.js)
- `createReduxRouterRoot` - [exmaple](https://github.com/dexteryy/webcube/blob/master/templates/app/entries/react-redux-router/index.js)
- `stateSelector` - [exmaple](https://github.com/dexteryy/webcube/blob/master/templates/app/entries/react-redux-router/containers/Home.jsx)
- `actionDispatcher` - [exmaple](https://github.com/dexteryy/webcube/blob/master/templates/app/entries/react-redux-router/containers/Home.jsx)
- ...

## How to Create a New Web App

#### Step 1

Use webcube-cli (TODO) or imitate the [example app](https://github.com/dexteryy/webcube-example/) to create the minimal structure and configure files:

- **configs/** - Project-defined configuration files and build scripts
  - `env.sample.config` - Project-defined template file for [env.config][custom.env.sample.config]
- **app/** - All source code for web app (shared between client-side and server-side), including JS, CSS and assets
  - **entries/** - Multiple entry points
- **staticweb/** - For static web deployment or testing
- `package.json` - Minimal dependencies and npm scripts based on webcube, see [webcube-example's package.json](https://github.com/dexteryy/webcube-example/blob/master/package.json)
- `env.config` - Project-defined configuration options for webcube and custom scripts

#### Step 2

Install dependencies:

```bash
npm install
```

For users living in China:

Use `cnpm install`

```bash
alias cnpm="npm --registry=https://registry.npm.taobao.org \
--cache=$HOME/.npm/.cache/cnpm \
--disturl=https://npm.taobao.org/dist \
--userconfig=$HOME/.cnpmrc"
```

Use mirrors:

```bash
export NVM_NODEJS_ORG_MIRROR="http://npm.taobao.org/mirrors/node"
export SASS_BINARY_SITE="https://npm.taobao.org/mirrors/node-sass"
export PHANTOMJS_CDNURL="http://npm.taobao.org/mirrors/phantomjs"
export ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
export CHROMEDRIVER_CDNURL="http://npm.taobao.org/mirrors/chromedriver"
```

#### Step 3

Create an entry point with [one command](#how-to-generate-new-code):

* `npm run new entry:react`
* `npm run new entry:react-router`
* `npm run new entry:react-redux`
* `npm run new entry:react-redux-router`

## How to Build the Web App

```
npm run build
```

or

```
NODE_ENV=production npm run build
```

> Project-defined build scripts and config files:
>
> * [`webcube-example/package.json`][package.json]
> * [`webcube-example/configs/gulpfile.babel.js`][custom.gulpfile]
> * [`webcube-example/configs/webpack.config.babel.js`][custom.webpack.config]

> Underlying build scripts and config files:
>
> * [`webcube/src/configs/gulpfile.babel.js`][gulpfile]
> * [`webcube/src/configs/webpack.default.config.babel.js`][webpack.config]

Open in the browser

```
open http://localhost:8000/app/
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

* [`webcube-example/configs/plopfile.babel.js`][custom.plopfile]

Underlying generator scripts:

* [`webcube/src/configs/plopfile.babel.js`][plopfile]

## How to Test the Web App

Functional tests:

* NodeJS + [Mocha](http://mochajs.org/) + [Nightmare](http://nightmarejs.org/)
* Naming convention: `**/*.spec.js`
* Example: [webcube-example/app/entries/example-app/tests/index.spec.js](https://github.com/dexteryy/webcube-example/blob/master/app/entries/example-app/tests/index.spec.js)

Unit tests:

* [Karma](https://karma-runner.github.io/) + [PhantomJS](https://www.npmjs.com/package/karma-phantomjs-launcher)/[Chrome](https://www.npmjs.com/package/karma-chrome-launcher) + [Mocha](http://mochajs.org/)
* Naming convention: `**/*.test.js`
* Example: [webcube-example/app/components/WelcomeBox/tests/index.test.js](https://github.com/dexteryy/webcube-example/blob/master/app/components/WelcomeBox/tests/index.test.js)

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

* [`webcube/src/configs/karma.conf.babel.js`][karmaconf]

#### Code Style

Manually run static checking:

```
npm run lint
```

See the [example configuration](https://github.com/dexteryy/webcube-example/#code-style)

## How to Deploy the Web App

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

Underlying deployment scripts and adapters:

* [`webcube/src/configs/gulpfile.babel.js`][gulpfile]
* [`webcube/src/utils/deploy/*.js`](https://github.com/dexteryy/webcube/blob/master/src/utils/deploy/)

[package.json]: https://github.com/dexteryy/webcube-example/blob/master/package.json
[env.sample.config]: https://github.com/dexteryy/webcube/blob/master/src/configs/env.sample.config
[custom.env.sample.config]: https://github.com/dexteryy/webcube-example/blob/master/configs/env.sample.config
[webpack.config]: https://github.com/dexteryy/webcube/blob/master/src/configs/webpack.default.config.babel.js
[custom.webpack.config]: https://github.com/dexteryy/webcube-example/blob/master/configs/webpack.config.babel.js
[gulpfile]: https://github.com/dexteryy/webcube/blob/master/src/configs/gulpfile.babel.js
[custom.gulpfile]: https://github.com/dexteryy/webcube-example/blob/master/configs/gulpfile.babel.js
[plopfile]: https://github.com/dexteryy/webcube/blob/master/src/configs/plopfile.babel.js
[custom.plopfile]: https://github.com/dexteryy/webcube-example/blob/master/configs/plopfile.babel.js
[karmaconf]: https://github.com/dexteryy/webcube/blob/master/src/configs/karma.conf.babel.js
[gitignore]: https://github.com/dexteryy/webcube-example/blob/master/.gitignore
