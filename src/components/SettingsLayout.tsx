import React from 'react';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SettingsLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  backButtonText?: string;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  onBackClick,
  backButtonText = '戻る'
}) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-400 via-violet-600 to-violet-800 flex flex-col items-center justify-start pt-20 pb-6 px-6 relative overflow-hidden">
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

      {/* メインコンテンツ */}
      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 relative z-10">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          {showBackButton && (
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">{backButtonText}</span>
            </button>
          )}
          
          <div className="flex items-center space-x-2">
            <SettingsIcon className="text-white" size={24} />
            <h1 className="text-white text-xl lg:text-2xl font-semibold">設定</h1>
          </div>
          
          {!showBackButton && <div className="w-16" />} {/* 中央揃えのためのスペーサー */}
        </div>

        {/* タイトル */}
        <div className="text-center mb-6">
          <h2 className="text-white text-2xl lg:text-3xl font-light mb-2" style={{ fontFamily: 'Brush Script MT, cursive' }}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-white/80 text-sm lg:text-base">{subtitle}</p>
          )}
        </div>

        {/* コンテンツ */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};
