'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';

export default function AddressEditPage() {
  const router = useRouter();
  
  // ユーザー情報の状態
  const [userInfo, setUserInfo] = useState({
    zipCode: '',
    state: '',
    address1: '',
    address2: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // バックエンドAPIのベースURL
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';

  // 認証状態の確認とユーザー情報の取得
  useEffect(() => {
    const checkAuth = () => {
      const token = safeLocalStorage.getItem('access_token');
      const email = safeLocalStorage.getItem('user_email');
      
      if (!token || !email) {
        router.push('/auth/login');
        return;
      }

      // ユーザー情報をローカルストレージから取得
      setUserInfo({
        zipCode: safeLocalStorage.getItem('user_zip_code') || '',
        state: safeLocalStorage.getItem('user_state') || '',
        address1: safeLocalStorage.getItem('user_address1') || '',
        address2: safeLocalStorage.getItem('user_address2') || ''
      });
    };

    checkAuth();
  }, [router]);

  // 住所情報更新
  const handleUpdate = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const accessToken = safeLocalStorage.getItem('access_token');
      const userId = safeLocalStorage.getItem('user_id');
      
      if (!accessToken || !userId) {
        throw new Error('認証情報が不足しています');
      }

      // バックエンドに送信するデータを準備
      const updateData = {
        zip_code: userInfo.zipCode,
        state: userInfo.state,
        address1: userInfo.address1,
        address2: userInfo.address2
      };

      // バックエンドAPIに送信
      const response = await fetch(`${apiUrl}/auth/user/${userId}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '住所情報の更新に失敗しました');
      }

      // ローカルストレージに保存
      safeLocalStorage.setItem('user_zip_code', userInfo.zipCode);
      safeLocalStorage.setItem('user_state', userInfo.state);
      safeLocalStorage.setItem('user_address1', userInfo.address1);
      safeLocalStorage.setItem('user_address2', userInfo.address2);
      
      setSuccessMessage('住所情報が更新されました');
      
      setTimeout(() => {
        router.push('/user/settings');
      }, 1500);
    } catch (error: any) {
      console.error('住所情報更新エラー:', error);
      setErrorMessage(error.message || '住所情報の更新に失敗しました');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
      {/* ヘッダー */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/user/settings')}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <ArrowLeft size={16} />
              戻る
            </button>
            <h1 className="text-xl font-bold">住所編集</h1>
            <div className="w-20" /> {/* スペーサー */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* メッセージ表示 */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
            {errorMessage}
          </div>
        )}

        {/* 編集フォーム */}
        <div className="bg-white/10 rounded-2xl p-6">
          <h3 className="text-white text-lg font-medium mb-6">住所情報</h3>
          
          <div className="space-y-6">
            {/* 郵便番号 */}
            <div>
              <label className="block text-white/70 text-sm mb-2">郵便番号</label>
              <input
                type="text"
                value={userInfo.zipCode}
                onChange={(e) => setUserInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/20 focus:outline-none focus:border-white/40"
                placeholder="例: 100-0001"
              />
            </div>

            {/* 都道府県 */}
            <div>
              <label className="block text-white/70 text-sm mb-2">都道府県</label>
              <input
                type="text"
                value={userInfo.state}
                onChange={(e) => setUserInfo(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/20 focus:outline-none focus:border-white/40"
                placeholder="例: 東京都"
              />
            </div>

            {/* 住所1 */}
            <div>
              <label className="block text-white/70 text-sm mb-2">住所1</label>
              <input
                type="text"
                value={userInfo.address1}
                onChange={(e) => setUserInfo(prev => ({ ...prev, address1: e.target.value }))}
                className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/20 focus:outline-none focus:border-white/40"
                placeholder="例: 千代田区千代田1-1"
              />
            </div>

            {/* 住所2 */}
            <div>
              <label className="block text-white/70 text-sm mb-2">住所2</label>
              <input
                type="text"
                value={userInfo.address2}
                onChange={(e) => setUserInfo(prev => ({ ...prev, address2: e.target.value }))}
                className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/20 focus:outline-none focus:border-white/40"
                placeholder="例: アパート名、部屋番号など"
              />
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={handleUpdate}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {isSubmitting ? '保存中...' : '保存'}
            </button>
            <button
              onClick={() => router.push('/user/settings')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X size={16} />
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
