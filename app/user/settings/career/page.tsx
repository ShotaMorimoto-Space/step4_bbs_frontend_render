'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import { SettingsLayout } from '@/components/SettingsLayout';
import { CommonButton, CommonInput, CommonErrorMessage } from '@/components/CommonLayout';
import { safeLocalStorage } from '@/utils/storage';

export default function CareerEditPage() {
  const router = useRouter();
  
  // ユーザー情報の状態
  const [userInfo, setUserInfo] = useState({
    sportExp: '',
    industry: '',
    jobTitle: '',
    position: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 選択肢の定数
  const SPORT_OPTIONS = [
    'サッカー', '野球', 'テニス', 'バスケットボール', 'バレーボール', '卓球', 'バドミントン',
    '陸上競技', '水泳', '柔道', '剣道', '空手', '弓道', 'アーチェリー',
    'スキー', 'スノーボード', 'スケート', 'フィギュアスケート',
    '体操', '新体操', 'ダンス', 'その他'
  ];

  const INDUSTRY_OPTIONS = [
    'IT・ソフトウェア', '金融・保険', '製造業', '建設業', '不動産',
    '小売・流通', '運輸・物流', '医療・福祉', '教育', '公務員',
    'メディア・広告', 'コンサルティング', '法律・会計', '飲食・宿泊',
    '美容・ファッション', 'エンターテイメント', 'その他'
  ];

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
        sportExp: safeLocalStorage.getItem('user_sport_exp') || '',
        industry: safeLocalStorage.getItem('user_industry') || '',
        jobTitle: safeLocalStorage.getItem('user_job_title') || '',
        position: safeLocalStorage.getItem('user_position') || ''
      });
    };

    checkAuth();
  }, [router]);

  // 経歴・職歴情報更新
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
        sport_exp: userInfo.sportExp,
        industry: userInfo.industry,
        job_title: userInfo.jobTitle,
        position: userInfo.position
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
        throw new Error(errorData.detail || '経歴・職歴情報の更新に失敗しました');
      }

      // ローカルストレージに保存
      safeLocalStorage.setItem('user_sport_exp', userInfo.sportExp);
      safeLocalStorage.setItem('user_industry', userInfo.industry);
      safeLocalStorage.setItem('user_job_title', userInfo.jobTitle);
      safeLocalStorage.setItem('user_position', userInfo.position);
      
      setSuccessMessage('経歴・職歴情報が更新されました');
      
      setTimeout(() => {
        router.push('/user/settings');
      }, 1500);
    } catch (error: any) {
      console.error('経歴・職歴情報更新エラー:', error);
      setErrorMessage(error.message || '経歴・職歴情報の更新に失敗しました');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsLayout title="経歴・職歴編集">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => router.push('/user/settings')}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
        >
          <X size={20} className="text-white" />
        </button>
        <h1 className="text-white text-lg font-medium">経歴・職歴編集</h1>
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
          <h3 className="text-white text-lg font-medium mb-6">経歴・職歴情報</h3>
          
          <div className="space-y-6">
            {/* スポーツ経験 */}
            <div>
              <label className="block text-white/70 text-sm mb-2">スポーツ経験</label>
              <select
                value={userInfo.sportExp}
                onChange={(e) => setUserInfo(prev => ({ ...prev, sportExp: e.target.value }))}
                className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/20 focus:outline-none focus:border-white/40"
              >
                <option value="">選択してください</option>
                {SPORT_OPTIONS.map((sport) => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>

            {/* 業界 */}
            <div>
              <label className="block text-white/70 text-sm mb-2">業界</label>
              <select
                value={userInfo.industry}
                onChange={(e) => setUserInfo(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/20 focus:outline-none focus:border-white/40"
              >
                <option value="">選択してください</option>
                {INDUSTRY_OPTIONS.map((industry) => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            {/* 職種 */}
            <div>
              <CommonInput
                label="職種"
                type="text"
                value={userInfo.jobTitle}
                onChange={(e) => setUserInfo(prev => ({ ...prev, jobTitle: e.target.value }))}
                placeholder="例: エンジニア、営業、デザイナーなど"
              />
            </div>

            {/* 役職 */}
            <div>
              <CommonInput
                label="役職"
                type="text"
                value={userInfo.position}
                onChange={(e) => setUserInfo(prev => ({ ...prev, position: e.target.value }))}
                placeholder="例: 部長、課長、主任など"
              />
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
