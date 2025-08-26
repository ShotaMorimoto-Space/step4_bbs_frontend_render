'use client';

import React, { useState, useEffect } from 'react';
import { HealthService, ApiStatus } from '@/services/health';
import { AuthService } from '@/services/auth';

export default function ApiTestPage() {
  const [healthStatus, setHealthStatus] = useState<ApiStatus | null>(null);
  const [authStatus, setAuthStatus] = useState<string>('未確認');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ヘルスチェック
  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const status = await HealthService.checkBackendHealth();
      setHealthStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // 認証状態チェック
  const checkAuth = async () => {
    try {
      const isAuth = AuthService.isAuthenticated();
      const tokenValid = AuthService.isTokenValid();
      
      if (isAuth && tokenValid) {
        setAuthStatus('認証済み・トークン有効');
      } else if (isAuth) {
        setAuthStatus('認証済み・トークン無効');
      } else {
        setAuthStatus('未認証');
      }
    } catch (err) {
      setAuthStatus('エラー: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // コンポーネントマウント時にヘルスチェック実行
  useEffect(() => {
    checkHealth();
    checkAuth();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🧪 API接続テスト
      </h2>
      
      {/* ヘルスチェック */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          📡 バックエンド接続状態
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">ステータス:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              healthStatus?.backend 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {healthStatus?.backend ? '接続成功' : '接続失敗'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">メッセージ:</span>
            <span className="text-gray-800 font-mono text-sm">
              {healthStatus?.message || 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">最終確認:</span>
            <span className="text-gray-800 text-sm">
              {healthStatus?.timestamp ? new Date(healthStatus.timestamp).toLocaleString('ja-JP') : 'N/A'}
            </span>
          </div>
        </div>
        
        <button
          onClick={checkHealth}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '確認中...' : '再確認'}
        </button>
      </div>

      {/* 認証状態 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          🔐 認証状態
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">状態:</span>
            <span className="text-gray-800 font-medium">{authStatus}</span>
          </div>
        </div>
        
        <button
          onClick={checkAuth}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          再確認
        </button>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-red-800">
            ❌ エラー
          </h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* 接続情報 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          ℹ️ 接続情報
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div>
            <span className="font-medium">バックエンドURL:</span> 
            <span className="font-mono ml-2">
              https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net
            </span>
          </div>
          <div>
            <span className="font-medium">API バージョン:</span> 
            <span className="font-mono ml-2">v1</span>
          </div>
          <div>
            <span className="font-medium">環境:</span> 
            <span className="font-mono ml-2">
              {process.env.NODE_ENV === 'production' ? '本番環境' : '開発環境'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
