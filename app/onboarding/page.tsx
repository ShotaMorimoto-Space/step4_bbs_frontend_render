'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommonLayout, CommonButton } from '@/components/CommonLayout';
import { StepText } from '@/components/StepText';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // 最後のステップで登録画面に遷移
      router.push('/auth/register/name');
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "Nice Shot",
          subtitle: "with your BUDDY",
          stepText: {
            step: 1,
            lines: ["ゴルフの上達を", "サポートします"],
            alignment: "center"
          }
        };
      case 2:
        return {
          title: "Professional",
          subtitle: "Coaching",
          stepText: {
            step: 2,
            lines: ["プロコーチが", "あなたをサポート"],
            alignment: "center"
          }
        };
      case 3:
        return {
          title: "Start Your",
          subtitle: "Journey",
          stepText: {
            step: 3,
            lines: ["今すぐ始めましょう"],
            alignment: "center"
          }
        };
      default:
        return {
          title: "Nice Shot",
          subtitle: "with your BUDDY",
          stepText: {
            step: 1,
            lines: ["ゴルフの上達を", "サポートします"],
            alignment: "center"
          }
        };
    }
  };

  const content = getStepContent();

  return (
    <CommonLayout 
      title={content.title} 
      subtitle={content.subtitle}
    >
      <div className="space-y-8 text-center">
        {/* ステップテキスト */}
        <StepText 
          step={content.stepText.step}
          lines={content.stepText.lines}
          alignment={content.stepText.alignment as "center" | "left" | "right"}
        />
        
        {/* 次へ/始めるボタン */}
        <CommonButton onClick={handleNext}>
          {currentStep < 3 ? '次へ' : '始める'}
        </CommonButton>
      </div>
    </CommonLayout>
  );
}
