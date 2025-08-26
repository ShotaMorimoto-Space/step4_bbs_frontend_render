# BBC Golf Coaching Frontend

SWING BUDDY - ゴルフコーチングアプリケーションのフロントエンド

## Renderへのデプロイ

### 前提条件
- Renderアカウント
- GitHubリポジトリとの連携

### デプロイ手順

1. **Renderで新しいWebサービスを作成**
   - GitHubリポジトリを選択
   - ブランチを指定（mainまたはmaster）

2. **環境変数の設定**
   ```
   NODE_ENV=production
   PORT=10000
   SITE_URL=https://your-app-name.onrender.com
   NEXT_PUBLIC_API_URL=https://your-backend-api.onrender.com
   ```

3. **ビルド設定**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:render`

4. **自動デプロイの有効化**
   - GitHubへのプッシュ時に自動デプロイ

### ローカル開発

```bash
npm install
npm run dev
```

### ビルド

```bash
npm run build
npm start
```

## 技術スタック

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
