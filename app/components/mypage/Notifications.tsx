import React from 'react';
import { Bell, ChevronRight } from 'lucide-react';

export const Notifications: React.FC = () => {
  const notifications = [
    {
      id: '1',
      title: '添削が完了しました',
      summary: 'ドライバーの動画に新しいアドバイスが届いています',
      time: '2時間前'
    },
    {
      id: '2',
      title: '新しいコーチが参加しました',
      summary: '田中プロがあなたのお気に入りコーチに追加されました',
      time: '1日前'
    },
    {
      id: '3',
      title: 'ポイントが付与されました',
      summary: 'レッスン受講により100ポイントを獲得しました',
      time: '3日前'
    }
  ];

  return (
    <div className="mx-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="text-blue-500" size={24} />
          <h2 className="text-xl font-bold text-gray-800">通知</h2>
        </div>
        <button className="flex items-center gap-1 text-purple-600 font-medium">
          すべて表示
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 mb-1">
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {notification.summary}
                </p>
                <p className="text-xs text-gray-400">{notification.time}</p>
              </div>
              <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};