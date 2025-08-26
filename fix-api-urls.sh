#!/bin/bash

echo "🔧 すべてのファイルでNEXT_PUBLIC_API_BASE_URLをNEXT_PUBLIC_API_URLに修正中..."

# 各ファイルの環境変数参照を修正
sed -i '' 's/NEXT_PUBLIC_API_BASE_URL/NEXT_PUBLIC_API_URL/g' app/coach/videos/page.tsx
sed -i '' 's/NEXT_PUBLIC_API_BASE_URL/NEXT_PUBLIC_API_URL/g' app/user/request-problem/page.tsx
sed -i '' 's/NEXT_PUBLIC_API_BASE_URL/NEXT_PUBLIC_API_URL/g' app/coach/videos/\[videoId\]/page.tsx
sed -i '' 's/NEXT_PUBLIC_API_BASE_URL/NEXT_PUBLIC_API_URL/g' app/coach/videos/\[videoId\]/feedback/page.tsx
sed -i '' 's/NEXT_PUBLIC_API_BASE_URL/NEXT_PUBLIC_API_URL/g' app/user/settings/page.tsx
sed -i '' 's/NEXT_PUBLIC_API_BASE_URL/NEXT_PUBLIC_API_URL/g' app/user/settings/address/page.tsx
sed -i '' 's/NEXT_PUBLIC_API_BASE_URL/NEXT_PUBLIC_API_URL/g' app/user/settings/profile/page.tsx
sed -i '' 's/NEXT_PUBLIC_API_BASE_URL/NEXT_PUBLIC_API_URL/g' app/user/settings/career/page.tsx
sed -i '' 's/NEXT_PUBLIC_API_BASE_URL/NEXT_PUBLIC_API_URL/g' app/user/settings/golf/page.tsx

echo "✅ 環境変数参照の修正完了！"
