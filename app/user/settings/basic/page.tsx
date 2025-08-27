'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, User, Camera } from 'lucide-react';
import { SettingsLayout } from '@/components/SettingsLayout';
import { CommonButton, CommonInput, CommonErrorMessage } from '@/components/CommonLayout';
import { safeLocalStorage } from '@/utils/storage';

export default function BasicInfoEditPage() {
  const router = useRouter();
  
  // ユーザー情報の状態
  const [userInfo, setUserInfo] = useState({
    name: '',
    birthDate: '',
    gender: '',
    avatar: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 認証状態の確認とユーザー情報の取得
  useEffect(() => {
    const checkAuthAndFetchUserInfo = async () => {
      const token = safeLocalStorage.getItem('access_token');
      const email = safeLocalStorage.getItem('user_email');
      const userId = safeLocalStorage.getItem('user_id');
      
      console.log('認証チェック:', {
        token: token ? 'あり' : 'なし',
        email: email || 'なし',
        userId: userId || 'なし'
      });
      
      if (!token || !email || !userId) {
        console.log('認証情報不足のためログインページに遷移');
        router.push('/auth/login');
        return;
      }

      // バックエンドから最新のユーザー情報を取得
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';
        const userInfoUrl = `${apiUrl}/auth/me`;
        
        console.log('初期ユーザー情報取得API呼び出し:', userInfoUrl);
        
        const response = await fetch(userInfoUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          console.log('初期ユーザー情報取得成功:', userData);
          
          // バックエンドから取得したデータで初期化
          if (userData.role === 'user' && userData.profile) {
            setUserInfo({
              name: userData.profile.username || '',
              birthDate: userData.profile.birthday || '',
              gender: userData.profile.gender || '',
              avatar: userData.profile.profile_picture_url || ''
            });
            
            // localStorageにも保存
            safeLocalStorage.setItem('user_name', userData.profile.username || '');
            safeLocalStorage.setItem('user_birth_date', userData.profile.birthday || '');
            safeLocalStorage.setItem('user_gender', userData.profile.gender || '');
            safeLocalStorage.setItem('user_avatar', userData.profile.profile_picture_url || '');
            
            console.log('初期ユーザー情報設定完了:', {
              name: userData.profile.username,
              birthDate: userData.profile.birthday,
              gender: userData.profile.gender,
              avatar: userData.profile.profile_picture_url ? 'あり' : 'なし'
            });
          }
        } else {
          console.error('初期ユーザー情報取得失敗:', response.status, response.statusText);
          // フォールバック: localStorageから取得
          setUserInfo({
            name: safeLocalStorage.getItem('user_name') || '',
            birthDate: safeLocalStorage.getItem('user_birth_date') || '',
            gender: safeLocalStorage.getItem('user_gender') || '',
            avatar: safeLocalStorage.getItem('user_avatar') || ''
          });
        }
      } catch (error) {
        console.error('初期ユーザー情報取得エラー:', error);
        // フォールバック: localStorageから取得
        setUserInfo({
          name: safeLocalStorage.getItem('user_name') || '',
          birthDate: safeLocalStorage.getItem('user_birth_date') || '',
          gender: safeLocalStorage.getItem('user_gender') || '',
          avatar: safeLocalStorage.getItem('user_avatar') || ''
        });
      }
    };

    checkAuthAndFetchUserInfo();
  }, [router]);

  // アバター画像変更
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('ファイルサイズは5MB以下にしてください');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    // ファイル形式チェック
    if (!file.type.startsWith('image/')) {
      setErrorMessage('画像ファイルを選択してください');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    // 画像をプレビュー表示
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUserInfo(prev => ({ ...prev, avatar: result }));
    };
    reader.readAsDataURL(file);

    // ファイル選択をリセット（同じファイルを再度選択できるように）
    e.target.value = '';
  };

  // 基本情報更新
  const handleUpdate = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const accessToken = safeLocalStorage.getItem('access_token');
      const userId = safeLocalStorage.getItem('user_id');
      
      // デバッグ情報をコンソールに出力
      console.log('認証情報確認:', {
        accessToken: accessToken ? 'あり' : 'なし',
        userId: userId || 'なし',
        userEmail: safeLocalStorage.getItem('user_email') || 'なし',
        localStorageKeys: typeof window !== 'undefined' ? Object.keys(window.localStorage) : []
      });
      
      // localStorageの内容を詳細に確認
      console.log('localStorage詳細:', {
        access_token: safeLocalStorage.getItem('access_token') ? 'あり' : 'なし',
        user_id: safeLocalStorage.getItem('user_id') || 'なし',
        user_email: safeLocalStorage.getItem('user_email') || 'なし',
        user_type: safeLocalStorage.getItem('user_type') || 'なし'
      });
      
      if (!accessToken) {
        throw new Error('アクセストークンが不足しています');
      }
      
      // userIdが取得できない場合は、メールアドレスから取得を試行
      let actualUserId = userId;
      if (!actualUserId) {
        const email = safeLocalStorage.getItem('user_email');
        if (email) {
          console.log('メールアドレスからユーザーID取得を試行:', email);
          
          // バックエンドAPIからユーザー情報を取得
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';
            const userInfoUrl = `${apiUrl}/auth/me`;
            
            console.log('ユーザー情報取得API呼び出し:', userInfoUrl);
            
            const response = await fetch(userInfoUrl, {
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            });
            
            if (response.ok) {
              const userData = await response.json();
              console.log('ユーザー情報取得APIレスポンス詳細:', userData);
              
              // レスポンスからuser_idを取得
              let fetchedUserId = null;
              if (userData.profile && userData.profile.user_id) {
                fetchedUserId = userData.profile.user_id;
              } else if (userData.user_id) {
                fetchedUserId = userData.user_id;
              } else if (userData.id) {
                fetchedUserId = userData.id;
              } else if (userData.user && userData.user.user_id) {
                fetchedUserId = userData.user.user_id;
              }
              
              if (fetchedUserId) {
                actualUserId = fetchedUserId;
                console.log('APIから取得したユーザーID:', fetchedUserId);
                
                // localStorageに保存
                safeLocalStorage.setItem('user_id', fetchedUserId);
              } else {
                console.warn('ユーザー情報取得APIレスポンスにuser_idが含まれていません:', userData);
              }
            } else {
              console.error('ユーザー情報取得失敗:', response.status, response.statusText);
              const errorText = await response.text();
              console.error('エラーレスポンス詳細:', errorText);
            }
          } catch (error) {
            console.error('ユーザー情報取得エラー:', error);
          }
        } else {
          console.warn('メールアドレスも取得できません');
        }
      }
      
      if (!actualUserId) {
        console.error('ユーザーID取得失敗の詳細:', {
          localStorageUserId: userId,
          localStorageEmail: safeLocalStorage.getItem('user_email'),
          localStorageKeys: typeof window !== 'undefined' ? Object.keys(window.localStorage) : []
        });
        throw new Error('ユーザーIDが取得できません。ログインし直してください。');
      }

      // バックエンドに送信するデータを準備
      const updateData = {
        username: userInfo.name || null,
        gender: userInfo.gender || null,
        birthday: userInfo.birthDate ? new Date(userInfo.birthDate).toISOString().split('T')[0] : null,
        profile_picture_url: userInfo.avatar || null
      };

      // 空文字列をnullに変換
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === '') {
          (updateData as any)[key] = null;
        }
      });

      console.log('送信データ:', {
        ...updateData,
        user_id: actualUserId
      });

      // バックエンドAPIのベースURL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';
      const profileUrl = `${apiUrl}/auth/user/${actualUserId}/profile`;
      
      console.log('プロフィール更新APIを呼び出し:', {
        url: profileUrl,
        userId: actualUserId,
        hasToken: !!accessToken
      });
      
      // バックエンドAPIに送信
      console.log('fetch実行前の詳細:', {
        url: profileUrl,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken ? accessToken.substring(0, 20) + '...' : 'なし'}`
        },
        body: updateData
      });
      
      let response: Response;
      try {
        response = await fetch(profileUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(updateData)
        });
        
        console.log('fetch実行成功:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          url: response.url
        });
      } catch (fetchError: any) {
        console.error('fetch実行エラー詳細:', {
          error: fetchError,
          errorType: fetchError?.constructor?.name || 'unknown',
          errorMessage: fetchError?.message || 'Unknown error',
          errorStack: fetchError?.stack || 'No stack trace'
        });
        throw fetchError;
      }

      console.log('APIレスポンス:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        console.error('APIレスポンスエラー:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
        
        let errorMessage = '基本情報の更新に失敗しました';
        try {
          const errorData = await response.json();
          console.error('エラーレスポンス詳細:', errorData);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (parseError) {
          console.error('エラーレスポンスのパースに失敗:', parseError);
          const errorText = await response.text();
          console.error('エラーレスポンス（テキスト）:', errorText);
        }
        
        throw new Error(errorMessage);
      }

      // ローカルストレージに保存
      safeLocalStorage.setItem('user_name', userInfo.name);
      safeLocalStorage.setItem('user_gender', userInfo.gender);
      safeLocalStorage.setItem('user_birth_date', userInfo.birthDate);
      safeLocalStorage.setItem('user_avatar', userInfo.avatar);
      
      setSuccessMessage('基本情報が更新されました');
      
      setTimeout(() => {
        router.push('/user/settings');
      }, 1500);
    } catch (error: any) {
      console.error('基本情報更新エラー:', error);
      setErrorMessage(error.message || '基本情報の更新に失敗しました');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsLayout title="基本情報編集">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => router.push('/user/settings')}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
        >
          <X size={20} className="text-white" />
        </button>
        <h1 className="text-white text-lg font-medium">基本情報編集</h1>
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

        {/* デバッグ情報 */}
        <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 text-xs">
          <div>デバッグ情報:</div>
          <div>アクセストークン: {safeLocalStorage.getItem('access_token') ? 'あり' : 'なし'}</div>
          <div>ユーザーID: {safeLocalStorage.getItem('user_id') || 'なし'}</div>
          <div>メール: {safeLocalStorage.getItem('user_email') || 'なし'}</div>
        </div>

        {/* 編集フォーム */}
        <div className="bg-white/10 rounded-2xl p-6">
          <h3 className="text-white text-lg font-medium mb-6">基本情報</h3>
          
          <div className="space-y-6">
            {/* プロフィール画像 */}
            <div className="flex items-center gap-4">
              <div 
                onClick={() => document.getElementById('avatar-input')?.click()}
                className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-white/30 transition-colors relative group"
              >
                {userInfo.avatar ? (
                  <img src={userInfo.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={32} className="text-white/70" />
                )}
                {/* ホバー時のオーバーレイ */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={(e) => handleAvatarChange(e)}
                className="hidden"
              />
              <div className="text-white/70 text-sm">
                画像をタップして<br />変更できます
              </div>
            </div>

            {/* 名前 */}
            <div>
              <CommonInput
                label="名前"
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="名前を入力"
              />
            </div>

            {/* 生年月日 */}
            <div>
              <CommonInput
                label="生年月日"
                type="date"
                value={userInfo.birthDate}
                onChange={(e) => setUserInfo(prev => ({ ...prev, birthDate: e.target.value }))}
              />
            </div>

            {/* 性別 */}
            <div>
              <label className="block text-white/70 text-sm mb-2">性別</label>
              <select
                value={userInfo.gender}
                onChange={(e) => setUserInfo(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/20 focus:outline-none focus:border-white/40"
              >
                <option value="">選択してください</option>
                <option value="male">男性</option>
                <option value="female">女性</option>
                <option value="other">その他</option>
              </select>
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
        </div>
      </main>
    </SettingsLayout>
  );
}
