'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommonLayout, CommonButton, CommonInput, CommonErrorMessage } from '@/components/CommonLayout';
import { Mail, Lock, User, Trophy } from 'lucide-react';
import { safeLocalStorage } from '@/utils/storage';

export default function LoginPage() {
  const router = useRouter();
  
  // フォームの状態
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 入力フィールドの変更処理
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // バリデーション
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.password) {
      newErrors.password = 'パスワードは必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('=== ログイン処理開始 ===');
      console.log('フォームデータ:', formData);
      
      // バックエンドAPIにログインリクエストを送信
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';
      const loginUrl = `${apiUrl}/auth/token`;
      
      console.log('ログインAPI呼び出し:', { 
        url: loginUrl, 
        email: formData.email,
        apiUrl: apiUrl 
      });
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`
      });

      if (!response.ok) {
        console.error('ログインAPIエラー:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
        
        let errorMessage = 'ログインに失敗しました';
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

            const loginData = await response.json();
      console.log('ログイン成功:', loginData);
      console.log('ログインレスポンス詳細:', {
        response: loginData,
        responseType: typeof loginData,
        responseKeys: loginData ? Object.keys(loginData) : 'null'
      });

      // バックエンドから返されたデータを取得
      const { access_token, token_type, role } = loginData;
      
      console.log('抽出されたデータ:', {
        access_token: access_token ? 'あり' : 'なし',
        token_type,
        role: role || 'なし'
      });
      
      // ログイン成功後、ユーザー情報を取得
      if (access_token) {
        // アクセストークンを保存
        safeLocalStorage.setItem('access_token', access_token);
        
        // ユーザー情報を取得するために /me エンドポイントを呼び出し
        try {
          const meUrl = `${apiUrl}/auth/me`;
          console.log('ユーザー情報取得API呼び出し:', meUrl);
          
          const meResponse = await fetch(meUrl, {
            headers: {
              'Authorization': `Bearer ${access_token}`
            }
          });
          
          if (meResponse.ok) {
            const userData = await meResponse.json();
            console.log('ユーザー情報取得成功:', userData);
            
            // ユーザー情報をlocalStorageに保存
            if (userData.role === 'user' && userData.profile) {
              safeLocalStorage.setItem('user_type', 'user');
              safeLocalStorage.setItem('user_email', userData.profile.email);
              safeLocalStorage.setItem('user_id', userData.profile.user_id);
              safeLocalStorage.setItem('user_name', userData.profile.username);
            } else if (userData.role === 'coach' && userData.profile) {
              safeLocalStorage.setItem('user_type', 'coach');
              safeLocalStorage.setItem('user_email', userData.profile.email);
              safeLocalStorage.setItem('user_id', userData.profile.coach_id);
              safeLocalStorage.setItem('user_name', userData.profile.coachname);
            }
            
            console.log('localStorage保存完了:', {
              user_type: safeLocalStorage.getItem('user_type'),
              user_email: safeLocalStorage.getItem('user_email'),
              user_id: safeLocalStorage.getItem('user_id'),
              user_name: safeLocalStorage.getItem('user_name')
            });
            
            // roleに基づいて適切な画面に遷移
            if (userData.role === 'coach') {
              console.log('コーチホームに遷移します');
              router.push('/coach/home');
            } else {
              console.log('ユーザーホームに遷移します');
              router.push('/user/home');
            }
          } else {
            console.error('ユーザー情報取得失敗:', meResponse.status, meResponse.statusText);
            throw new Error('ユーザー情報の取得に失敗しました');
          }
        } catch (meError) {
          console.error('ユーザー情報取得エラー:', meError);
          throw new Error('ユーザー情報の取得に失敗しました');
        }
      } else {
        throw new Error('アクセストークンが取得できませんでした');
      }
      
      
    } catch (error) {
      console.error('ログインエラー:', error);
      
      let errorMessage = 'ログインに失敗しました。もう一度お試しください。';
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('エラーの詳細:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ユーザー登録画面に遷移
  const handleGoToUserSignup = () => {
    router.push('/auth/register');
  };

  // コーチ登録画面に遷移
  const handleGoToCoachSignup = () => {
    router.push('/coach/signup');
  };

  return (
    <CommonLayout
      title="Welcome Back"
      subtitle="アカウントにログインして、ゴルフの世界を楽しみましょう"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ログインフォーム */}
        <div className="space-y-4">
          <CommonInput
            label="メールアドレス"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="your@email.com"
            error={errors.email}
            required
          />
          
          <CommonInput
            label="パスワード"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="パスワードを入力"
            error={errors.password}
            required
          />
        </div>

        {/* エラーメッセージ */}
        {errors.submit && (
          <CommonErrorMessage message={errors.submit} />
        )}

        {/* ログインボタン */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-semibold py-4 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-white bg-opacity-95 hover:bg-opacity-100 text-gray-800 mt-6"
        >
          {isSubmitting ? 'ログイン中...' : 'ログイン'}
        </button>

        {/* アカウント作成への誘導 */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/60">アカウントをお持ちでない方</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CommonButton
              variant="secondary"
              onClick={handleGoToUserSignup}
              className="w-full"
            >
              <User size={20} />
              ユーザー登録
            </CommonButton>
            
            <CommonButton
              variant="secondary"
              onClick={handleGoToCoachSignup}
              className="w-full"
            >
              <Trophy size={20} />
              コーチ登録
            </CommonButton>
          </div>
        </div>

        {/* パスワードリセット */}
        <div className="text-center">
          <button
            type="button"
            className="text-white/70 hover:text-white text-sm font-medium hover:underline"
          >
            パスワードを忘れた方はこちら
          </button>
        </div>
      </form>
    </CommonLayout>
  );
}
