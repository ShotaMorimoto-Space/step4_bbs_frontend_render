import React from 'react';
import { ArrowLeft, Home, Video, Calendar, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CoachLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  backButtonText?: string;
}

export const CoachLayout: React.FC<CoachLayoutProps> = ({
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
    <div className="min-h-screen bg-gradient-to-b from-orange-600 via-orange-700 to-red-700 flex flex-col items-center justify-start pt-20 pb-24 px-6 relative overflow-hidden">
                        {/* 背景装飾 - ゴルフボールのディンプルパターン */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* 斜めの格子パターン */}
                    <div className="absolute inset-0 opacity-15">
                      <div className="w-full h-full" style={{
                        backgroundImage: `
                          linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.15) 60%, transparent 60%),
                          linear-gradient(-45deg, transparent 40%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.15) 60%, transparent 60%)
                        `,
                        backgroundSize: '20px 20px'
                      }} />
                    </div>
                    
                    {/* ぼやけた円形の光の要素 */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/25 rounded-full blur-3xl opacity-70" />
                    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/25 rounded-full blur-2xl opacity-60" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/15 rounded-full blur-3xl opacity-50" />
                    
                    {/* 縦長のぼやけた光の帯 */}
                    <div className="absolute top-1/3 right-1/3 w-8 h-32 bg-white/20 rounded-full blur-xl opacity-80" />
                    <div className="absolute bottom-1/3 left-1/3 w-6 h-24 bg-white/20 rounded-full blur-lg opacity-70" />
                  </div>

                        {/* メインコンテンツ */}
                  <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl bg-white/15 backdrop-blur-md rounded-2xl p-6 lg:p-8 relative z-10 border border-white/20">
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
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">C</span>
            </div>
            <h1 className="text-white text-xl lg:text-2xl font-semibold">コーチ登録</h1>
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
      
      {/* メニューバー */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-300 z-50 shadow-xl">
        <div className="flex justify-around items-center py-4 px-4 max-w-md mx-auto">
          {/* ホーム */}
          <button
            onClick={() => router.push('/coach/home')}
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-orange-600 transition-colors p-2 rounded-lg hover:bg-orange-50"
          >
            <Home size={20} />
            <span className="text-xs font-medium">ホーム</span>
          </button>
          
          {/* 動画管理 */}
          <button
            onClick={() => router.push('/coach/videos')}
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-orange-600 transition-colors p-2 rounded-lg hover:bg-orange-50"
          >
            <Video size={20} />
            <span className="text-xs font-medium">動画管理</span>
          </button>
          
          {/* レッスン管理 */}
          <button
            onClick={() => router.push('/coach/lessons')}
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-orange-600 transition-colors p-2 rounded-lg hover:bg-orange-50"
          >
            <Calendar size={20} />
            <span className="text-xs font-medium">レッスン</span>
          </button>
          
          {/* 設定 */}
          <button
            onClick={() => router.push('/coach/settings')}
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-orange-600 transition-colors p-2 rounded-lg hover:bg-orange-50"
          >
            <Settings size={20} />
            <span className="text-xs font-medium">設定</span>
          </button>
        </div>
      </div>
    </div>
  );
};
