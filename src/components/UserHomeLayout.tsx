import React from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserHomeLayoutProps {
  children: React.ReactNode;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  profileImageUrl?: string;
}

export const UserHomeLayout: React.FC<UserHomeLayoutProps> = ({
  children,
  searchQuery,
  onSearchChange,
  profileImageUrl
}) => {
  const router = useRouter();

  return (
    <div className="w-full max-w-[430px] lg:max-w-6xl xl:max-w-7xl mx-auto bg-white shadow-2xl overflow-hidden min-h-100dvh h-100dvh relative">
      {/* 背景 - 共通デザインを適用 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-400 via-violet-600 to-violet-800" />
        {/* 斜め格子パターン */}
        <div className="absolute inset-0 opacity-5">
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
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl lg:w-40 lg:h-40" />
          <div className="absolute bottom-40 right-10 w-40 h-40 bg-white rounded-full blur-3xl lg:w-48 lg:h-48" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl lg:w-32 lg:h-32" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 lg:px-8 pt-4 pb-2">
          <button 
            onClick={() => router.push('/')} 
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden bg-white/20 border-2 border-white/30 hover:bg-white/30 transition-colors"
          >
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/20 flex items-center justify-center">
                <span className="text-white text-lg lg:text-xl font-bold">U</span>
              </div>
            )}
          </button>
          
          <div className="flex-1 mx-4 lg:mx-8">
            <div className="relative">
              <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-white/70" size={18} />
              <input
                value={searchQuery}
                onChange={onSearchChange}
                type="text"
                placeholder="Search"
                className="w-full h-10 lg:h-12 pl-10 lg:pl-12 bg-white/20 text-white rounded-full placeholder-white/70 focus:outline-none focus:bg-white/30 border border-white/30 focus:border-white/50 transition-all text-sm lg:text-base"
              />
            </div>
          </div>
          
          {/* 設定ボタンを削除 */}
          <div className="w-10 h-10 lg:w-12 lg:h-12" /> {/* スペーサー */}
        </div>

        {/* メインコンテンツ */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 pb-20 lg:pb-24 space-y-8 scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
};
