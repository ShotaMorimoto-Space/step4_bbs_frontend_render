'use client';

import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  text?: string;
  className?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  text,
  className = '',
  showPercentage = true
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {text && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{text}</span>
          {showPercentage && (
            <span className="text-sm font-medium text-gray-700">{clampedProgress}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
