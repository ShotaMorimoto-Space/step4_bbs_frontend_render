import React, { useState, useRef } from 'react';
import { Settings, Edit3, Camera } from 'lucide-react';
import { Profile } from './MyPageScreen';

type Props = {
  profile: Profile;
  onUpdate: (profile: Profile) => void;
  onNavigateSettings: () => void;
};

export const ProfileHeader: React.FC<Props> = ({ profile, onUpdate, onNavigateSettings }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profile);
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newProfile = { ...profile, avatar: event.target?.result as string };
        onUpdate(newProfile);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      {/* Cover Background */}
      <div className="h-48 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 relative">
        {/* Settings Button */}
        <button
          onClick={onNavigateSettings}
          className="absolute top-4 right-4 w-10 h-10 bg-black/20 rounded-full flex items-center justify-center text-white hover:bg-black/30 transition-colors"
          aria-label="設定"
        >
          <Settings size={20} />
        </button>

        {/* Profile Content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <div className="flex items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-purple-700 transition-colors"
                aria-label="写真を変更"
              >
                <Camera size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center hover:bg-black/30 transition-colors"
                  aria-label="プロフィールを編集"
                >
                  <Edit3 size={16} />
                </button>
              </div>
              <div className="text-white/90 text-sm space-y-1">
                <p>HDCP: {profile.handicap}</p>
                <p>利き手: {profile.hand === 'R' ? '右' : '左'}</p>
                <p>ホームコース: {profile.homeCourse}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-[430px] p-6 pb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">プロフィール編集</h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  名前
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ハンディキャップ
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editData.handicap}
                  onChange={(e) => setEditData({ ...editData, handicap: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  利き手
                </label>
                <select
                  value={editData.hand}
                  onChange={(e) => setEditData({ ...editData, hand: e.target.value as 'R' | 'L' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="R">右</option>
                  <option value="L">左</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ホームコース
                </label>
                <input
                  type="text"
                  value={editData.homeCourse}
                  onChange={(e) => setEditData({ ...editData, homeCourse: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};