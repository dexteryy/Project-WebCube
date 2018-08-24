#!/bin/bash

lint() {
  npx lint-staged || (
    exit 1
  )
}

(
  npx create-cube check
) && (
  lint
) && (
  npm run precommit:custom
) && (

echo ""
echo "=============================="
echo ""
echo "[PRECOMMIT] Verified!"
echo "Please commit all autofixes caused by eslint, stylelint and prettier"
echo ""

) || (
echo ""
echo "=============================="
echo ""
echo "[PRECOMMIT] failed!"
echo ""
echo "For TRULY URGENT case (like hotfix), you can skip the pre-commit checking:"
echo "git commit --no-verify -m \"message\""
echo "Otherwise, you should solve all above issues one by one"
echo ""
exit 1

)
