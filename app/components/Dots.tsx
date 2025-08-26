import React from 'react';

interface DotsProps {
  total?: number;
  activeIndex: number;
  className?: string;
}

export const Dots: React.FC<DotsProps> = ({ total = 3, activeIndex, className = "" }) => {
  return (
    <div className={`flex gap-3 ${className}`}>
      {Array.from({ length: total }, (_, index) => (
        <div
          key={index}
          className={`w-2.5 h-2.5 rounded-full transition-opacity ${
            index === activeIndex ? 'bg-white opacity-100' : 'bg-white opacity-60'
          }`}
        />
      ))}
    </div>
  );
};