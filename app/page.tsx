'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-400 via-violet-600 to-violet-800 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 背景装飾 - 斜め格子パターン */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
        }} />
      </div>
      
      {/* ゴルフ要素の背景装飾 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl" />
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center mb-16">
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-light text-white mb-1" style={{ 
            fontFamily: 'Brush Script MT, cursive',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            SWING
          </h1>
          <h2
            className="text-4xl md:text-5xl font-bold text-white tracking-widest"
            style={{ 
              fontFamily: 'Courier New, monospace',
              letterSpacing: '0.3em',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            BUDDY
          </h2>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="relative z-10 w-full max-w-sm space-y-4 mb-8">
        <button
          onClick={() => router.push('/auth/login')}
          className="w-full bg-white bg-opacity-95 hover:bg-opacity-100 text-gray-800 font-semibold py-4 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          ログイン
        </button>
        <button
          onClick={() => router.push('/onboarding')}
          className="w-full bg-white bg-opacity-95 hover:bg-opacity-100 text-gray-800 font-semibold py-4 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          初めて登録の方
        </button>
        <button
          onClick={() => router.push('/api-test')}
          className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-4 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          🧪 APIテスト
        </button>
      </div>
    </div>
  );
}
