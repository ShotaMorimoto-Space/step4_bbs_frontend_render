import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({ 
  children, 
  variant = 'secondary',
  size = 'sm',
  className = ""
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full transition-colors";
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm"
  };
  
  const variantClasses = {
    primary: "bg-purple-600 text-white",
    secondary: "bg-white/20 text-white border border-white/30",
    outline: "bg-transparent text-purple-600 border border-purple-200"
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};