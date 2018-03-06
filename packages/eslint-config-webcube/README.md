# eslint-config-webcube

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

[![NPM Version][npm-image]][npm-url]
<!-- [![Dependencies Status][dep-image]][dep-url] -->

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/eslint-config-webcube.svg
[nodei-image]: https://nodei.co/npm/eslint-config-webcube.png?downloads=true
[npm-url]: https://npmjs.org/package/eslint-config-webcube
<!-- [dep-image]: https://david-dm.org/dexteryy/eslint-config-webcube.svg
[dep-url]: https://david-dm.org/dexteryy/eslint-config-webcube -->

A [sharable ESLint presets](https://eslint.org/docs/user-guide/configuring#using-a-shareable-configuration-package) which integrates [Prettier](https://github.com/prettier/prettier) and explicitly configures all-available rules (guaranteed by scripts) from ESLint core and commonly used plugins (see [Spellbook of Modern Web Dev > Toolchain](https://github.com/dexteryy/spellbook-of-modern-webdev#toolchain) > Static Analysis).

It's closely compatible with [Airbnb's code style](https://github.com/airbnb/javascript).

```
npm install --save-dev eslint-config-webcube
```

### Integrated Plugins

* [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier)
* [eslint-plugin-babel](https://www.npmjs.com/package/eslint-plugin-babel)
* [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)
* [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)
* [eslint-plugin-eslint-comments](https://www.npmjs.com/package/eslint-plugin-eslint-comments)
* [eslint-plugin-filenames](https://www.npmjs.com/package/eslint-plugin-filenames)
* [eslint-plugin-promise](https://www.npmjs.com/package/eslint-plugin-promise)
* [eslint-plugin-node](https://www.npmjs.com/package/eslint-plugin-node)

### For custom rules (WIP)

* [no-restricted-globals](https://eslint.org/docs/rules/no-restricted-globals)
* [no-restricted-modules](https://eslint.org/docs/rules/no-restricted-modules)
* [id-blacklist](https://eslint.org/docs/rules/id-blacklist)
* [no-restricted-imports](https://eslint.org/docs/rules/no-restricted-imports)
* [react/forbid-component-props](https://github.com/yannickcr/eslint-plugin-react/blob/HEAD/docs/rules/forbid-component-props.md)
* [react/forbid-elements](https://github.com/yannickcr/eslint-plugin-react/blob/HEAD/docs/rules/forbid-elements.md)
* [react/forbid-prop-types](https://github.com/yannickcr/eslint-plugin-react/blob/HEAD/docs/rules/forbid-prop-types.md)
* [promise/prefer-await-to-then](https://www.npmjs.com/package/eslint-plugin-promise#promise-rules)
* [promise/prefer-await-to-callbacks](https://www.npmjs.com/package/eslint-plugin-promise#promise-rules)
* [node/no-unsupported-features](https://github.com/mysticatea/eslint-plugin-node/blob/HEAD/docs/rules/no-unsupported-features.md)
