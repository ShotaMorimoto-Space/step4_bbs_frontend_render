import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

interface StatProps {
  type: 'like' | 'comment';
  count: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Stat: React.FC<StatProps> = ({ 
  type, 
  count, 
  active = false, 
  onClick,
  className = ""
}) => {
  const Icon = type === 'like' ? Heart : MessageCircle;
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 transition-colors ${
        onClick ? 'hover:scale-105 active:scale-95' : 'cursor-default'
      } ${className}`}
      disabled={!onClick}
    >
      <Icon 
        size={16} 
        className={`${
          type === 'like' && active 
            ? 'fill-red-500 text-red-500' 
            : 'text-white/70'
        }`} 
      />
      <span className="text-white/70 text-sm font-medium">{count}</span>
    </button>
  );
};