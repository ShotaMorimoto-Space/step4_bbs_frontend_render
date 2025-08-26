import React from 'react';

interface CoachCtaButtonProps {
  onClick?: () => void;
  className?: string;
}

export const CoachCtaButton: React.FC<CoachCtaButtonProps> = ({ 
  onClick, 
  className = "" 
}) => {
  return (
    <div className={`mt-10 ${className}`}>
      <button
        onClick={() => {
          if (onClick) {
            onClick();
          }
        }}
        className="w-full h-12 bg-gradient-to-r from-orange-400 to-red-500 text-white font-medium rounded-full hover:shadow-lg active:translate-y-[1px] transition-all duration-200"
      >
        コーチとして登録希望の方はこちら
      </button>
      <p className="text-center text-white/75 text-xs mt-2">
        ※コーチ登録は運営審査後に有効となります
      </p>
    </div>
  );
};