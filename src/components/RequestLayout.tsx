import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, FileText, User, Settings } from 'lucide-react';

interface RequestLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  backButtonText?: string;
  currentStep?: number;
  totalSteps?: number;
}

export const RequestLayout: React.FC<RequestLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  onBackClick,
  backButtonText = '戻る',
  currentStep = 0,
  totalSteps = 4
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
    <div className="min-h-screen bg-gradient-to-b from-violet-400 via-violet-600 to-violet-800 flex flex-col items-center justify-start pt-20 pb-24 px-6 relative overflow-hidden">
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">{backButtonText}</span>
            </button>
          )}
          
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            <h1 className="text-white text-xl lg:text-2xl font-semibold">添削依頼</h1>
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

        {/* ステップインジケーター */}
        {totalSteps > 1 && (
          <div className="flex justify-center gap-3 mb-6">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  index === currentStep 
                    ? 'bg-violet-400 opacity-100 scale-110' 
                    : 'bg-white opacity-40'
                }`}
              />
            ))}
          </div>
        )}

        {/* コンテンツ */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
      
      {/* メニューバー */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50 shadow-lg">
        <div className="flex justify-around items-center py-3 px-4 max-w-md mx-auto">
          {/* ホーム */}
          <button
            onClick={() => router.push('/user/home')}
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-violet-600 transition-colors p-2 rounded-lg hover:bg-violet-50"
          >
            <Home size={20} />
            <span className="text-xs font-medium">ホーム</span>
          </button>
          
          {/* 添削依頼 */}
          <button
            onClick={() => router.push('/user/request')}
            className="flex flex-col items-center space-y-1 text-violet-600 transition-colors p-2 rounded-lg bg-violet-50"
          >
            <FileText size={20} />
            <span className="text-xs font-medium">添削依頼</span>
          </button>
          
          {/* マイページ */}
          <button
            onClick={() => router.push('/user/profile')}
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-violet-600 transition-colors p-2 rounded-lg hover:bg-violet-50"
          >
            <User size={20} />
            <span className="text-xs font-medium">マイページ</span>
          </button>
          
          {/* 設定 */}
          <button
            onClick={() => router.push('/user/settings')}
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-violet-600 transition-colors p-2 rounded-lg hover:bg-violet-50"
          >
            <Settings size={20} />
            <span className="text-xs font-medium">設定</span>
          </button>
        </div>
      </div>
    </div>
  );
};
