'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X } from 'lucide-react';
import { SettingsLayout } from '@/components/SettingsLayout';
import { CommonButton, CommonInput, CommonErrorMessage } from '@/components/CommonLayout';

export default function ProfileEditPage() {
  const router = useRouter();
  
  // ユーザー情報の状態
  const [userInfo, setUserInfo] = useState({
    bio: '',
    lineUserId: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // バックエンドAPIのベースURL
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';

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
        bio: localStorage.getItem('user_bio') || '',
        lineUserId: localStorage.getItem('user_line_user_id') || ''
      });
    };

    checkAuth();
  }, [router]);

  // プロフィール情報更新
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
        bio: userInfo.bio,
        line_user_id: userInfo.lineUserId
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
        throw new Error(errorData.detail || 'プロフィール情報の更新に失敗しました');
      }

      // ローカルストレージに保存
      localStorage.setItem('user_bio', userInfo.bio);
      localStorage.setItem('user_line_user_id', userInfo.lineUserId);
      
      setSuccessMessage('プロフィール情報が更新されました');
      
      setTimeout(() => {
        router.push('/user/settings');
      }, 1500);
    } catch (error: any) {
      console.error('プロフィール情報更新エラー:', error);
      setErrorMessage(error.message || 'プロフィール情報の更新に失敗しました');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsLayout
      title="プロフィール編集"
      subtitle="プロフィール情報を更新"
      showBackButton={true}
      onBackClick={() => router.push('/user/settings')}
    >
      {/* メッセージ表示 */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300">
          {successMessage}
        </div>
      )}
      
      {errorMessage && <CommonErrorMessage message={errorMessage} />}

      {/* 編集フォーム */}
      <div className="space-y-6">
        {/* プロフィール文 */}
        <div>
          <label className="block text-white/70 text-sm mb-2">プロフィール文</label>
          <textarea
            value={userInfo.bio}
            onChange={(e) => setUserInfo(prev => ({ ...prev, bio: e.target.value }))}
            className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/20 focus:outline-none focus:border-white/40 resize-none"
            rows={4}
            placeholder="自己紹介を入力してください"
          />
        </div>

        {/* LINEユーザーID */}
        <div>
          <label className="block text-white/70 text-sm mb-2">LINEユーザーID</label>
          <input
            type="text"
            value={userInfo.lineUserId}
            onChange={(e) => setUserInfo(prev => ({ ...prev, lineUserId: e.target.value }))}
            className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/20 focus:outline-none focus:border-white/40"
            placeholder="LINEユーザーIDを入力"
          />
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex gap-3 mt-8">
        <CommonButton
          onClick={handleUpdate}
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Save size={16} />
          {isSubmitting ? '保存中...' : '保存'}
        </CommonButton>
        <CommonButton
          variant="secondary"
          onClick={() => router.push('/user/settings')}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <X size={16} />
          キャンセル
        </CommonButton>
      </div>
    </SettingsLayout>
  );
}
