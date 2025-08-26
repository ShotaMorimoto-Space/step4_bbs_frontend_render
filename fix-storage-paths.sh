#!/bin/bash

echo "🔧 utils/storageへの正しいパスを設定中..."

# 各ファイルの正しいパスを設定
# app/auth/register/email/page.tsx: ../../../utils/storage -> ../../utils/storage
sed -i '' 's|from '\''../../../utils/storage'\''|from '\''../../utils/storage'\''|g' app/auth/register/email/page.tsx

# app/user/settings/basic/page.tsx: ../../../utils/storage -> ../../utils/storage
sed -i '' 's|from '\''../../../utils/storage'\''|from '\''../../utils/storage'\''|g' app/user/settings/basic/page.tsx

# app/coach/videos/[videoId]/page.tsx: ../../../utils/storage -> ../../utils/storage
sed -i '' 's|from '\''../../../utils/storage'\''|from '\''../../utils/storage'\''|g' app/coach/videos/\[videoId\]/page.tsx

# app/coach/videos/[videoId]/feedback/page.tsx: ../../../../utils/storage -> ../../../utils/storage
sed -i '' 's|from '\''../../../../utils/storage'\''|from '\''../../../utils/storage'\''|g' app/coach/videos/\[videoId\]/feedback/page.tsx

echo "✅ utils/storageへのパス修正完了！"
