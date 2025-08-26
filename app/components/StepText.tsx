import React from 'react';

interface StepTextProps {
  step: number;
  lines: readonly string[] | string[];
  alignment?: 'left' | 'right' | 'center';
  className?: string;
}

export const StepText: React.FC<StepTextProps> = ({ step, lines, alignment = 'right', className = "" }) => {
  return (
    <div className={`text-white ${
      alignment === 'left' ? 'text-left' : 
      alignment === 'center' ? 'text-center' : 
      'text-right'
    } ${className}`}>
      <div className="text-3xl font-light mb-2" style={{ fontFamily: 'cursive' }}>
        {step}.
      </div>
      <div className="text-3xl leading-tight">
        {lines.map((line, index) => (
          <div key={index}>
            {index === 0 && '"'}{line}{index === lines.length - 1 && '"'}
          </div>
        ))}
      </div>
    </div>
  );
};