'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommonLayout, CommonInput, CommonButton, CommonErrorMessage } from '../../../../src/components/CommonLayout';

export default function NameInputPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!fullName.trim()) { // Updated validation
      setError('お名前を入力してください'); // Updated error message
      return;
    }

    // フルネームをそのままlocalStorageに保存（DBのusernameフィールド用）
    localStorage.setItem('tempFullName', fullName.trim());
    
    // 次の画面（誕生日入力）に遷移
    router.push('/auth/register/birth');
  };

  return (
    <CommonLayout 
      title="name" 
      subtitle="お名前を入力してください"
      showBackButton={true}
      onBackClick={() => router.push('/onboarding')}
    >
      <div className="space-y-6">
        {/* 名前入力フィールド */}
        <CommonInput
          label="お名前"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="山田 太郎"
          maxLength={20}
        />
        
        {/* コーチ登録ボタン */}
        <CommonButton
          variant="danger"
          onClick={() => router.push('/coach/signup')}
        >
          コーチとして登録希望の方はこちら
        </CommonButton>
        
        <p className="text-white/70 text-xs text-center">
          ※コーチ登録は運営審査後に有効となります
        </p>
        
        {/* エラーメッセージ */}
        {error && <CommonErrorMessage message={error} />}
        
        {/* 次へボタン */}
        <CommonButton onClick={handleNext}>
          次へ
        </CommonButton>
      </div>
    </CommonLayout>
  );
}
