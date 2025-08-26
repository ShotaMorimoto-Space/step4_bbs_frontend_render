import React, { useState, useEffect } from 'react';
import { Settings, Edit3, Plus, ChevronRight, Star, Trophy, Calendar, Heart, Upload, FileText } from 'lucide-react';
import { ProfileHeader } from './ProfileHeader';
import { StatCards } from './StatCards';
import { PerksCard } from './PerksCard';
import { FavCoaches } from './FavCoaches';
import { Badges } from './Badges';
import { ActivityTimeline } from './ActivityTimeline';
import { Notifications } from './Notifications';

export type MyPageProps = {
  onNavigate: (screen: string) => void;
};

export type Profile = {
  name: string;
  avatar: string;
  hand: 'R' | 'L';
  handicap: number;
  homeCourse: string;
};

export type Perks = {
  points: number;
  tickets: number;
  expiresAt: string;
};

export type Badge = {
  id: string;
  name: string;
  icon: string;
  owned: boolean;
  desc: string;
};

export type Coach = {
  id: string;
  name: string;
  rating: number;
  club: string;
  avatar: string;
};

export type Activity = {
  id: string;
  type: 'upload' | 'lesson' | 'like';
  date: string;
  club: string;
  status?: '未添削' | '添削済';
  note?: string;
};

// Mock data generators
const generateMockProfile = (): Profile => ({
  name: 'Taro Golfer',
  avatar: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100',
  hand: 'R',
  handicap: 14.2,
  homeCourse: 'Sunset Golf Club'
});

const generateMockPerks = (): Perks => ({
  points: 1200,
  tickets: 3,
  expiresAt: '2026-12-31'
});

const generateMockBadges = (): Badge[] => [
  { id: '1', name: '初回アップロード', icon: '🎯', owned: true, desc: '初めて動画をアップロードしました' },
  { id: '2', name: '10回アップロード', icon: '📹', owned: true, desc: '10回動画をアップロードしました' },
  { id: '3', name: '初回添削', icon: '✏️', owned: true, desc: '初めて添削を受けました' },
  { id: '4', name: 'ドライバー上達', icon: '🏌️', owned: true, desc: 'ドライバーの添削を5回受けました' },
  { id: '5', name: 'アイアン上達', icon: '⛳', owned: true, desc: 'アイアンの添削を5回受けました' },
  { id: '6', name: '継続学習', icon: '📚', owned: false, desc: '30日連続でアプリを使用' },
  { id: '7', name: 'スコア改善', icon: '🏆', owned: false, desc: 'ハンディキャップを5改善' },
  { id: '8', name: 'コーチ評価', icon: '⭐', owned: false, desc: 'コーチから5つ星評価を獲得' }
];

const generateMockCoaches = (): Coach[] => [
  { id: '1', name: '田中プロ', rating: 4.8, club: 'Driver', avatar: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: '2', name: '佐藤コーチ', rating: 4.9, club: 'Iron', avatar: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: '3', name: '山田先生', rating: 4.7, club: 'Putter', avatar: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100' }
];

const generateMockActivity = (): Activity[] => {
  const activities: Activity[] = [];
  const types: Activity['type'][] = ['upload', 'lesson', 'like'];
  const clubs = ['Driver', 'Iron', 'Wedge', 'Putter'];
  const statuses: Activity['status'][] = ['未添削', '添削済'];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    activities.push({
      id: `activity-${i}`,
      type: types[Math.floor(Math.random() * types.length)],
      date: date.toISOString().split('T')[0],
      club: clubs[Math.floor(Math.random() * clubs.length)],
      status: Math.random() > 0.3 ? statuses[Math.floor(Math.random() * statuses.length)] : undefined,
      note: Math.random() > 0.7 ? 'スイングが改善されました' : undefined
    });
  }
  
  return activities;
};

export const MyPageScreen: React.FC<MyPageProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('sb:profile');
    return saved ? JSON.parse(saved) : generateMockProfile();
  });

  const [perks, setPerks] = useState<Perks>(() => {
    const saved = localStorage.getItem('sb:perks');
    return saved ? JSON.parse(saved) : generateMockPerks();
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('sb:badges');
    return saved ? JSON.parse(saved) : generateMockBadges();
  });

  const [coaches, setCoaches] = useState<Coach[]>(() => {
    const saved = localStorage.getItem('sb:favCoaches');
    return saved ? JSON.parse(saved) : generateMockCoaches();
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('sb:activity');
    return saved ? JSON.parse(saved) : generateMockActivity();
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('sb:profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('sb:perks', JSON.stringify(perks));
  }, [perks]);

  useEffect(() => {
    localStorage.setItem('sb:badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('sb:favCoaches', JSON.stringify(coaches));
  }, [coaches]);

  useEffect(() => {
    localStorage.setItem('sb:activity', JSON.stringify(activities));
  }, [activities]);

  const handleProfileUpdate = (newProfile: Profile) => {
    setProfile(newProfile);
  };

  const handlePerksUpdate = (newPerks: Perks) => {
    setPerks(newPerks);
  };

  const stats = {
    uploads: activities.filter(a => a.type === 'upload').length,
    lessons: activities.filter(a => a.type === 'lesson').length,
    favorites: activities.filter(a => a.type === 'like').length,
    points: perks.points
  };

  return (
    <div className="max-w-[430px] mx-auto bg-gray-50 min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
      <div className="flex flex-col min-h-100dvh h-100dvh">
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          <ProfileHeader 
            profile={profile} 
            onUpdate={handleProfileUpdate}
            onNavigateSettings={() => onNavigate('settings')}
          />
          
          <div className="px-4 pb-20">
            <StatCards stats={stats} />
            <PerksCard perks={perks} onUpdate={handlePerksUpdate} />
            <FavCoaches coaches={coaches} onNavigate={onNavigate} />
            <Badges badges={badges} />
            <ActivityTimeline activities={activities.slice(0, 20)} />
            <Notifications />
          </div>
        </main>

        {/* Bottom Tab Bar */}
        <div className="sticky bottom-0 bg-black/60 backdrop-blur-sm border-t border-white/10 rounded-t-3xl">
          <div className="flex justify-around py-3 pb-safe">
            <button
              onClick={() => onNavigate('home')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span className="text-xs">ホーム</span>
            </button>
            <button
              onClick={() => onNavigate('request')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              <span className="text-xs">添削依頼</span>
            </button>
            <button
              onClick={() => onNavigate('mypage')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
              </svg>
              <span className="text-xs font-medium">マイページ</span>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
              </svg>
              <span className="text-xs">設定</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};