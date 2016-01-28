
# Static Web App Starter Kits

Includes the following toolchains:

* [Webpack](http://webpack.github.io/docs/)
  * [Babel v6](babeljs.io) ([ES2015](https://babeljs.io/docs/learn-es2015/) and [more](http://babeljs.io/docs/plugins/preset-stage-1/) + [JSX + Flow](http://babeljs.io/docs/plugins/preset-react/))
  * [SCSS](https://www.npmjs.com/package/sass-loader) ([node-sass](https://www.npmjs.com/package/node-sass)) + [PostCSS](https://www.npmjs.com/package/postcss-loader) ([Autoprefixer](https://github.com/postcss/autoprefixer) + [CSSNano](http://cssnano.co/options/)) + [style-loader](https://www.npmjs.com/package/style-loader)
  * [imagemin](https://www.npmjs.com/package/image-webpack-loader) ([gifsicle](https://github.com/kevva/imagemin-gifsicle) + [jpegtran](https://github.com/kevva/imagemin-jpegtran) + [optipng](https://github.com/kevva/imagemin-optipng) + [svgo](https://github.com/kevva/imagemin-svgo) + [pngquant](https://pngquant.org/)) + [url-loader](https://www.npmjs.com/package/url-loader) / [file-loader](https://www.npmjs.com/package/file-loader)
  * [Static asset revisioning](https://www.npmjs.com/package/assets-webpack-plugin)
* [Gulp](http://gulpjs.com/)
  * [webpack-stream](https://www.npmjs.com/package/webpack-stream/)
  * [Flow](flowtype.org) + [ESLint v2](http://eslint.org/) ([babel](https://www.npmjs.com/package/babel-eslint) + [flow-vars](https://www.npmjs.com/package/eslint-plugin-flow-vars) + [react](https://www.npmjs.com/package/eslint-plugin-react)) + [JSCS](http://jscs.info/)
  * [SCSS-Lint](https://github.com/brigade/scss-lint) + [CSSComb](http://csscomb.com/)
  * [UglifyJS2](https://github.com/mishoo/UglifyJS2)
  * [HTMLMinifier](https://github.com/kangax/html-minifier) + [gulp-inline-source](https://www.npmjs.com/package/gulp-inline-source/) + [gulp-replace](https://www.npmjs.com/package/gulp-replace/)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [Commitizen](https://www.npmjs.com/package/commitizen) ([cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog))

## Structure

#### Directories and Sample Files

- **src/**
  - **assets/**
    - _`swifticons/Browsertool.png`_
  - **declarations/**
    - `global.js`
    - `node_modules.js`
    - `assets.js`
  - **components/**
    - _**WelcomeBox/**_
      * _`index.jsx`_
      * _`index.scss`_
  * **models/**
  * ...
  * **entries/**
    * _**app/**_
      * `index.js`
      * `index.scss`
    * _demo-page1/_
    * _demo-page2/_
    * ...
* **containers/**
  * _**app/**_
    * `index.html`
    * `deploy.js`
    * `deploy.scss`
  * _demo-page1/_
  * _demo-page2/_
  * ...
* **data/**
* **tests/**
* public/
* ...
* `index.js`
* `package.json`

#### Main Entry Point

> Note: For Single Page App or being imported by other projects (i.e. [Electron](http://electron.atom.io/) app or [Cordova](http://cordova.apache.org/) app)

[`index.js`](https://github.com/dexteryy/static-app-starter/blob/master/index.js) -> [`src/entries/app/index.js`](https://github.com/dexteryy/static-app-starter/blob/master/src/entries/app/index.js)

#### Multiple Entry Points (optional)

Add files:

* `src/entries/demo-page1/index.js`
* `src/entries/demo-page2/index.js`
* `containers/demo-page1/index.html`
* `containers/demo-page2/index.html`

Edit the [`webpack.config.js`](https://github.com/dexteryy/static-app-starter/blob/master/webpack.config.js):

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

> Note: Remove redundant packages from [`package.json`](https://github.com/dexteryy/static-app-starter/blob/master/package.json)'s `dependencies`

* `npm install`
* `gem install scss_lint` (for [gulp-scss-lint](https://www.npmjs.com/package/gulp-scss-lint))

## Local Configuration

* Create a `.env` file in the root directory. For example:

```ini
MYAPP_DEVSERVER_HOST=localhost
MYAPP_DEVSERVER_PORT=8000
MYAPP_CDN_PREFIX=http://cdn.example.com/assets/
```

## Building

* `npm run build` or `NODE_ENV=production npm run build`

Build scripts and config files:

* [`package.json`](https://github.com/dexteryy/static-app-starter/blob/master/package.json)
* [`gulpfile.babel.js`](https://github.com/dexteryy/static-app-starter/blob/master/gulpfile.babel.js)
* [`webpack.config.js`](https://github.com/dexteryy/static-app-starter/blob/master/webpack.config.js)

## Open in the Browser

* `npm run serve`
* `open http://localhost:8000/app/`

## Development

* `npm run dev`

#### Code Style

Similiar to [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript), [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)

More detail:

* [`.eslintrc.yml`](https://github.com/dexteryy/static-app-starter/blob/master/.eslintrc.yml)
* [`.jscsrc`](https://github.com/dexteryy/static-app-starter/blob/master/.jscsrc)
* [`.flowconfig`](https://github.com/dexteryy/static-app-starter/blob/master/.flowconfig)
* [`.scss-lint.yml`](https://github.com/dexteryy/static-app-starter/blob/master/.scss-lint.yml)
* [`.csscomb.json`](https://github.com/dexteryy/static-app-starter/blob/master/.csscomb.json)

#### Recommended Editor/IDE

* [Atom](atom.io/) + following plugins:
  * [language-babel](https://atom.io/packages/language-babel)
  * [linter](https://atom.io/packages/linter) + [linter-eslint](https://atom.io/packages/linter-eslint) + [linter-jscs](https://atom.io/packages/linter-jscs) + [linter-flow](https://atom.io/packages/linter-flow) + [linter-scss-lint](https://atom.io/packages/linter-scss-lint)
  * [editorconfig](https://atom.io/packages/editorconfig)
  * [toggle-quotes](https://atom.io/packages/toggle-quotes) + [vim-surround](https://atom.io/packages/vim-surround)
  * [auto-detect-indentation](https://atom.io/packages/auto-detect-indentation) + [resize-indent](https://atom.io/packages/resize-indent)
  * [atom-css-comb](https://atom.io/packages/atom-css-comb)

Recommended Settings for Atom (config.cson):

```
linter:
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
whitespace:
  ignoreWhitespaceOnCurrentLine: false
"trailing-spaces":
  enableForCursorLines: true
```

#### Committing Changes with [Commitizen](https://www.npmjs.com/package/commitizen)

* `git add .`
* `git cz` (need `npm install commitizen -g`)

## Testing

Coming soon...

## Deployment

* `npm run deploy`

Deployment scripts:

* [`gulpfile.babel.js`](https://github.com/dexteryy/static-app-starter/blob/master/gulpfile.babel.js)
