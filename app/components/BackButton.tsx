import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
  variant?: 'light' | 'dark';
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  className = "",
  variant = 'light'
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${
        variant === 'light' 
          ? 'bg-white/20 hover:bg-white/30 text-white' 
          : 'bg-black/20 hover:bg-black/30 text-black'
      } ${className}`}
      aria-label="戻る"
    >
      <ArrowLeft size={20} />
    </button>
  );
};