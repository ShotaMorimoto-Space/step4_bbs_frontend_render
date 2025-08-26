'use client';

import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          SWING BUDDY
        </h1>
        <p className="text-gray-600 mb-8">
          ゴルフコーチングアプリケーション
        </p>
        <div className="space-x-4">
          <a 
            href="/auth/login" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            ログイン
          </a>
          <a 
            href="/auth/register" 
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            新規登録
          </a>
        </div>
      </div>
    </div>
  );
}
