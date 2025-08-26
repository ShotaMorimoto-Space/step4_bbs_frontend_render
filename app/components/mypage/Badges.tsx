import React, { useState } from 'react';
import { Trophy, Lock } from 'lucide-react';
import { Badge } from './MyPageScreen';

type Props = {
  badges: Badge[];
};

export const Badges: React.FC<Props> = ({ badges }) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  return (
    <div className="mx-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-yellow-500" size={24} />
        <h2 className="text-xl font-bold text-gray-800">バッジ</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {badges.map((badge) => (
          <button
            key={badge.id}
            onClick={() => setSelectedBadge(badge)}
            className={`aspect-square rounded-2xl p-3 text-center transition-all hover:scale-105 ${
              badge.owned
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            <div className="text-2xl mb-1">
              {badge.owned ? badge.icon : <Lock size={24} className="mx-auto" />}
            </div>
            <p className="text-xs font-medium leading-tight">{badge.name}</p>
          </button>
        ))}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {selectedBadge.owned ? selectedBadge.icon : '🔒'}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {selectedBadge.name}
              </h3>
              <p className="text-gray-600 mb-4">{selectedBadge.desc}</p>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                selectedBadge.owned
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {selectedBadge.owned ? '獲得済み' : '未獲得'}
              </div>
            </div>
            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full mt-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};