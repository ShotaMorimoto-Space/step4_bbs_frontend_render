const path = require('path');

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
  
  // パス解決の設定
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '.'),
      '@/src': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/services': path.resolve(__dirname, 'src/services'),
      '@/config': path.resolve(__dirname, 'src/config'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/data': path.resolve(__dirname, 'src/data'),
      '@/screens': path.resolve(__dirname, 'src/screens'),
      '@/store': path.resolve(__dirname, 'src/store'),
      '@/theme': path.resolve(__dirname, 'src/theme'),
      '@/i18n': path.resolve(__dirname, 'src/i18n'),
    };
    return config;
  },
}

module.exports = nextConfig
