
# Static Web App Starter Kit

## Features

* TODO

## Integration

* [React](http://facebook.github.io/react/) ([Router](https://www.npmjs.com/package/react-router) + [Helmet](https://www.npmjs.com/package/react-helmet) + [CSS Modules](https://www.npmjs.com/package/react-css-modules) + ...) + [Redux](http://redux.js.org/) ([FSA](https://www.npmjs.com/package/redux-actions) + [Reselect](https://www.npmjs.com/package/reselect) + [Logger](https://github.com/fcomb/redux-logger) + [DevTools](https://github.com/gaearon/redux-devtools) + ...)
* [Webpack](http://webpack.github.io/docs/)
  * [Babel v6](babeljs.io) ([ES2015](https://babeljs.io/docs/learn-es2015/) + [Stage-1](http://babeljs.io/docs/plugins/preset-stage-1/) + [Legacy Decorator](https://www.npmjs.com/package/babel-plugin-transform-decorators-legacy) + [JSX + Flow](http://babeljs.io/docs/plugins/preset-react/)) + [React Transform](https://github.com/gaearon/babel-plugin-react-transform) ([hmr](https://github.com/gaearon/react-transform-hmr) + [catch-errors](https://github.com/gaearon/react-transform-catch-errors) + [render-visualizer](https://github.com/spredfast/react-transform-render-visualizer))
  * [CSS in JS](https://speakerdeck.com/vjeux/react-css-in-js) ([Radium](https://github.com/FormidableLabs/radium)), [CSS Modules](https://github.com/css-modules/css-modules) + [SCSS](https://www.npmjs.com/package/sass-loader) ([node-sass](https://www.npmjs.com/package/node-sass)) + [PostCSS](https://github.com/postcss/postcss) ([CSSNext](http://cssnext.io/)) + [Autoprefixer](https://github.com/postcss/autoprefixer) + [CSSNano](http://cssnano.co/options/)
  * [imagemin](https://www.npmjs.com/package/image-webpack-loader) ([gifsicle](https://github.com/kevva/imagemin-gifsicle) + [jpegtran](https://github.com/kevva/imagemin-jpegtran) + [optipng](https://github.com/kevva/imagemin-optipng) + [svgo](https://github.com/kevva/imagemin-svgo) + [pngquant](https://pngquant.org/)) + [url-loader](https://www.npmjs.com/package/url-loader) / [file-loader](https://www.npmjs.com/package/file-loader)
  * [ExtractTextPlugin](https://www.npmjs.com/package/extract-text-webpack-plugin) + [AssetsPlugin](https://www.npmjs.com/package/assets-webpack-plugin)
  * [webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html) / [webpack-hot-middleware](https://www.npmjs.com/package/webpack-hot-middleware)
* [Gulp](http://gulpjs.com/)
  * [Flow](flowtype.org) + [ESLint v2](http://eslint.org/) ([babel](https://www.npmjs.com/package/babel-eslint) + [flow-vars](https://www.npmjs.com/package/eslint-plugin-flow-vars) + [react](https://www.npmjs.com/package/eslint-plugin-react)) + [JSCS](http://jscs.info/)
  * [StyleLint](http://stylelint.io/) / [SASS-Lint](https://github.com/sasstools/sass-lint) + [CSSComb](http://csscomb.com/) ([SMACSS](https://smacss.com/book/formatting)-like property order)
  * [webpack-stream](https://www.npmjs.com/package/webpack-stream/) + [UglifyJS2](https://github.com/mishoo/UglifyJS2)
  * [HTMLHint](https://github.com/yaniswang/HTMLHint) + [HTMLMinifier](https://github.com/kangax/html-minifier) + [gulp-inline-source](https://www.npmjs.com/package/gulp-inline-source/) + [gulp-replace](https://www.npmjs.com/package/gulp-replace/)
* [Karma](https://karma-runner.github.io/) ([PhantomJS](http://phantomjs.org/)) / [Nightmare](http://nightmarejs.org/) ([electron-prebuilt](https://www.npmjs.com/package/electron-prebuilt)) + [Mocha](http://mochajs.org/) + [Chai](http://chaijs.com/)
* [dotenv](https://www.npmjs.com/package/dotenv) + [Plop](https://github.com/amwmedia/plop) ([Handlebar](http://handlebarsjs.com/) + [Inquirer](https://www.npmjs.com/package/inquirer)) + [Commitizen](https://www.npmjs.com/package/commitizen) ([cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog)) + [Ghooks](https://www.npmjs.com/package/ghooks) + [EditorConfig](http://editorconfig.org/)
* [AWS-SDK-JS](https://github.com/aws/aws-sdk-js) / [Aliyun-SDK-JS](https://github.com/aliyun-UED/aliyun-sdk-js)

Boilerplate as [library](https://github.com/dexteryy/static-app-starter/blob/master/internals/lib/boilerplate/AppSkeleton.js):

- `AppSkeleton` - [exmaple A](https://github.com/dexteryy/static-app-starter/blob/master/internals/templates/app/entries/react/index.js), [example B](https://github.com/dexteryy/static-app-starter/blob/master/templates/app/entries/react-redux-router/index.js)
- `createReactRouterRoot` - [exmaple](https://github.com/dexteryy/static-app-starter/blob/master/internals/templates/app/entries/react-router/index.js)
- `createReduxRoot` - [exmaple](https://github.com/dexteryy/static-app-starter/blob/master/internals/templates/app/entries/react-redux/index.js)
- `createReduxRouterRoot` - [exmaple](https://github.com/dexteryy/static-app-starter/blob/master/internals/templates/app/entries/react-redux-router/index.js)
- `stateSelector` - [exmaple](https://github.com/dexteryy/static-app-starter/blob/master/internals/templates/app/entries/react-redux-router/containers/Home.jsx)
- `actionDispatcher` - [exmaple](https://github.com/dexteryy/static-app-starter/blob/master/internals/templates/app/entries/react-redux-router/containers/Home.jsx)
- ...

## Structure

#### Directories and Sample Files

- **internals/** - Boilerplate scripts, configure files, templates and libraries
  - **configs/** - Configuration files and build scripts
  - **utils/** - Reusable code for configuration files and scripts
    - **staticcloud/** - Adapters for delopyment scripts
      - `s3.js`, `oss.js`, `firebase.js`, `heroku.js`, ...
  - **lib/**
    - **boilerplate/** - Boilerplate code for app
  - **templates/** - Handlebar templates for Plop, see [Micro-generator](#micro-generator) section
  - **declarations/** - [Flow Declarations](http://flowtype.org/docs/declarations.html)
- **app/** - All source code for web app (shared between client-side and server-side), including JS, CSS and assets
  - **components/** - [Presentational components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.3o294zvoz)
  - **entries/** - Multiple entry points, see [details](#multiple-entry-points-optional)
    - _**example-app/**_ - Entry point, see [details](#single-entry-point)
      - **containers/** - [Container components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.3o294zvoz)
      - **decorators/** - [Higher-order Components](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)
      - **reducers/** - [Redux Reducers](http://redux.js.org/docs/basics/Reducers.html)
      - **actions/** - [Flux Standard Action](https://www.npmjs.com/package/redux-actions)
      - **constants/**
      - **routes/** - [React Router](https://github.com/reactjs/react-router/)
      - **styles/** - CSS/SCSS/CSSInJS shared between container components
      - **tests/** - See [Testing](#testing) section
      - `index.js`
    - _**page2/**_ - See 'entry' generator in [plopfile.babel.js][plopfile]
    - _**demo-page2/**_ - See [.gitignore][gitignore] and 'demo' generator in [plopfile.babel.js][plopfile]
    - ...
  - **lib/** - Library code which haven't been published to npm
  - **data/** - Shared data files
  - **assets/** - Shared images, fonts, audio, etc.
  - **styles/** - CSS/SCSS/CSSInJS shared between entry points
  - **containers/** - Shared [container components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.3o294zvoz)
    - `DevTools.jsx`
  - ...
  - **middleware/** - [Redux middleware](http://redux.js.org/docs/advanced/Middleware.html) shared between entry points
- **staticweb/** - For static web deployment or testing
  - _**example-app/**_ - For entry point
    - `index.html`, `deploy.js`, `deploy.scss`
  - _**page2/**_ - See 'entry' generator in [plopfile.babel.js][plopfile]
  - _**demo-page2/**_ - See [.gitignore][gitignore] and 'demo' generator in [plopfile.babel.js][plopfile]
  - ...
- **server/** - [TODO] A thin backend layer for universal web app and graphql-like api
- **runtime/** - [TODO] For Electron or Cordova
- **build/**
  - **public/** - Generated by Gulp and Webpack, do not manually modify
- ...
- `index.js` - Imported by other projects, see [details](#single-entry-point)
- `package.json`
- `env.config` - See [Setup - Step 1](#step-1)

#### Single Entry Point

> NOTE: For Single Page App or being imported by other projects (i.e. [Electron](http://electron.atom.io/) app or [Cordova](http://cordova.apache.org/) app)

[`index.js`](https://github.com/dexteryy/static-app-starter/blob/master/index.js) -> [`app/entries/example-app/index.js`](https://github.com/dexteryy/static-app-starter/blob/master/app/entries/example-app/index.js)

#### Multiple Entry Points (optional)

Add files:

* `app/entries/page1/index.js`
* `app/entries/page2/index.js`
* `app/entries/demo-page2/index.js`
* `staticweb/page1/index.html`
* `staticweb/page2/index.html`
* `staticweb/demo-page2/index.html`

Edit the [`env.config`](#step-1):

```ini
APP_ENTRY_PAGE1="./app/entries/page1"
APP_ENTRY_PAGE2="./app/entries/page2"
APP_DEMO_PAGE2="./app/entries/demo-page2"
```

Edit the `staticweb/page1/index.html`:

```html
<script src="/static/common.js"></script> <!-- optional -->
<script src="/static/page1.js"></script>
```

> NOTE: New entry point or demo can be automatically added by [micro-generator](#micro-generator)

# Getting Started

## Setup

#### Step 1

First of all, you must create a `env.config` file in the root directory. [`internals/configs/env.sample.config`](https://github.com/dexteryy/static-app-starter/blob/master/internals/configs/env.sample.config) is a complete template file for `env.config`

#### Step 2 (optional)

If you don't want to build default example ([`app/entries/example-app/`](https://github.com/dexteryy/static-app-starter/tree/master/app/entries/example-app)), but instead a clean codebase, you can remove redundant packages from:

* [`package.json`][package.json]'s `dependencies`

#### Step 3

Install dependencies:

```bash
npm install
```

#### Step 4 (optional)

You can remove example code and get a clean codebase:

```
npm run empty
```

If this is the case, you must create your own entry code in [`app/entries/`](https://github.com/dexteryy/static-app-starter/blob/master/app/entries/) before building.

You can [generate an entry](#micro-generator) with one command:

* `npm run new entry:react`
* `npm run new entry:react-router`
* `npm run new entry:react-redux`
* `npm run new entry:react-redux-router`

## Building

```
npm run build
```

or

```
NODE_ENV=production npm run build
```

> Build scripts and config files:
>
> * [`package.json`][package.json]
> * [`internals/configs/gulpfile.babel.js`][gulpfile]
> * [`internals/configs/webpack.default.config.babel.js`][webpack.config]

Open in the browser

```
open http://localhost:8000/app/
```

Manually start/stop static web server:

```
npm run start:staticserver
npm run stop:staticserver
```

## Development

For faster recompiling ([webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html)):

```
npm run dev
```

Enable automatic refreshing:

```
LIVE_MODE=refresh npm run dev
```

Enable HMR (Hot Module Replacement):

```
LIVE_MODE=hmr npm run dev
```

#### Micro-generator

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

Generator scripts:

* [`internals/configs/plopfile.babel.js`][plopfile]

#### Testing

Functional tests:

* NodeJS + [Mocha](http://mochajs.org/) + [Nightmare](http://nightmarejs.org/)
* Naming convention: `**/*.spec.js`
* Example: [app/entries/example-app/tests/index.spec.js](https://github.com/dexteryy/static-app-starter/blob/master/app/entries/example-app/tests/index.spec.js)

Unit tests:

* [Karma](https://karma-runner.github.io/) + [PhantomJS](https://www.npmjs.com/package/karma-phantomjs-launcher)/[Chrome](https://www.npmjs.com/package/karma-chrome-launcher) + [Mocha](http://mochajs.org/)
* Naming convention: `**/*.test.js`
* Example: [app/components/WelcomeBox/tests/index.test.js](https://github.com/dexteryy/static-app-starter/blob/master/app/components/WelcomeBox/tests/index.test.js)

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

Manually run functional tests for web app in the cloud (after [deployment](#deployment)):

```
npm run test:cloud
```


> NOTE: Spec file of new entry point or new component can be automatically added by [micro-generator](#micro-generator)

Karma configuration:

* [`internals/configs/karma.conf.babel.js`][karmaconf]

#### Code Style

Manually run static checking:

```
npm run lint
```

Similiar to [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript), [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)

More detail:

* [`.eslintrc.yml`](https://github.com/dexteryy/static-app-starter/blob/master/.eslintrc.yml)
* [`.jscsrc`](https://github.com/dexteryy/static-app-starter/blob/master/.jscsrc)
* [`.flowconfig`](https://github.com/dexteryy/static-app-starter/blob/master/.flowconfig)
* [`.stylelintrc`](https://github.com/dexteryy/static-app-starter/blob/master/.stylelintrc)
* [`.sass-lint.yml`](https://github.com/dexteryy/static-app-starter/blob/master/.sass-lint.yml)
* [`.csscomb.json`](https://github.com/dexteryy/static-app-starter/blob/master/.csscomb.json)
* [`.htmlhintrc`](https://github.com/dexteryy/static-app-starter/blob/master/.htmlhintrc)

#### Recommended Editor/IDE

* [Atom](atom.io/) + following plugins:
  * [language-babel](https://atom.io/packages/language-babel)
  * [linter](https://atom.io/packages/linter) + [linter-eslint](https://atom.io/packages/linter-eslint) + [linter-jscs](https://atom.io/packages/linter-jscs) + [linter-flow](https://atom.io/packages/linter-flow) + [linter-sass-lint](https://atom.io/packages/linter-sass-lint) + [linter-htmlhint](https://atom.io/packages/linter-htmlhint)
  * [editorconfig](https://atom.io/packages/editorconfig)
  * [toggle-quotes](https://atom.io/packages/toggle-quotes) + [vim-surround](https://atom.io/packages/vim-surround)
  * [auto-detect-indentation](https://atom.io/packages/auto-detect-indentation) + [resize-indent](https://atom.io/packages/resize-indent)
  * [atom-css-comb](https://atom.io/packages/atom-css-comb)

Recommended Settings for Atom (config.cson):

```json
"linter":
  ignoreVCSIgnoredFiles: false
  lintOnFly: false
"linter-jscs":
  displayAs: "jscs Warning"
  esnext: true
  fixOnSave: true
  onlyConfig: true
  preset: "<none>"
"linter-stylelint":
  disableWhenNoConfig: true
"linter-sass-lint":
  noConfigDisable: true
"language-babel":
  transpileOnSave: false
"atom-css-comb":
  projectConfigs: ".csscomb"
  readyMadeConfigs: "csscomb"
"whitespace":
  ignoreWhitespaceOnCurrentLine: false
"trailing-spaces":
  enableForCursorLines: true
```

#### Git Hooks

* pre-commit: `npm run lint`
* pre-push: `npm run build`

#### Committing Changes with [Commitizen](https://www.npmjs.com/package/commitizen)

> NOTE: Need `npm install commitizen -g`

```
git add .
git cz
```

## Deployment

> NOTE: Currently, only Aliyun OSS is supported

Build for static cloud environment (e.g. [AWS S3](https://aws.amazon.com/s3/), [Aliyun OSS](https://www.aliyun.com/product/oss/), CDN), than upload `build/public/` to the cloud:

```
npm run deploy:staticweb
```

Just upload:

```
npm run redeploy:staticweb
```

Before deployment, all environment variables that names begin with `APP_DEPLOY_STATIC_` must be configured in [`env.config`](#step-1).

For example, you must choose a static cloud provider in [`env.config`](#step-1):

```ini
APP_DEPLOY_STATIC_CLOUD=oss
```

```ini
APP_DEPLOY_STATIC_CLOUD=s3
```

Deployment scripts and adapters:

* [`internals/configs/gulpfile.babel.js`][gulpfile]
* [`internals/utils/deploy/*.js`](https://github.com/dexteryy/static-app-starter/blob/master/internals/utils/deploy/)

[package.json]: https://github.com/dexteryy/static-app-starter/blob/master/package.json
[webpack.config]: https://github.com/dexteryy/static-app-starter/blob/master/internals/configs/webpack.default.config.babel.js
[gulpfile]: https://github.com/dexteryy/static-app-starter/blob/master/internals/configs/gulpfile.babel.js
[plopfile]: https://github.com/dexteryy/static-app-starter/blob/master/internals/configs/plopfile.babel.js
[karmaconf]: https://github.com/dexteryy/static-app-starter/blob/master/internals/configs/karma.conf.babel.js
[gitignore]: https://github.com/dexteryy/static-app-starter/blob/master/.gitignore
