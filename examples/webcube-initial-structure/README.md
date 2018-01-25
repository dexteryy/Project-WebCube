
# Initial Webcube Examples

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

* Examples for usage of [redux-cube](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-cube) and [webcube's boilerplate](https://github.com/dexteryy/Project-WebCube/tree/master/packages/webcube/boilerplate)
* Examples for usage of [redux-source](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-source)
* Examples for results for `npm run webcube:setup` script and webcube's micro generators (`npm run new`)

More Examples:

* [Webcube's TodoMVC Example](../webcube-todo-app)

## Source Code

* [./app/react-app](./app/react-app)
* [./app/react-router-app](./app/react-router-app)
* [./app/react-redux-app](./app/react-redux-app)
* [./app/react-redux-router-app](./app/react-redux-router-app)
* [./app/react-redux-restapi-app](./app/react-redux-restapi-app)

## View Results in Production Environment

* [react-app](https://app.cubemage.cn/react-app/index.html)
* [react-router-app](https://app.cubemage.cn/react-router-app/index.html)
* [react-redux-app](https://app.cubemage.cn/react-redux-app/index.html)
* [react-redux-router-app](https://app.cubemage.cn/react-redux-router-app/index.html)
* [react-redux-restapi-app](https://app.cubemage.cn/react-redux-restapi-app/index.html)

## View Results in Development Environment

Preparation

```bash
git clone git@github.com:dexteryy/Project-WebCube.git ./a-mono-repo
```

```bash
cd ./a-mono-repo
npm run update
```

```bash
cd ./examples/webcube-initial-structure
cp ./configs/env.sample.config ./env.config
```

Run

```bash
npm run dev
```

or

```bash
npm run build
```

or

```bash
NODE_ENV=production npm run build
```

View

* http://localhost:8011/react-app/
* http://localhost:8011/react-router-app/
* http://localhost:8011/react-redux-app/
* http://localhost:8011/react-redux-router-app/
* http://localhost:8011/react-redux-restapi-app/
