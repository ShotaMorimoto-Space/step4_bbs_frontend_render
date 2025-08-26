'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AuthService } from '../../../../../src/services/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
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

    setLoading(true);
    setError('');

    try {
      const response = await AuthService.registerUser({
        username: email, // 一時的にemailをusernameとして使用
        email: email,
        password: password
      });

      console.log('User registration successful:', response);
      
      // 登録成功後、ログイン画面に遷移
      router.push('/auth/login');
    } catch (error) {
      console.error('User registration failed:', error);
      setError(error instanceof Error ? error.message : 'ユーザー登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 flex flex-col p-6">
      <div className="flex items-center justify-between mb-8 pt-4">
        <button
          onClick={() => router.push('/')}
          className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h3 className="text-xl font-semibold text-white">新規登録</h3>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20">
          <div className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-white focus:border-opacity-60"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-white focus:border-opacity-60"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-white focus:border-opacity-60"
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>
            
            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-300 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}
            
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-white text-purple-600 font-semibold py-4 rounded-xl hover:bg-opacity-90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登録中...' : '登録を開始する'}
            </button>
            
            <button
              onClick={() => router.push('/auth/register/detailed')}
              className="w-full bg-purple-500 text-white font-semibold py-4 rounded-xl hover:bg-purple-600 transition-colors shadow-lg"
            >
              詳細登録画面へ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
