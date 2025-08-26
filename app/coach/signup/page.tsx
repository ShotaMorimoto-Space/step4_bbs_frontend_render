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
      // TODO: 実際のAPI呼び出しを実装
      console.log('コーチ登録データ:', formData);
      
      // 成功時の処理 - 直接完了画面に遷移
      router.push('/coach/signup/complete');
    } catch (error) {
      console.error('コーチ登録エラー:', error);
      setErrors({ submit: '登録に失敗しました。もう一度お試しください。' });
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
