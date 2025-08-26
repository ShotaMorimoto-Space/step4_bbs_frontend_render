#!/bin/bash

echo "🔧 localStorageを安全に使用するように修正中..."

# 主要なファイルのlocalStorageをsafeLocalStorageに置換
sed -i '' 's/localStorage\.getItem/safeLocalStorage.getItem/g' app/coach/home/page.tsx
sed -i '' 's/localStorage\.setItem/safeLocalStorage.setItem/g' app/coach/home/page.tsx
sed -i '' 's/localStorage\.removeItem/safeLocalStorage.removeItem/g' app/coach/home/page.tsx
sed -i '' 's/localStorage\.clear/safeLocalStorage.clear/g' app/coach/home/page.tsx

sed -i '' 's/localStorage\.getItem/safeLocalStorage.getItem/g' app/coach/videos/page.tsx
sed -i '' 's/localStorage\.setItem/safeLocalStorage.setItem/g' app/coach/videos/page.tsx

sed -i '' 's/localStorage\.getItem/safeLocalStorage.getItem/g' app/coach/videos/\[videoId\]/page.tsx
sed -i '' 's/localStorage\.setItem/safeLocalStorage.setItem/g' app/coach/videos/\[videoId\]/page.tsx

sed -i '' 's/localStorage\.getItem/safeLocalStorage.getItem/g' app/coach/videos/\[videoId\]/feedback/page.tsx
sed -i '' 's/localStorage\.setItem/safeLocalStorage.setItem/g' app/coach/videos/\[videoId\]/feedback/page.tsx

sed -i '' 's/localStorage\.getItem/safeLocalStorage.getItem/g' app/user/request/page.tsx
sed -i '' 's/localStorage\.setItem/safeLocalStorage.setItem/g' app/user/request/page.tsx
sed -i '' 's/localStorage\.removeItem/safeLocalStorage.removeItem/g' app/user/request/page.tsx

sed -i '' 's/localStorage\.getItem/safeLocalStorage.getItem/g' app/user/request-club/page.tsx
sed -i '' 's/localStorage\.setItem/safeLocalStorage.setItem/g' app/user/request-club/page.tsx

sed -i '' 's/localStorage\.getItem/safeLocalStorage.getItem/g' app/user/request-problem/page.tsx
sed -i '' 's/localStorage\.setItem/safeLocalStorage.setItem/g' app/user/request-problem/page.tsx

sed -i '' 's/localStorage\.getItem/safeLocalStorage.getItem/g' app/user/request-confirm/page.tsx
sed -i '' 's/localStorage\.removeItem/safeLocalStorage.removeItem/g' app/user/request-confirm/page.tsx

sed -i '' 's/localStorage\.getItem/safeLocalStorage.getItem/g' app/user/request-done/page.tsx
sed -i '' 's/localStorage\.removeItem/safeLocalStorage.removeItem/g' app/user/request-done/page.tsx

sed -i '' 's/localStorage\.getItem/safeLocalStorage.getItem/g' app/user/video/\[videoId\]/page.tsx

sed -i '' 's/localStorage\.getItem/safeLocalStorage.getItem/g' app/user/settings/address/page.tsx
sed -i '' 's/localStorage\.setItem/safeLocalStorage.setItem/g' app/user/settings/address/page.tsx

sed -i '' 's/localStorage\.getItem/safeLocalStorage.getItem/g' app/auth/register/email/page.tsx
sed -i '' 's/localStorage\.setItem/safeLocalStorage.setItem/g' app/auth/register/email/page.tsx
sed -i '' 's/localStorage\.removeItem/safeLocalStorage.removeItem/g' app/auth/register/email/page.tsx

echo "✅ localStorageの安全化修正完了！"
