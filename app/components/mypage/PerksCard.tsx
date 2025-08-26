import React, { useState } from 'react';
import { Gift, Ticket, Coins } from 'lucide-react';
import { Perks } from './MyPageScreen';

type Props = {
  perks: Perks;
  onUpdate: (perks: Perks) => void;
};

export const PerksCard: React.FC<Props> = ({ perks, onUpdate }) => {
  const [showToast, setShowToast] = useState<string | null>(null);

  const handleGetPoints = () => {
    const newPerks = { ...perks, points: perks.points + 100 };
    onUpdate(newPerks);
    setShowToast('100ポイント獲得しました！');
    setTimeout(() => setShowToast(null), 2500);
  };

  const handleGetTicket = () => {
    const newPerks = { ...perks, tickets: perks.tickets + 1 };
    onUpdate(newPerks);
    setShowToast('チケットを1枚獲得しました！');
    setTimeout(() => setShowToast(null), 2500);
  };

  return (
    <div className="mx-4 mb-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="text-white" size={24} />
          <h2 className="text-xl font-bold">特典</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <Coins className="mx-auto mb-2" size={32} />
            <p className="text-2xl font-bold">{perks.points}</p>
            <p className="text-sm opacity-90">ポイント</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <Ticket className="mx-auto mb-2" size={32} />
            <p className="text-2xl font-bold">{perks.tickets}</p>
            <p className="text-sm opacity-90">チケット</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleGetPoints}
            className="flex-1 bg-white/20 hover:bg-white/30 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            ポイント入手
          </button>
          <button
            onClick={handleGetTicket}
            className="flex-1 bg-white/20 hover:bg-white/30 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            チケット入手
          </button>
        </div>

        <p className="text-xs opacity-75 mt-3 text-center">
          有効期限: {new Date(perks.expiresAt).toLocaleDateString('ja-JP')}
        </p>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {showToast}
        </div>
      )}
    </div>
  );
};