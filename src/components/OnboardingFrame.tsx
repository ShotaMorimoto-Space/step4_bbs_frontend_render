import React from 'react';

interface OnboardingFrameProps {
  children: React.ReactNode;
  backgroundImage?: string;
}

export const OnboardingFrame: React.FC<OnboardingFrameProps> = ({ 
  children, 
  backgroundImage = "/images/bg.jpg" 
}) => {
  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen shadow-2xl rounded-3xl overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0">
        {/* 青紫のグラデーション背景 */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-400 via-violet-600 to-violet-800" />
        
        {/* 斜め格子パターン */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
        }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};