'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { RequestLayout } from '@/src/components/RequestLayout';
import { CommonButton } from '@/src/components/CommonLayout';

export default function UserRequestDonePage() {
  const router = useRouter();

  const handleComplete = () => {
    // Clean up temporary data
    try {
      const meta = JSON.parse(localStorage.getItem('sb:req:files') || '[]') as { url: string }[];
      meta.forEach(m => m.url && URL.revokeObjectURL(m.url));
    } catch (error) {
      console.error('Error cleaning up file URLs:', error);
    }
    
    // Remove all temporary data
    ['sb:req:files', 'sb:req:draft'].forEach(key => 
      localStorage.removeItem(key)
    );
    
    // Navigate back to home
    router.push('/user/home');
  };

  // Golf Cart SVG Component
  const GolfCartSVG: React.FC = () => (
    <svg
      viewBox="0 0 200 120"
      className="w-48 h-32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cart Body */}
      <rect x="20" y="40" width="120" height="40" rx="4" fill="#E5E7EB" />
      
      {/* Cart Roof */}
      <rect x="15" y="25" width="130" height="8" rx="4" fill="#9CA3AF" />
      
      {/* Roof Support Posts */}
      <rect x="25" y="25" width="4" height="15" fill="#9CA3AF" />
      <rect x="131" y="25" width="4" height="15" fill="#9CA3AF" />
      
      {/* Windshield */}
      <rect x="30" y="35" width="40" height="25" rx="2" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
      
      {/* Seat */}
      <rect x="80" y="45" width="50" height="20" rx="2" fill="#6B7280" />
      
      {/* Steering Wheel */}
      <circle cx="45" cy="50" r="6" fill="#374151" stroke="#111827" strokeWidth="1" />
      
      {/* Front Wheel */}
      <circle cx="40" cy="85" r="12" fill="#374151" />
      <circle cx="40" cy="85" r="8" fill="#111827" />
      
      {/* Rear Wheel */}
      <circle cx="120" cy="85" r="12" fill="#374151" />
      <circle cx="120" cy="85" r="8" fill="#111827" />
      
      {/* Golf Bag */}
      <rect x="140" y="30" width="15" height="35" rx="2" fill="#8B5CF6" />
      
      {/* Golf Clubs */}
      <line x1="145" y1="30" x2="142" y2="15" stroke="#374151" strokeWidth="2" />
      <line x1="150" y1="30" x2="148" y2="12" stroke="#374151" strokeWidth="2" />
      <line x1="155" y1="30" x2="154" y2="18" stroke="#374151" strokeWidth="2" />
      
      {/* Club Heads */}
      <circle cx="142" cy="13" r="2" fill="#6B7280" />
      <rect x="146" y="10" width="4" height="4" rx="1" fill="#6B7280" />
      <circle cx="154" cy="16" r="2" fill="#6B7280" />
    </svg>
  );

  return (
    <RequestLayout
      title="Thank you"
      subtitle="添削依頼を受け付けました"
      showBackButton={false}
      currentStep={3}
      totalSteps={4}
    >
      {/* Golf Cart Illustration */}
      <div className="flex justify-center mb-8">
        <GolfCartSVG />
      </div>
      
      {/* Success Message */}
      <div className="text-center mb-8">
        <p className="text-white/90 text-lg mb-2">
          添削依頼を受け付けました
        </p>
        <p className="text-white/70 text-sm">
          コーチからの返信をお待ちください
        </p>
      </div>

      {/* 完了ボタン */}
      <div className="mt-8">
        <CommonButton
          onClick={handleComplete}
          className="w-full"
        >
          完了
        </CommonButton>
      </div>
    </RequestLayout>
  );
}
