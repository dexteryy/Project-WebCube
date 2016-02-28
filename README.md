
# Static Web App Starter Kit

Includes the following toolchains:

* [Webpack](http://webpack.github.io/docs/)
  * [Babel v6](babeljs.io) ([ES2015](https://babeljs.io/docs/learn-es2015/) + [Stage-1](http://babeljs.io/docs/plugins/preset-stage-1/) + [JSX + Flow](http://babeljs.io/docs/plugins/preset-react/)) + [React Transform](https://github.com/gaearon/babel-plugin-react-transform) ([hmr](https://github.com/gaearon/react-transform-hmr) + [catch-errors](https://github.com/gaearon/react-transform-catch-errors) + [render-visualizer](https://github.com/spredfast/react-transform-render-visualizer))
  * [SCSS](https://www.npmjs.com/package/sass-loader) ([node-sass](https://www.npmjs.com/package/node-sass)) + [PostCSS](https://github.com/postcss/postcss) ([CSSNext](http://cssnext.io/)) + [CSS Modules](https://github.com/css-modules/css-modules) + [Autoprefixer](https://github.com/postcss/autoprefixer) + [CSSNano](http://cssnano.co/options/)
  * [imagemin](https://www.npmjs.com/package/image-webpack-loader) ([gifsicle](https://github.com/kevva/imagemin-gifsicle) + [jpegtran](https://github.com/kevva/imagemin-jpegtran) + [optipng](https://github.com/kevva/imagemin-optipng) + [svgo](https://github.com/kevva/imagemin-svgo) + [pngquant](https://pngquant.org/)) + [url-loader](https://www.npmjs.com/package/url-loader) / [file-loader](https://www.npmjs.com/package/file-loader)
  * [ExtractTextPlugin](https://www.npmjs.com/package/extract-text-webpack-plugin) + [AssetsPlugin](https://www.npmjs.com/package/assets-webpack-plugin)
  * [webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html) / [webpack-hot-middleware](https://www.npmjs.com/package/webpack-hot-middleware)
* [Gulp](http://gulpjs.com/)
  * [Flow](flowtype.org) + [ESLint v2](http://eslint.org/) ([babel](https://www.npmjs.com/package/babel-eslint) + [flow-vars](https://www.npmjs.com/package/eslint-plugin-flow-vars) + [react](https://www.npmjs.com/package/eslint-plugin-react)) + [JSCS](http://jscs.info/)
  * [StyleLint](http://stylelint.io/) / [SASS-Lint](https://github.com/sasstools/sass-lint) + [CSSComb](http://csscomb.com/) ([SMACSS](https://smacss.com/book/formatting)-like property order)
  * [webpack-stream](https://www.npmjs.com/package/webpack-stream/) + [UglifyJS2](https://github.com/mishoo/UglifyJS2)
  * [HTMLHint](https://github.com/yaniswang/HTMLHint) + [HTMLMinifier](https://github.com/kangax/html-minifier) + [gulp-inline-source](https://www.npmjs.com/package/gulp-inline-source/) + [gulp-replace](https://www.npmjs.com/package/gulp-replace/)
  * [gulp-watch](https://www.npmjs.com/package/gulp-watch) + [gulp-webserver](https://www.npmjs.com/package/gulp-webserver)
* [Karma](https://karma-runner.github.io/) ([PhantomJS](http://phantomjs.org/)) / [Nightmare](http://nightmarejs.org/) ([electron-prebuilt](https://www.npmjs.com/package/electron-prebuilt)) + [Mocha](http://mochajs.org/) + [Chai](http://chaijs.com/)
* [dotenv](https://www.npmjs.com/package/dotenv) + [Plop](https://github.com/amwmedia/plop) ([Handlebar](http://handlebarsjs.com/) + [Inquirer](https://www.npmjs.com/package/inquirer)) + [Commitizen](https://www.npmjs.com/package/commitizen) ([cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog)) + [Ghooks](https://www.npmjs.com/package/ghooks) + [EditorConfig](http://editorconfig.org/)
* [AWS-SDK-JS](https://github.com/aws/aws-sdk-js) / [Aliyun-SDK-JS](https://github.com/aliyun-UED/aliyun-sdk-js)

## Structure

#### Directories and Sample Files

- **src/** - All source code for runtime, including JS, CSS and images
  - **shared/**
    - **assets/** - Shared images, fonts, audio, etc.
      - _`swifticons/Browsertool.png`_
    - **styles/** - Shared CSS/SCSS
  - **declarations/** - Flow Declarations
    - `global.js`, `node_modules.js`, `assets.js`, ...
  - **components/** - [presentational components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.3o294zvoz), new component can be automatically added by [micro-generator](https://github.com/dexteryy/static-app-starter#micro-generator)
    - _`WelcomeBox/index.jsx`_, _`WelcomeBox/index.scss`_
  - **containers/** - [container components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.3o294zvoz)
  - **models/** - reducers / stores / models / ...
  - **actions/**
  - **entries/** - Single/Multiple entry point, see [details](https://github.com/dexteryy/static-app-starter#multiple-entry-points-optional)
    - _**app/**_ - Main entry point, see [details](https://github.com/dexteryy/static-app-starter#main-entry-point)
      - `index.js`, `index.scss`, `AppView.jsx`
    - _demo-page1/_ - See [.gitignore][gitignore] and 'demo' generator in [plopfile.babel.js][plopfile]
    - ...
- **staticweb/** - For testing or deployment
  - _**app/**_ - For main entry point
    - `index.html`, `deploy.js`, `deploy.scss`
  - _demo-page1/_ - See [.gitignore][gitignore] and 'demo' generator in [plopfile.babel.js][plopfile]
  - ...
- **data/** - For testing or deployment
- **configs/** - For configuration files that do not have to be placed in project root
- **templates/** - Handlebar templates for Plop, see [Micro-generator](https://github.com/dexteryy/static-app-starter#micro-generator) section
- **utils/** - Reusable code for configuration files and scripts
  - **staticcloud/** - Adapters for delopyment scripts
    - `s3.js`, `oss.js`, `firebase.js`, `heroku.js`, ...
- **test/** - See [Testing](https://github.com/dexteryy/static-app-starter#testing) section
  - **units/** - [Karma](https://karma-runner.github.io/) + [Mocha](http://mochajs.org/)
  - **functionals/** - [Mocha](http://mochajs.org/) + [Nightmare](http://nightmarejs.org/)
- **build/**
  - **public/** - Generated by Gulp and Webpack, do not manually modify
- ...
- `index.js` - Imported by other projects, see [details](https://github.com/dexteryy/static-app-starter#main-entry-point)
- `package.json`

#### Main Entry Point

> NOTE: For Single Page App or being imported by other projects (i.e. [Electron](http://electron.atom.io/) app or [Cordova](http://cordova.apache.org/) app)

[`index.js`](https://github.com/dexteryy/static-app-starter/blob/master/index.js) -> [`src/entries/app/index.js`](https://github.com/dexteryy/static-app-starter/blob/master/src/entries/app/index.js)

#### Multiple Entry Points (optional)

> NOTE: New entry point can be automatically added by [micro-generator](https://github.com/dexteryy/static-app-starter#micro-generator)

Add files:

* `src/entries/demo-page1/index.js`
* `src/entries/demo-page2/index.js`
* `staticweb/demo-page1/index.html`
* `staticweb/demo-page2/index.html`

Edit the [`webpack.default.config.babel.js`][webpack.config]:

```javascript
module.exports = {
  entry: {
    common: ['babel-polyfill', 'whatwg-fetch', 'react'], // optional
    'demo-page1': ['babel-polyfill', './src/entries/demo-page1'],
    'demo-page2': ['babel-polyfill', './src/entries/demo-page2'],
  },
  plugins: [
    // optional
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
    }),
```

Edit the `staticweb/demo-page1/index.html`:

```javascript
<script src="/static/common.js"></script> <!-- optional -->
<script src="/static/demo-page1.js"></script>
```

> NOTE: To enable `common.js` and continue use [micro-generator](https://github.com/dexteryy/static-app-starter#micro-generator), you need to modify [templates/staticweb/index.html](https://github.com/dexteryy/static-app-starter/blob/master/templates/staticweb/index.html)

# Getting Started

## Installing Dependencies

> NOTE: Remove redundant packages from [`package.json`][package.json]'s `dependencies`

```bash
npm install
```

## Local Configuration

Before building, you must create a `.env` file in the root directory. For example:

```ini
APP_DEVSERVER_HOST=localhost
APP_DEVSERVER_PORT=8000
APP_DEPLOY_STATIC_ROOT=http://mybucket.oss-cn-hangzhou.aliyuncs.com/static/
```

> NOTE: [`configs/env_sample`](https://github.com/dexteryy/static-app-starter/blob/master/configs/env_sample) is a complete template file for `.env`

You can remove demo code and get a clean codebase:

```
npm run empty
```

But if this is the case, you must [generate an entry](https://github.com/dexteryy/static-app-starter#micro-generator) before building.

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
> * [`gulpfile.babel.js`][gulpfile]
> * [`configs/webpack.default.config.babel.js`][webpack.config]

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

For automatic running unit tests (no web server):

```
npm run testing
```

For automatic building, running all tests:

```
npm run building
```

```
NODE_ENV=production npm run building
```

#### Micro-generator

```
npm run new
```

* `npm run new entry` - Add a new entry point
* `npm run new demo` - Add a new entry point for demo (run `npm run new initDemo` first), see [.gitignore][gitignore]
* `npm run new initDemo` - Initialize config files for demo entries
* `npm run new component` - Add a new component

Generator scripts:

* [`configs/plopfile.babel.js`][plopfile]

#### Testing

Manually run unit tests and functional tests:

```
npm run test
```

Manually run unit tests:

```
npm run test:unit
```

Manually run functional tests (run automatically after building):

```
npm run test:quick
```

Manually run functional tests for web app in the cloud (after [deployment](https://github.com/dexteryy/static-app-starter#deployment)):

```
npm run test:cloud
```

Unit tests + Functional tests:

- **test/**
  - **units/** - [Karma](https://karma-runner.github.io/) + [Mocha](http://mochajs.org/)
    - `WelcomeBox.spec.js`, ...
  - **functionals/** - [Mocha](http://mochajs.org/) + [Nightmare](http://nightmarejs.org/)
    - _**app/**_
      - `index.spec.js`, ...
    - _demo-page1/_
    - ...

> NOTE: Spec file of new entry point or new component can be automatically added by [micro-generator](https://github.com/dexteryy/static-app-starter#micro-generator)

Karma configuration:

* [`configs/karma.conf.babel.js`][karmaconf]

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

Before deployment, all environment variables that names begin with `APP_DEPLOY_STATIC_` must be configured in `.env`.

For example, you must choose a static cloud provider in `.env`:

```ini
APP_DEPLOY_STATIC_CLOUD=oss
```

```ini
APP_DEPLOY_STATIC_CLOUD=s3
```

Deployment scripts and adapters:

* [`gulpfile.babel.js`][gulpfile]
* [`utils/deploy/*.js`][https://github.com/dexteryy/static-app-starter/blob/master/utils/deploy/]

[package.json]: https://github.com/dexteryy/static-app-starter/blob/master/package.json
[webpack.config]: https://github.com/dexteryy/static-app-starter/blob/master/configs/webpack.default.config.babel.js
[gulpfile]: https://github.com/dexteryy/static-app-starter/blob/master/gulpfile.babel.js
[plopfile]: https://github.com/dexteryy/static-app-starter/blob/master/configs/plopfile.babel.js
[karmaconf]: https://github.com/dexteryy/static-app-starter/blob/master/configs/karma.conf.babel.js
[gitignore]: https://github.com/dexteryy/static-app-starter/blob/master/.gitignore
