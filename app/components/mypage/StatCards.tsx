import React from 'react';
import { Upload, BookOpen, Heart, Coins } from 'lucide-react';

type Props = {
  stats: {
    uploads: number;
    lessons: number;
    favorites: number;
    points: number;
  };
};

export const StatCards: React.FC<Props> = ({ stats }) => {
  const cards = [
    {
      icon: Upload,
      label: 'アップロード',
      value: stats.uploads,
      color: 'bg-blue-500'
    },
    {
      icon: BookOpen,
      label: 'レッスン受講',
      value: stats.lessons,
      color: 'bg-green-500'
    },
    {
      icon: Heart,
      label: 'お気に入り',
      value: stats.favorites,
      color: 'bg-red-500'
    },
    {
      icon: Coins,
      label: 'ポイント',
      value: stats.points,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 p-4 -mt-8 relative z-10">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                <Icon className="text-white" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-sm text-gray-600">{card.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};