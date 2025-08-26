'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CoachLayout } from '@/components/CoachLayout';
import { CoachButton } from '@/components/CoachCommonLayout';
import { safeLocalStorage } from '../../utils/storage';
import { 
  Home as HomeIcon, 
  FileText as FileTextIcon, 
  User as UserIcon, 
  Settings as SettingsIcon,
  Video,
  Users,
  Calendar,
  MessageSquare
} from 'lucide-react';

export default function CoachHomePage() {
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 認証状態とusertypeの確認
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = safeLocalStorage.getItem('access_token');
      const userEmail = safeLocalStorage.getItem('user_email');
      const storedUserType = safeLocalStorage.getItem('user_type');
      
      if (!accessToken || !userEmail) {
        console.log('認証情報が不足しています。ログインページに移動します。');
        router.push('/auth/login');
        return;
      }

      // usertypeチェック - ユーザーの場合はuser/homeに遷移
      if (storedUserType === 'user') {
        console.log('ユーザーアカウントです。ユーザーホームに移動します。');
        router.push('/user/home');
        return;
      }

      setUserType(storedUserType);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  // ローディング中
  if (loading) {
    return (
      <CoachLayout
        title="Loading..."
        subtitle="読み込み中..."
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        </div>
      </CoachLayout>
    );
  }

  // ナビゲーション処理
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <CoachLayout
      title="Coach Home"
      subtitle="コーチダッシュボードへようこそ"
    >
      <div className="space-y-6">
        {/* ウェルカムメッセージ */}
        <div className="bg-gradient-to-r from-orange-500/25 to-red-500/25 rounded-2xl p-6 border border-orange-500/40">
          <h2 className="text-white text-xl font-bold mb-2">お疲れ様です！</h2>
          <p className="text-white/90">
            今日も生徒たちのゴルフ技術向上のために、素晴らしい指導をお願いします。
          </p>
        </div>

        {/* クイックアクション */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium">クイックアクション</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <CoachButton
              onClick={() => handleNavigation('/coach/lessons')}
              className="h-24 flex-col"
            >
              <Calendar size={24} />
              <span className="text-sm">レッスン管理</span>
            </CoachButton>
            
            <CoachButton
              onClick={() => handleNavigation('/coach/students')}
              className="h-24 flex-col"
            >
              <Users size={24} />
              <span className="text-sm">生徒管理</span>
            </CoachButton>
            
            <CoachButton
              onClick={() => handleNavigation('/coach/videos')}
              className="h-24 flex-col"
            >
              <Video size={24} />
              <span className="text-sm">動画管理</span>
            </CoachButton>
            
            <CoachButton
              onClick={() => handleNavigation('/coach/messages')}
              className="h-24 flex-col"
            >
              <MessageSquare size={24} />
              <span className="text-sm">メッセージ</span>
            </CoachButton>
          </div>
        </div>

        {/* 今日の予定 */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium">今日の予定</h3>
          
          <div className="bg-white/15 rounded-xl p-4 border border-white/20">
            <div className="text-center py-8">
              <Calendar size={48} className="mx-auto mb-4 text-white/50" />
              <p className="text-white/70">今日のレッスン予定はありません</p>
              <p className="text-white/50 text-sm mt-2">新しいレッスンをスケジュールしましょう</p>
            </div>
          </div>
        </div>

        {/* 最近の活動 */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium">最近の活動</h3>
          
          <div className="bg-white/15 rounded-xl p-4 border border-white/20">
            <div className="text-center py-8">
              <FileTextIcon size={48} className="mx-auto mb-4 text-white/50" />
              <p className="text-white/70">まだ活動履歴がありません</p>
              <p className="text-white/50 text-sm mt-2">レッスンを開始すると、ここに表示されます</p>
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium">統計情報</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/15 rounded-xl p-4 text-center border border-white/20">
              <div className="text-white text-2xl font-bold">0</div>
              <div className="text-white/70 text-sm">総生徒数</div>
            </div>
            
            <div className="bg-white/15 rounded-xl p-4 text-center border border-white/20">
              <div className="text-white text-2xl font-bold">0</div>
              <div className="text-white/70 text-sm">今月のレッスン</div>
            </div>
            
            <div className="bg-white/15 rounded-xl p-4 text-center border border-white/20">
              <div className="text-white text-2xl font-bold">0</div>
              <div className="text-white/70 text-sm">評価</div>
            </div>
          </div>
        </div>

        {/* ナビゲーションメニュー */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium">メニュー</h3>
          
          <div className="space-y-3">
            <button
              onClick={() => handleNavigation('/coach/settings')}
              className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-4 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <SettingsIcon size={20} className="text-orange-400" />
                <span className="text-white">設定</span>
              </div>
            </button>
            
            <button
              onClick={() => handleNavigation('/coach/profile')}
              className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-4 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <UserIcon size={20} className="text-orange-400" />
                <span className="text-white">プロフィール</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </CoachLayout>
  );
}
