import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxRowProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const CheckboxRow: React.FC<CheckboxRowProps> = ({ 
  label, 
  checked, 
  onChange, 
  className = "" 
}) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-start gap-3 p-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-colors text-left ${className}`}
      aria-pressed={checked}
    >
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
        checked 
          ? 'bg-white border-white' 
          : 'border-white/50'
      }`}>
        {checked && <Check size={14} className="text-purple-600" />}
      </div>
      <span className="text-white text-sm leading-relaxed">
        {label}
      </span>
    </button>
  );
};