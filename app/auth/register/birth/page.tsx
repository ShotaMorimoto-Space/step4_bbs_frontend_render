'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommonLayout, CommonInput, CommonButton, CommonErrorMessage } from '../../../../src/components/CommonLayout';

export default function BirthInputPage() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!birthDate) {
      setError('誕生日を選択してください');
      return;
    }

    // 誕生日をlocalStorageに保存
    localStorage.setItem('tempBirthDate', birthDate);
    
    // 次の画面（性別選択）に遷移
    router.push('/auth/register/gender');
  };

  const handleBack = () => {
    router.push('/auth/register/name');
  };

  // 年齢計算（18歳以上かチェック）
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const isAgeValid = birthDate ? calculateAge(birthDate) >= 18 : true;

  return (
    <CommonLayout 
      title="birth" 
      subtitle="誕生日を教えてください"
      showBackButton={true}
      onBackClick={handleBack}
    >
      <div className="space-y-6">
        {/* 誕生日入力フィールド */}
        <CommonInput
          label="誕生日"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
        />
        
        <p className="text-white text-opacity-70 text-sm text-center">
          18歳以上の方のみご利用いただけます
        </p>
        
        {/* 年齢表示 */}
        {birthDate && (
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-white text-center">
              <span className="font-medium">年齢: {calculateAge(birthDate)}歳</span>
            </p>
            {!isAgeValid && (
              <p className="text-red-300 text-center text-sm mt-1">
                18歳未満の方はご利用いただけません
              </p>
            )}
          </div>
        )}
        
        {/* エラーメッセージ */}
        {error && <CommonErrorMessage message={error} />}
        
        {/* 次へボタン */}
        <CommonButton
          onClick={handleNext}
          disabled={!birthDate || !isAgeValid}
        >
          次へ
        </CommonButton>
      </div>
    </CommonLayout>
  );
}
