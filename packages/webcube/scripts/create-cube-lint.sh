#!/bin/bash
set -e

echo 'Lint js...'
npx eslint --fix --color --ext .js,.jsx,.ts,.tsx,.mjs,.mjsx,.es6 .

echo 'Lint styled-components...'
npx stylelint "**/*.js"
npx stylelint "**/*.jsx"
npx stylelint "**/*.ts"
npx stylelint "**/*.tsx"
npx stylelint "**/*.mjs"
npx stylelint "**/*.mjsx"
npx stylelint "**/*.es6"

echo 'Lint css, scss, less...'
npx stylelint "**/*.css" --fix
npx stylelint "**/*.scss" --fix
npx stylelint "**/*.less" --fix
