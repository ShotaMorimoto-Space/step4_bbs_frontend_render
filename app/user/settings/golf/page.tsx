'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';

export default function GolfEditPage() {
  const router = useRouter();
  
  // ユーザー情報の状態
  const [userInfo, setUserInfo] = useState({
    experience: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // バックエンドAPIのベースURL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';

  // 認証状態の確認とユーザー情報の取得
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      const email = localStorage.getItem('user_email');
      
      if (!token || !email) {
        router.push('/auth/login');
        return;
      }

      // ユーザー情報をローカルストレージから取得
      setUserInfo({
        experience: localStorage.getItem('user_experience') || ''
      });
    };

    checkAuth();
  }, [router]);

  // ゴルフ情報更新
  const handleUpdate = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const accessToken = localStorage.getItem('access_token');
      const userId = localStorage.getItem('user_id');
      
      if (!accessToken || !userId) {
        throw new Error('認証情報が不足しています');
      }

      // バックエンドに送信するデータを準備
      const updateData = {
        golf_exp: userInfo.experience ? 
          (userInfo.experience === 'beginner' ? 1 :
           userInfo.experience === 'intermediate' ? 3 :
           userInfo.experience === 'advanced' ? 7 :
           userInfo.experience === 'expert' ? 15 : null) : null
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
        throw new Error(errorData.detail || 'ゴルフ情報の更新に失敗しました');
      }

      // ローカルストレージに保存
      localStorage.setItem('user_experience', userInfo.experience);
      
      setSuccessMessage('ゴルフ情報が更新されました');
      
      setTimeout(() => {
        router.push('/user/settings');
      }, 1500);
    } catch (error: any) {
      console.error('ゴルフ情報更新エラー:', error);
      setErrorMessage(error.message || 'ゴルフ情報の更新に失敗しました');
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
            <h1 className="text-xl font-bold">ゴルフ情報編集</h1>
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
          <h3 className="text-white text-lg font-medium mb-6">ゴルフ情報</h3>
          
          <div className="space-y-6">
            {/* ゴルフ経験年数 */}
            <div>
              <label className="block text-white/70 text-sm mb-2">ゴルフ経験年数</label>
              <select
                value={userInfo.experience}
                onChange={(e) => setUserInfo(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/20 focus:outline-none focus:border-white/40"
              >
                <option value="">選択してください</option>
                <option value="beginner">初心者（1年未満）</option>
                <option value="intermediate">中級者（1-5年）</option>
                <option value="advanced">上級者（5-10年）</option>
                <option value="expert">エキスパート（10年以上）</option>
              </select>
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
