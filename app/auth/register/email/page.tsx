'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../../../../src/services/auth';
import { API_ENDPOINTS } from '../../../../src/config/api';
import { CommonLayout, CommonInput, CommonButton, CommonErrorMessage } from '../../../../src/components/CommonLayout';

export default function EmailInputPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError('全ての項目を入力してください');
      return;
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('正しいメールアドレスの形式で入力してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // localStorageから一時保存されたデータを取得
      const fullName = localStorage.getItem('tempFullName');
      const birthDate = localStorage.getItem('tempBirthDate');
      const gender = localStorage.getItem('tempGender');

      // デバッグ用：localStorageの値を詳細にログ出力
      console.log('=== localStorage デバッグ情報 ===');
      console.log('tempFullName:', fullName);
      console.log('tempBirthDate:', birthDate);
      console.log('tempGender:', gender);
      console.log('==============================');

      // 各値の存在確認を個別に行い、具体的なエラーメッセージを表示
      if (!fullName) {
        throw new Error('名前の情報が不足しています。名前入力画面からやり直してください。');
      }
      if (!birthDate) {
        throw new Error('誕生日の情報が不足しています。誕生日入力画面からやり直してください。');
      }
      if (!gender) {
        throw new Error('性別の情報が不足しています。性別選択画面からやり直してください。');
      }

      // 日付文字列をDateオブジェクトに変換
      const birthdayDate = new Date(birthDate);
      
      // 送信データをログ出力（デバッグ用）
      const requestData = {
        username: fullName,  // フルネームをそのまま使用
        email: email,
        password: password,
        gender: gender,
        birthday: birthdayDate.toISOString().split('T')[0]  // YYYY-MM-DD形式
      };
      
      console.log('送信データ:', JSON.stringify(requestData, null, 2));
      console.log('API エンドポイント:', API_ENDPOINTS.AUTH.REGISTER_USER);

      // ユーザー登録APIを呼び出し
      const response = await AuthService.registerUser(requestData);

      console.log('User registration successful:', response);
      
      // 一時データをクリア
      localStorage.removeItem('tempFullName');
      localStorage.removeItem('tempBirthDate');
      localStorage.removeItem('tempGender');
      
      // 登録成功後、ログイン画面に遷移
      router.push('/auth/login?registered=true');
    } catch (error) {
      console.error('User registration failed:', error);
      
      // エラーの詳細をログ出力
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        
        // ApiErrorの場合、レスポンスデータも確認
        if ('responseData' in error && error.responseData) {
          console.error('Backend error response:', error.responseData);
        }
      }
      
      setError(error instanceof Error ? error.message : 'ユーザー登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/auth/register/gender');
  };

  // ページ読み込み時にlocalStorageの値を確認
  React.useEffect(() => {
    console.log('=== ページ読み込み時のlocalStorage確認 ===');
    console.log('tempFullName:', localStorage.getItem('tempFullName'));
    console.log('tempBirthDate:', localStorage.getItem('tempBirthDate'));
    console.log('tempGender:', localStorage.getItem('tempGender'));
    console.log('========================================');
  }, []);

  return (
    <CommonLayout 
      title="email" 
      subtitle="アカウントを作成"
      showBackButton={true}
      onBackClick={handleBack}
    >
      <div className="space-y-6">
        {/* メールアドレス入力 */}
        <CommonInput
          label="メールアドレス"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          disabled={loading}
        />
        
        {/* パスワード入力 */}
        <CommonInput
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="6文字以上で入力"
          disabled={loading}
        />
        
        {/* パスワード確認入力 */}
        <CommonInput
          label="パスワード（確認）"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="再度入力してください"
          disabled={loading}
        />
        
        {/* エラーメッセージ */}
        {error && <CommonErrorMessage message={error} />}
        
        {/* 登録ボタン */}
        <CommonButton
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? '登録中...' : 'アカウントを作成'}
        </CommonButton>
      </div>
    </CommonLayout>
  );
}
