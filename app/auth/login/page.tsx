'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommonLayout, CommonButton, CommonInput, CommonErrorMessage } from '@/components/CommonLayout';
import { Mail, Lock, User, Trophy } from 'lucide-react';

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
      // TODO: 実際のAPI呼び出しを実装
      console.log('ログインデータ:', formData);
      
      // 仮のログイン処理（実際の実装ではAPIレスポンスからusertypeを取得）
      // UUID v4を生成する関数
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
      const mockResponse = {
        success: true,
        user: {
          id: generateUUID(), // 動的にUUIDを生成
          email: formData.email,
          usertype: formData.email.includes('coach') ? 'coach' : 'user' // 仮の判定ロジック
        }
      };

      if (mockResponse.success) {
        // ユーザー情報をlocalStorageに保存
        localStorage.setItem('user_type', mockResponse.user.usertype);
        localStorage.setItem('user_email', mockResponse.user.email);
        localStorage.setItem('user_id', mockResponse.user.id);
        
        // アクセストークンを生成して保存（実際の実装ではAPIレスポンスから取得）
        const mockAccessToken = `mock_token_${mockResponse.user.id}_${Date.now()}`;
        localStorage.setItem('access_token', mockAccessToken);
        
        console.log('ログイン成功:', {
          usertype: mockResponse.user.usertype,
          email: mockResponse.user.email,
          id: mockResponse.user.id,
          accessToken: mockAccessToken ? '生成済み' : 'なし'
        });
        
        // usertypeに基づいて適切な画面に遷移
        if (mockResponse.user.usertype === 'coach') {
          console.log('コーチホームに遷移します');
          router.push('/coach/home');
        } else {
          console.log('ユーザーホームに遷移します');
          router.push('/user/home');
        }
      } else {
        setErrors({ submit: 'ログインに失敗しました。メールアドレスとパスワードを確認してください。' });
      }
      
    } catch (error) {
      console.error('ログインエラー:', error);
      setErrors({ submit: 'ログインに失敗しました。もう一度お試しください。' });
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
