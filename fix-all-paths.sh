#!/bin/bash

echo "すべてのファイルのパスを正しく修正します..."

# app/coach/signup/ 内のファイルを修正 (4階層上)
find app/coach/signup -name "*.tsx" -type f -exec sed -i '' 's|../../../src/|../../../../src/|g' {} \;

# app/coach/ 内のファイルを修正 (3階層上)
find app/coach -name "*.tsx" -type f -exec sed -i '' 's|../../../../src/|../../../src/|g' {} \;

# app/user/ 内のファイルを修正 (3階層上)
find app/user -name "*.tsx" -type f -exec sed -i '' 's|../../../../src/|../../../src/|g' {} \;

# app/auth/ 内のファイルを修正 (3階層上)
find app/auth -name "*.tsx" -type f -exec sed -i '' 's|../../../../src/|../../../src/|g' {} \;

# app/ 直下のファイルは2階層上
find app -maxdepth 1 -name "*.tsx" -type f -exec sed -i '' 's|../../../src/|../../src/|g' {} \;

echo "修正完了！"
