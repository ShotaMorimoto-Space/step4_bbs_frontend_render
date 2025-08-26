#!/bin/bash

echo "🔧 すべてのファイルで@/utils/storageを使用するように修正中..."

# 各ファイルのパスを@/utils/storageに統一
sed -i '' 's|from '\''../../utils/storage'\''|from '\''@/utils/storage'\''|g' app/auth/register/email/page.tsx
sed -i '' 's|from '\''../../utils/storage'\''|from '\''@/utils/storage'\''|g' app/user/settings/basic/page.tsx
sed -i '' 's|from '\''../../utils/storage'\''|from '\''@/utils/storage'\''|g' app/user/request-club/page.tsx
sed -i '' 's|from '\''../../utils/storage'\''|from '\''@/utils/storage'\''|g' app/coach/home/page.tsx
sed -i '' 's|from '\''../../utils/storage'\''|from '\''@/utils/storage'\''|g' app/coach/videos/page.tsx
sed -i '' 's|from '\''../../../utils/storage'\''|from '\''@/utils/storage'\''|g' app/coach/videos/\[videoId\]/page.tsx
sed -i '' 's|from '\''../../../utils/storage'\''|from '\''@/utils/storage'\''|g' app/coach/videos/\[videoId\]/feedback/page.tsx
sed -i '' 's|from '\''../../utils/storage'\''|from '\''@/utils/storage'\''|g' app/user/settings/page.tsx

echo "✅ @/utils/storageへのパス統一完了！"
