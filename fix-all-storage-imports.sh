#!/bin/bash

echo "🔧 すべてのファイルでsafeLocalStorageのインポートを追加中..."

# 各ファイルにsafeLocalStorageのインポートを追加
# 既にインポートがある場合は追加しない

# app/user/request/page.tsx
if ! grep -q "import.*safeLocalStorage" app/user/request/page.tsx; then
  sed -i '' '/import.*CommonLayout/a\
import { safeLocalStorage } from '\''@/utils/storage'\'';' app/user/request/page.tsx
fi

# app/user/video/[videoId]/page.tsx
if ! grep -q "import.*safeLocalStorage" app/user/video/\[videoId\]/page.tsx; then
  sed -i '' '/import.*CommonLayout/a\
import { safeLocalStorage } from '\''@/utils/storage'\'';' app/user/video/\[videoId\]/page.tsx
fi

# app/user/settings/address/page.tsx
if ! grep -q "import.*safeLocalStorage" app/user/settings/address/page.tsx; then
  sed -i '' '/import.*CommonLayout/a\
import { safeLocalStorage } from '\''@/utils/storage'\'';' app/user/settings/address/page.tsx
fi

echo "✅ safeLocalStorageのインポート追加完了！"
