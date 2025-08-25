import React from 'react';

interface CommonLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  onBackClick?: () => void;
  backButtonText?: string;
}

export const CommonLayout: React.FC<CommonLayoutProps> = ({
  title,
  subtitle,
  children,
  showBackButton = false,
  onBackClick,
  backButtonText = '戻る'
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-400 via-violet-600 to-violet-800 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 背景装飾 - 斜め格子パターン */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
        }} />
      </div>
      
      {/* ゴルフ要素の背景装飾 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl" />
      </div>

      {/* メインコンテンツ - トップページと同じレイアウト */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center mb-16">
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-light text-white mb-1" style={{ 
            fontFamily: 'Brush Script MT, cursive',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg sm:text-xl text-white/90 mb-6">{subtitle}</p>
          )}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 w-full max-w-sm mb-8">
        {children}
      </div>

      {/* 戻るボタン */}
      {showBackButton && onBackClick && (
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={onBackClick}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            title={backButtonText}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

// 共通のボタンスタイル
export const CommonButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}> = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  className = ''
}) => {
  const baseClasses = "w-full font-semibold py-4 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-white bg-opacity-95 hover:bg-opacity-100 text-gray-800",
    secondary: "bg-violet-500 hover:bg-violet-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// 共通の入力フィールドスタイル
export const CommonInput: React.FC<{
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  max?: string;
  error?: string;
  required?: boolean;
  className?: string;
}> = ({ 
  label, 
  type, 
  value, 
  onChange, 
  placeholder, 
  disabled = false, 
  maxLength,
  max,
  error,
  required = false,
  className = ''
}) => {
  return (
    <div className={className}>
      <label className="block text-white text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full bg-white bg-opacity-20 border rounded-xl px-4 py-3 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-white focus:border-opacity-60 ${
          error ? 'border-red-400' : 'border-white border-opacity-30'
        }`}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        max={max}
      />
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

// 共通のエラーメッセージスタイル
export const CommonErrorMessage: React.FC<{
  message: string;
  className?: string;
}> = ({ message, className = '' }) => {
  return (
    <div className={`bg-red-500 bg-opacity-20 border border-red-300 rounded-lg p-3 ${className}`}>
      <p className="text-red-200 text-sm text-center">{message}</p>
    </div>
  );
};
