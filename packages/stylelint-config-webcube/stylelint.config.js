module.exports = {
  extends: [
    // https://github.com/stylelint/stylelint-config-standard
    'stylelint-config-standard',
    // // https://github.com/BPScott/stylelint-prettier
    // // https://github.com/prettier/stylelint-config-prettier
    'stylelint-prettier/recommended',
    // 'stylelint-config-prettier',
  ],
  processors: [],
  plugins: [
    // https://github.com/kristerkari/stylelint-scss
    'stylelint-scss',
    // https://github.com/hudochenkov/stylelint-order
    'stylelint-order',
    // https://www.npmjs.com/package/stylelint-no-unsupported-browser-features
  ],
  rules: {
    'no-descending-specificity': null,
    'no-empty-source': null,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    // https://github.com/hudochenkov/stylelint-order/blob/master/rules/order/README.md
    'order/order': [
      'custom-properties', // Custom properties (e. g., --property: 10px;)
      'dollar-variables', // Dollar variables (e. g., $variable)
      'at-variables', // At-variables (e. g., @variable available in Less syntax)
      {
        type: 'at-rule',
        name: 'extend',
      },
      {
        type: 'at-rule',
        name: 'include',
      },
      'less-mixins', // Mixins in Less syntax (e. g., .mixin();)
      {
        type: 'rule',
        selector: /^composes$/,
      },
      'declarations', // CSS declarations (e. g., display: block)
      'rules', // Nested rules (e. g., a { span {} })
      'at-rules', // Nested at-rules (e. g., div { @media () {} })
    ],
    // // https://github.com/hudochenkov/stylelint-order/blob/master/rules/properties-alphabetical-order/README.md
    'order/properties-alphabetical-order': null,
    // https://github.com/BPScott/stylelint-prettier
    'prettier/prettier': [
      true,
      // https://prettier.io/docs/en/options.html
      {
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: true,
        jsxBracketSameLine: true,
        arrowParens: 'avoid',
      },
    ],
  },
};
