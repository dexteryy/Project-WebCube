module.exports = {
  extends: [
    // https://github.com/stylelint/stylelint-config-standard
    'stylelint-config-standard',
    // https://github.com/styled-components/stylelint-config-styled-components
    // https://www.styled-components.com/docs/tooling#stylelint
    // cannot support the --fix option
    'stylelint-config-styled-components',
  ],
  processors: [
    // https://github.com/styled-components/stylelint-processor-styled-components
    [
      'stylelint-processor-styled-components',
      {
        parserPlugins: [
          'jsx',
          'doExpressions',
          'objectRestSpread',
          'decorators-legacy',
          'classProperties',
          'classPrivateProperties',
          'classPrivateMethods',
          'exportExtensions',
          'asyncGenerators',
          'functionBind',
          'functionSent',
          'dynamicImport',
          'numericSeparator',
          'optionalChaining',
          'optionalCatchBinding',
          'throwExpressions',
          ['pipelineOperator', { proposal: 'minimal' }],
          'nullishCoalescingOperator',
        ],
      },
    ],
    // @bug
    // // https://github.com/mapbox/stylelint-processor-arbitrary-tags
    // '@mapbox/stylelint-processor-arbitrary-tags',
    // // https://github.com/mapbox/stylelint-processor-markdown
    // '@mapbox/stylelint-processor-markdown',
  ],
  plugins: [
    // https://github.com/hudochenkov/stylelint-order
    'stylelint-order',
    // https://www.npmjs.com/package/stylelint-no-unsupported-browser-features
  ],
  rules: {
    indentation: [2, { ignore: ['value'] }],
    'declaration-colon-newline-after': null,
    'no-descending-specificity': null,
    'no-empty-source': null,
    // https://github.com/hudochenkov/stylelint-order/blob/master/rules/order/README.md
    'order/order': [
      'custom-properties', // Custom properties (e. g., --property: 10px;)
      'dollar-variables', // Dollar variables (e. g., $variable)
      'at-variables', // At-variables (e. g., @variable available in Less syntax)
      'declarations', // CSS declarations (e. g., display: block)
      'rules', // Nested rules (e. g., a { span {} })
      'at-rules', // Nested at-rules (e. g., div { @media () {} })
    ],
    // // https://github.com/hudochenkov/stylelint-order/blob/master/rules/properties-alphabetical-order/README.md
    'order/properties-alphabetical-order': null,
  },
};
