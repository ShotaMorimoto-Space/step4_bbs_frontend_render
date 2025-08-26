'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';

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
      const token = localStorage.getItem('access_token');
      const email = localStorage.getItem('user_email');
      
      if (!token || !email) {
        router.push('/auth/login');
        return;
      }

      // ユーザー情報をローカルストレージから取得
      setUserInfo({
        sportExp: localStorage.getItem('user_sport_exp') || '',
        industry: localStorage.getItem('user_industry') || '',
        jobTitle: localStorage.getItem('user_job_title') || '',
        position: localStorage.getItem('user_position') || ''
      });
    };

    checkAuth();
  }, [router]);

  // 経歴・職歴情報更新
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
      localStorage.setItem('user_sport_exp', userInfo.sportExp);
      localStorage.setItem('user_industry', userInfo.industry);
      localStorage.setItem('user_job_title', userInfo.jobTitle);
      localStorage.setItem('user_position', userInfo.position);
      
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
            <h1 className="text-xl font-bold">経歴・職歴編集</h1>
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
              <label className="block text-white/70 text-sm mb-2">職種</label>
              <input
                type="text"
                value={userInfo.jobTitle}
                onChange={(e) => setUserInfo(prev => ({ ...prev, jobTitle: e.target.value }))}
                className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/20 focus:outline-none focus:border-white/40"
                placeholder="例: エンジニア、営業、デザイナーなど"
              />
            </div>

            {/* 役職 */}
            <div>
              <label className="block text-white/70 text-sm mb-2">役職</label>
              <input
                type="text"
                value={userInfo.position}
                onChange={(e) => setUserInfo(prev => ({ ...prev, position: e.target.value }))}
                className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/20 focus:outline-none focus:border-white/40"
                placeholder="例: 部長、課長、主任など"
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
