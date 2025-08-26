#!/bin/bash

echo "🔧 typesディレクトリへのパスを修正中..."

# RequestCard.tsxの修正
sed -i '' 's|from '\''../../types/requests'\''|from '\''../../../src/types/requests'\''|g' app/components/requests/RequestCard.tsx

# VideoCanvas.tsxの修正
sed -i '' 's|from '\''../../types/review'\''|from '\''../../../src/types/review'\''|g' app/components/review/VideoCanvas.tsx

# Timeline.tsxの修正
sed -i '' 's|from '\''../../types/review'\''|from '\''../../../src/types/review'\''|g' app/components/review/Timeline.tsx

echo "✅ typesディレクトリへのパス修正完了！"
