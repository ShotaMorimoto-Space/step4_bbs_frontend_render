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
  
  // パス解決の設定（デバッグ用）
  webpack: (config) => {
    console.log('🔍 Webpack設定開始...');
    console.log('📁 現在のディレクトリ:', __dirname);
    console.log('📁 srcディレクトリの存在確認:', path.resolve(__dirname, 'src'));
    
    // パスエイリアスの設定
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '.'),
      '@/src': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/services': path.resolve(__dirname, 'src/services'),
      '@/config': path.resolve(__dirname, 'src/config'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/types': path.resolve(__dirname, 'src/types'),
    };
    
    // パス解決の詳細ログ
    config.resolve.modules = [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
      'node_modules'
    ];
    
    console.log('🔧 設定されたエイリアス:', config.resolve.alias);
    console.log('📂 モジュール解決パス:', config.resolve.modules);
    
    return config;
  },
}

module.exports = nextConfig
