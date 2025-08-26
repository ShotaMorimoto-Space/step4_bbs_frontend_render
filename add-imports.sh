#!/bin/bash

echo "🔧 safeLocalStorageのインポートを追加中..."

# 各ファイルにsafeLocalStorageのインポートを追加
echo "import { safeLocalStorage } from '../../utils/storage';" >> app/coach/home/page.tsx
echo "import { safeLocalStorage } from '../../utils/storage';" >> app/coach/videos/page.tsx
echo "import { safeLocalStorage } from '../../../utils/storage';" >> app/coach/videos/\[videoId\]/page.tsx
echo "import { safeLocalStorage } from '../../../utils/storage';" >> app/coach/videos/\[videoId\]/feedback/page.tsx
echo "import { safeLocalStorage } from '../../../utils/storage';" >> app/user/request/page.tsx
echo "import { safeLocalStorage } from '../../../utils/storage';" >> app/user/request-club/page.tsx
echo "import { safeLocalStorage } from '../../../utils/storage';" >> app/user/request-problem/page.tsx
echo "import { safeLocalStorage } from '../../../utils/storage';" >> app/user/request-confirm/page.tsx
echo "import { safeLocalStorage } from '../../../utils/storage';" >> app/user/request-done/page.tsx
echo "import { safeLocalStorage } from '../../../utils/storage';" >> app/user/video/\[videoId\]/page.tsx
echo "import { safeLocalStorage } from '../../../utils/storage';" >> app/user/settings/address/page.tsx
echo "import { safeLocalStorage } from '../../../utils/storage';" >> app/auth/register/email/page.tsx

echo "✅ インポート追加完了！"
