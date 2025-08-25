'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommonLayout, CommonButton, CommonErrorMessage } from '@/src/components/CommonLayout';

export default function GenderSelectionPage() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!selectedGender) {
      setError('性別を選択してください');
      return;
    }

    // 性別をlocalStorageに保存
    localStorage.setItem('tempGender', selectedGender);
    
    // 次の画面（メールアドレス入力）に遷移
    router.push('/auth/register/email');
  };

  const handleBack = () => {
    router.push('/auth/register/birth');
  };

  const genderOptions = [
    { value: 'male', label: '男性', icon: '👨' },
    { value: 'female', label: '女性', icon: '👩' }
  ];

  return (
    <CommonLayout 
      title="gender" 
      subtitle="性別を教えてください"
      showBackButton={true}
      onBackClick={handleBack}
    >
      <div className="space-y-6">
        <div className="text-center">
          <label className="block text-white text-sm font-medium mb-4 text-center">
            性別を選択してください
          </label>
          
          <div className="space-y-3 max-w-xs mx-auto">
            {genderOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedGender(option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedGender === option.value
                    ? 'bg-white bg-opacity-95 border-white text-gray-800 shadow-lg'
                    : 'bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-30 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* エラーメッセージ */}
        {error && <CommonErrorMessage message={error} />}
        
        {/* 次へボタン */}
        <CommonButton
          onClick={handleNext}
          disabled={!selectedGender}
        >
          次へ
        </CommonButton>
      </div>
    </CommonLayout>
  );
}
