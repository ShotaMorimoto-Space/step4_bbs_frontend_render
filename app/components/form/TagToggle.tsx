import React from 'react';

interface TagToggleProps {
  options: string[];
  values: string[];
  onChange: (next: string[]) => void;
  className?: string;
}

export const TagToggle: React.FC<TagToggleProps> = ({ 
  options, 
  values, 
  onChange, 
  className = "" 
}) => {
  const toggleOption = (option: string) => {
    const isSelected = values.includes(option);
    if (isSelected) {
      onChange(values.filter(v => v !== option));
    } else {
      onChange([...values, option]);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => {
        const isSelected = values.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggleOption(option)}
            aria-pressed={isSelected}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isSelected
                ? 'bg-white text-purple-600 shadow-sm'
                : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};