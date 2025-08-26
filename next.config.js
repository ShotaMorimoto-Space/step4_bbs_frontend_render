/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  
  // Render用の設定
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  
  // 画像最適化
  images: {
    unoptimized: true,
  },
  
  // 静的ファイルの処理
  trailingSlash: false,
  
  // 環境変数の設定
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
