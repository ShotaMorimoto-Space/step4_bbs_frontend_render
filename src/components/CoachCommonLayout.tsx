import React from 'react';
import { LucideIcon } from 'lucide-react';

// コーチ用ボタンコンポーネント
interface CoachButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
  icon?: LucideIcon;
}

export const CoachButton: React.FC<CoachButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  icon: Icon
}) => {
  const baseClasses = "w-full h-12 rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-white text-orange-600 hover:bg-white/90 active:scale-95 shadow-lg hover:shadow-xl",
    secondary: "bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:border-white/50",
    danger: "bg-red-500 text-white hover:bg-red-600 active:scale-95"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

// コーチ用入力フィールドコンポーネント
interface CoachInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export const CoachInput: React.FC<CoachInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-white text-sm font-medium">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full h-12 px-4 bg-white/25 border border-white/40 rounded-xl text-white placeholder-white/70 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/30 transition-colors ${
          error ? 'border-red-400' : ''
        }`}
      />
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
};

// コーチ用テキストエリアコンポーネント
interface CoachTextareaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export const CoachTextarea: React.FC<CoachTextareaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  rows = 4,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-white text-sm font-medium">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 bg-white/25 border border-white/40 rounded-xl text-white placeholder-white/70 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/30 transition-colors resize-none ${
          error ? 'border-red-400' : ''
        }`}
      />
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
};

// コーチ用エラーメッセージコンポーネント
interface CoachErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

export const CoachErrorMessage: React.FC<CoachErrorMessageProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm ${className}`}>
      {children}
    </div>
  );
};

// コーチ用成功メッセージコンポーネント
interface CoachSuccessMessageProps {
  children: React.ReactNode;
  className?: string;
}

export const CoachSuccessMessage: React.FC<CoachSuccessMessageProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-green-300 text-sm ${className}`}>
      {children}
    </div>
  );
};

// コーチ用セレクトフィールドコンポーネント
interface CoachSelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export const CoachSelect: React.FC<CoachSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  required = false,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-white text-sm font-medium">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full h-12 px-4 bg-white/25 border border-white/40 rounded-xl text-white focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/30 transition-colors ${
          error ? 'border-red-400' : ''
        }`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-orange-600 text-white">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
};
