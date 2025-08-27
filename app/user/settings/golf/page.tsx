'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import { SettingsLayout } from '@/components/SettingsLayout';
import { CommonButton, CommonErrorMessage } from '@/components/CommonLayout';
import { safeLocalStorage } from '@/utils/storage';

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
      const token = safeLocalStorage.getItem('access_token');
      const email = safeLocalStorage.getItem('user_email');
      
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
      const accessToken = safeLocalStorage.getItem('access_token');
      const userId = safeLocalStorage.getItem('user_id');
      
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
      safeLocalStorage.setItem('user_experience', userInfo.experience);
      
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
    <SettingsLayout title="ゴルフ情報編集">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => router.push('/user/settings')}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
        >
          <X size={20} className="text-white" />
        </button>
        <h1 className="text-white text-lg font-medium">ゴルフ情報編集</h1>
        <div className="w-10" /> {/* スペーサー */}
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-4">
        {/* メッセージ表示 */}
        {successMessage && (
          <CommonErrorMessage message={successMessage} />
        )}
        
        {errorMessage && (
          <CommonErrorMessage message={errorMessage} />
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
            <CommonButton
              onClick={handleUpdate}
              disabled={isSubmitting}
              className="flex-1"
            >
              <Save size={16} className="mr-2" />
              {isSubmitting ? '保存中...' : '保存'}
            </CommonButton>
            <CommonButton
              onClick={() => router.push('/user/settings')}
              variant="secondary"
              className="flex-1"
            >
              <X size={16} className="mr-2" />
              キャンセル
            </CommonButton>
          </div>
        </div>
      </main>
    </SettingsLayout>
  );
}
