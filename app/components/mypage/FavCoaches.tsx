import React from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { Coach } from './MyPageScreen';

type Props = {
  coaches: Coach[];
  onNavigate: (screen: string) => void;
};

export const FavCoaches: React.FC<Props> = ({ coaches, onNavigate }) => {
  return (
    <div className="mx-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">お気に入りコーチ</h2>
        <button
          onClick={() => onNavigate('request')}
          className="flex items-center gap-1 text-purple-600 font-medium"
        >
          すべて見る
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {coaches.map((coach) => (
          <button
            key={coach.id}
            onClick={() => onNavigate('request')}
            className="flex-shrink-0 bg-white rounded-2xl p-4 shadow-lg border border-gray-100 w-40 hover:shadow-xl transition-shadow"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 bg-gray-200">
              <img
                src={coach.avatar}
                alt={coach.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold text-gray-800 text-center mb-1">{coach.name}</h3>
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star className="text-yellow-500 fill-current" size={16} />
              <span className="text-sm text-gray-600">{coach.rating}</span>
            </div>
            <div className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full text-center">
              {coach.club}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};