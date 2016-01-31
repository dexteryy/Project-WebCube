
# Static Web App Starter Kit

Includes the following toolchains:

* [Webpack](http://webpack.github.io/docs/)
  * [Babel v6](babeljs.io) ([ES2015](https://babeljs.io/docs/learn-es2015/) + [Stage-1](http://babeljs.io/docs/plugins/preset-stage-1/) + [JSX + Flow](http://babeljs.io/docs/plugins/preset-react/) + ~~[React Transform Plugins](https://github.com/gaearon/babel-plugin-react-transform))~~
  * [SCSS](https://www.npmjs.com/package/sass-loader) ([node-sass](https://www.npmjs.com/package/node-sass)) + [PostCSS](https://github.com/postcss/postcss) ([Autoprefixer](https://github.com/postcss/autoprefixer), [CSSNano](http://cssnano.co/options/), ...) + [style-loader](https://www.npmjs.com/package/style-loader)
  * [imagemin](https://www.npmjs.com/package/image-webpack-loader) ([gifsicle](https://github.com/kevva/imagemin-gifsicle) + [jpegtran](https://github.com/kevva/imagemin-jpegtran) + [optipng](https://github.com/kevva/imagemin-optipng) + [svgo](https://github.com/kevva/imagemin-svgo) + [pngquant](https://pngquant.org/)) + [url-loader](https://www.npmjs.com/package/url-loader) / [file-loader](https://www.npmjs.com/package/file-loader)
  * [Static asset revisioning](https://www.npmjs.com/package/assets-webpack-plugin)
  * [webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html)
* [Gulp](http://gulpjs.com/)
  * [Flow](flowtype.org) + [ESLint v2](http://eslint.org/) ([babel](https://www.npmjs.com/package/babel-eslint) + [flow-vars](https://www.npmjs.com/package/eslint-plugin-flow-vars) + [react](https://www.npmjs.com/package/eslint-plugin-react)) + [JSCS](http://jscs.info/)
  * [SCSS-Lint](https://github.com/brigade/scss-lint) + [CSSComb](http://csscomb.com/) ([SMACSS](https://smacss.com/book/formatting)-like property order)
  * [webpack-stream](https://www.npmjs.com/package/webpack-stream/) + [UglifyJS2](https://github.com/mishoo/UglifyJS2)
  * [HTMLHint](https://github.com/yaniswang/HTMLHint) + [HTMLMinifier](https://github.com/kangax/html-minifier) + [gulp-inline-source](https://www.npmjs.com/package/gulp-inline-source/) + [gulp-replace](https://www.npmjs.com/package/gulp-replace/)
  * [gulp-watch](https://www.npmjs.com/package/gulp-watch)
* [Karma](https://karma-runner.github.io/) / [Nightmare](http://nightmarejs.org/) + [Mocha](http://mochajs.org/) + [Chai](http://chaijs.com/)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [Commitizen](https://www.npmjs.com/package/commitizen) ([cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog)) + [Ghooks](https://www.npmjs.com/package/ghooks) + [EditorConfig](http://editorconfig.org/)

## Structure

#### Directories and Sample Files

- **src/**
  - **assets/**
    - _`swifticons/Browsertool.png`_
  - **declarations/**
    - `global.js`, `node_modules.js`, `assets.js`, ...
  - **components/**
    - _`WelcomeBox/index.jsx`_, _`WelcomeBox/index.scss`_
  - **models/**
  - ...
  - **entries/**
    - _**app/**_
      - `index.js`, `index.scss`, `AppView.jsx`
    - _demo-page1/_
    - ...
- **containers/**
  - _**app/**_
    - `index.html`, `deploy.js`, `deploy.scss`
  - _demo-page1/_
  - ...
- **data/**
- **tests/**
  - **units/**
      - `test1.spec.js`, `test2.spec.js`, ...
  - **functionals/**
      - `test1.spec.js`, `test2.spec.js`, ...
- public/
- ...
- `index.js`
- `package.json`

#### Main Entry Point

> NOTE: For Single Page App or being imported by other projects (i.e. [Electron](http://electron.atom.io/) app or [Cordova](http://cordova.apache.org/) app)

[`index.js`](https://github.com/dexteryy/static-app-starter/blob/master/index.js) -> [`src/entries/app/index.js`](https://github.com/dexteryy/static-app-starter/blob/master/src/entries/app/index.js)

#### Multiple Entry Points (optional)

Add files:

* `src/entries/demo-page1/index.js`
* `src/entries/demo-page2/index.js`
* `containers/demo-page1/index.html`
* `containers/demo-page2/index.html`

Edit the [`webpack.config.babel.js`][webpack.config]:

```javascript
module.exports = {
  entry: {
    common: ['babel-polyfill', 'whatwg-fetch', 'react'], // optional
    'demo-page1': ['babel-polyfill', 'entries/demo-page1'],
    'demo-page2': ['babel-polyfill', 'entries/demo-page2'],
  },
  plugins: [
    // optional
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
    }),
```

Edit the `containers/demo-page1/index.html`:

```javascript
<script src="/static/common.js"></script> <!-- optional -->
<script src="/static/demo-page1.js"></script>
```

# Getting Started

## Installing Dependencies

> NOTE: Remove redundant packages from [`package.json`][package.json]'s `dependencies`

```bash
npm install
gem install scss_lint # for gulp-scss-lint
```

## Local Configuration

* Create a `.env` file in the root directory. For example:

```ini
MYAPP_SERVER_HOST=localhost
MYAPP_SERVER_PORT=8000
MYAPP_CDN_PREFIX=http://cdn.example.com/assets/
```

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
> * [`webpack.config.babel.js`][webpack.config]

Open in the browser

```
open http://localhost:8000/app/
```

Manually start/stop web server:

```
npm run startserver
npm run stopserver
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

#### Testing

Manually run all tests:

```
npm run test
```

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
* [`.scss-lint.yml`](https://github.com/dexteryy/static-app-starter/blob/master/.scss-lint.yml)
* [`.csscomb.json`](https://github.com/dexteryy/static-app-starter/blob/master/.csscomb.json)
* [`.htmlhintrc`](https://github.com/dexteryy/static-app-starter/blob/master/.htmlhintrc)

#### Recommended Editor/IDE

* [Atom](atom.io/) + following plugins:
  * [language-babel](https://atom.io/packages/language-babel)
  * [linter](https://atom.io/packages/linter) + [linter-eslint](https://atom.io/packages/linter-eslint) + [linter-jscs](https://atom.io/packages/linter-jscs) + [linter-flow](https://atom.io/packages/linter-flow) + [linter-scss-lint](https://atom.io/packages/linter-scss-lint) + [linter-htmlhint](https://atom.io/packages/linter-htmlhint)
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
"linter-scss-lint":
  disableWhenNoConfigFileInPath: true
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

> NOTE: Before committing make sure you have executed `npm run build`

* pre-commit: `npm run lint && npm run test`
* pre-push: `npm run build`

#### Committing Changes with [Commitizen](https://www.npmjs.com/package/commitizen)

> NOTE: Need `npm install commitizen -g`

```
git add .
git cz
```

## Deployment

```
npm run deploy
```

Deployment scripts:

* [`gulpfile.babel.js`][gulpfile]

[package.json]: https://github.com/dexteryy/static-app-starter/blob/master/package.json
[webpack.config]: https://github.com/dexteryy/static-app-starter/blob/master/webpack.config.babel.js
[gulpfile]: https://github.com/dexteryy/static-app-starter/blob/master/gulpfile.babel.js
