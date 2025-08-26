import React from 'react';

interface SignupFrameProps {
  children: React.ReactNode;
  backgroundImage?: string;
}

export const SignupFrame: React.FC<SignupFrameProps> = ({ 
  children, 
  backgroundImage = "/images/bg.jpg" 
}) => {
  return (
    <div className="max-w-[430px] mx-auto bg-white min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        {/* Gradient overlay with pointer-events-none */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 opacity-90 pointer-events-none" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-100dvh h-100dvh pl-safe pr-safe">
        {children}
      </div>
    </div>
  );
};