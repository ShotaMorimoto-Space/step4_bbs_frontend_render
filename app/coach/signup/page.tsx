'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CoachLayout } from '@/components/CoachLayout';
import { CoachButton, CoachInput, CoachTextarea, CoachSelect } from '@/components/CoachCommonLayout';
import { User, Mail, Lock, Phone, MapPin, Award, Calendar } from 'lucide-react';

export default function CoachSignupPage() {
  const router = useRouter();
  
  // フォームの状態
  const [formData, setFormData] = useState({
    coachname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    certification: '',
    experience: '',
    bio: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 入力フィールドの変更処理
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // バリデーション
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.coachname.trim()) {
      newErrors.coachname = 'コーチ名は必須です';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.password) {
      newErrors.password = 'パスワードは必須です';
    } else if (formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '電話番号は必須です';
    }

    if (!formData.location.trim()) {
      newErrors.location = '所在地は必須です';
    }

    if (!formData.experience) {
      newErrors.experience = 'ゴルフ経験年数は必須です';
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
      // コーチ登録APIを呼び出し
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';
      const coachSignupUrl = `${apiUrl}/auth/register/coach`;
      
      // バックエンドのヘルスチェック
      try {
        const healthUrl = `${apiUrl.replace('/api/v1', '')}`;
        console.log('バックエンドヘルスチェック開始:', healthUrl);
        
        const healthResponse = await fetch(healthUrl, { method: 'GET' });
        console.log('ヘルスチェック結果:', {
          status: healthResponse.status,
          statusText: healthResponse.statusText,
          ok: healthResponse.ok
        });
        
        if (healthResponse.ok) {
          const healthData = await healthResponse.text();
          console.log('ヘルスチェックレスポンス:', healthData);
        }
      } catch (healthError) {
        console.warn('ヘルスチェック失敗:', healthError);
      }
      
      const requestBody = {
        coachname: formData.coachname,
        email: formData.email,
        password: formData.password,
        birthday: '1980-01-01', // デフォルト値（後で修正可能）
        sex: 'male', // デフォルト値（後で修正可能）
        usertype: 'coach',
        SNS_handle_instagram: '',
        SNS_handle_X: '',
        SNS_handle_youtube: '',
        SNS_handle_facebook: '',
        SNS_handle_tiktok: '',
        line_user_id: '',
        profile_picture_url: '',
        bio: formData.bio || '',
        hourly_rate: 5000, // デフォルト値
        location_id: '1', // 文字列として送信
        golf_exp: parseInt(formData.experience) || 1, // 数値として送信
        certification: formData.certification || '',
        setting_1: '',
        setting_2: '',
        setting_3: '',
        lesson_rank: 'beginner'
      };
      
      console.log('コーチ登録API呼び出し:', {
        url: coachSignupUrl,
        formData: formData,
        requestBody: requestBody
      });
      
      console.log('fetch実行前の詳細:', {
        url: coachSignupUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody
      });
      
      let response: Response;
      try {
        response = await fetch(coachSignupUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
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
      
      if (!response.ok) {
        console.error('コーチ登録APIエラー:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
        
        let errorMessage = 'コーチ登録に失敗しました';
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
      
      const result = await response.json();
      console.log('コーチ登録成功:', result);
      
      // 成功時の処理 - 完了画面に遷移
      router.push('/coach/signup/complete');
    } catch (error) {
      console.error('コーチ登録エラー:', error);
      
      let errorMessage = '登録に失敗しました。もう一度お試しください。';
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('エラーの詳細:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        
        // ネットワークエラーの場合は具体的なメッセージを表示
        if (error.message === 'Failed to fetch') {
          errorMessage = 'バックエンドサーバーに接続できません。しばらく時間をおいてから再度お試しください。';
        }
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 経験年数のオプション
  const experienceOptions = [
    { value: '1-3', label: '1-3年' },
    { value: '4-6', label: '4-6年' },
    { value: '7-10', label: '7-10年' },
    { value: '11-15', label: '11-15年' },
    { value: '16-20', label: '16-20年' },
    { value: '21+', label: '21年以上' }
  ];

  // 認定資格のオプション
  const certificationOptions = [
    { value: 'pga', label: 'PGA認定プロ' },
    { value: 'jpga', label: 'JPGA認定プロ' },
    { value: 'other', label: 'その他の認定' },
    { value: 'none', label: '認定なし' }
  ];

  return (
    <CoachLayout
      title="Coach Signup"
      subtitle="コーチアカウントを作成して、ゴルファーをサポートしましょう"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本情報 */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium mb-3 flex items-center gap-2">
            <User size={20} className="text-orange-400" />
            基本情報
          </h3>
          
          <CoachInput
            label="コーチ名"
            value={formData.coachname}
            onChange={(e) => handleInputChange('coachname', e.target.value)}
            placeholder="山田 太郎"
            error={errors.coachname}
            required
          />
          
          <CoachInput
            label="メールアドレス"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="coach@example.com"
            error={errors.email}
            required
          />
          
          <CoachInput
            label="パスワード"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="8文字以上で入力"
            error={errors.password}
            required
          />
          
          <CoachInput
            label="パスワード（確認）"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="パスワードを再入力"
            error={errors.confirmPassword}
            required
          />
        </div>

        {/* 連絡先・所在地 */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium mb-3 flex items-center gap-2">
            <Phone size={20} className="text-orange-400" />
            連絡先・所在地
          </h3>
          
          <CoachInput
            label="電話番号"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="090-1234-5678"
            error={errors.phone}
            required
          />
          
          <CoachInput
            label="所在地"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="東京都渋谷区..."
            error={errors.location}
            required
          />
        </div>

        {/* ゴルフ経験・資格 */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium mb-3 flex items-center gap-2">
            <Award size={20} className="text-orange-400" />
            ゴルフ経験・資格
          </h3>
          
          <CoachSelect
            label="ゴルフ経験年数"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            options={experienceOptions}
            placeholder="経験年数を選択"
            error={errors.experience}
            required
          />
          
          <CoachSelect
            label="認定資格"
            value={formData.certification}
            onChange={(e) => handleInputChange('certification', e.target.value)}
            options={certificationOptions}
            placeholder="資格を選択"
            error={errors.certification}
          />
        </div>

        {/* 自己紹介 */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium mb-3 flex items-center gap-2">
            <User size={20} className="text-orange-400" />
            自己紹介
          </h3>
          
          <CoachTextarea
            label="自己紹介"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="ゴルフ指導の経験や、得意な分野、指導方針などを教えてください"
            rows={4}
          />
        </div>

        {/* 利用規約・プライバシーポリシー */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium mb-3">利用規約・プライバシーポリシー</h3>
          
          <div className="bg-white/5 rounded-xl p-4">
            <div className="space-y-3">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  required
                  className="w-5 h-5 text-orange-600 bg-white/20 border-white/30 rounded focus:ring-orange-500 focus:ring-2 mt-0.5"
                />
                <span className="text-white/80 text-sm leading-relaxed">
                  <a href="/terms" className="text-orange-400 hover:text-orange-300 underline">利用規約</a>
                  と
                  <a href="/privacy" className="text-orange-400 hover:text-orange-300 underline">プライバシーポリシー</a>
                  に同意します
                </span>
              </label>
              
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  required
                  className="w-5 h-5 text-orange-600 bg-white/20 border-white/30 rounded focus:ring-orange-500 focus:ring-2 mt-0.5"
                />
                <span className="text-white/80 text-sm leading-relaxed">
                  提供した情報が真実であることを確認し、虚偽の申告がないことを誓約します
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* エラーメッセージ */}
        {errors.submit && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm">
            {errors.submit}
          </div>
        )}

        {/* 送信ボタン */}
        <CoachButton
          type="submit"
          disabled={isSubmitting}
          className="mt-8"
        >
          {isSubmitting ? '登録中...' : '登録を完了する'}
        </CoachButton>
      </form>
    </CoachLayout>
  );
}
