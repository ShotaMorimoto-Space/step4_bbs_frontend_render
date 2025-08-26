import React, { useState } from 'react';
import { Calendar, Upload, BookOpen, Heart, Clock } from 'lucide-react';
import { Activity } from './MyPageScreen';

type Props = {
  activities: Activity[];
};

export const ActivityTimeline: React.FC<Props> = ({ activities }) => {
  const [showMore, setShowMore] = useState(false);
  const displayActivities = showMore ? activities : activities.slice(0, 10);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'upload':
        return Upload;
      case 'lesson':
        return BookOpen;
      case 'like':
        return Heart;
      default:
        return Calendar;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'upload':
        return `${activity.club}の動画をアップロードしました`;
      case 'lesson':
        return `${activity.club}のレッスンを受講しました`;
      case 'like':
        return `コーチをお気に入りに追加しました`;
      default:
        return 'アクティビティ';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case '添削済':
        return 'bg-green-100 text-green-700';
      case '未添削':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Group activities by date
  const groupedActivities = displayActivities.reduce((groups, activity) => {
    const date = activity.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, Activity[]>);

  return (
    <div className="mx-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="text-blue-500" size={24} />
        <h2 className="text-xl font-bold text-gray-800">活動記録</h2>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedActivities).map(([date, dayActivities]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-gray-400" size={16} />
              <h3 className="text-sm font-medium text-gray-600">
                {new Date(date).toLocaleDateString('ja-JP', {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short'
                })}
              </h3>
            </div>
            
            <div className="space-y-2 ml-6">
              {dayActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div
                    key={activity.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="text-purple-600" size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
                          {getActivityText(activity)}
                        </p>
                        {activity.note && (
                          <p className="text-sm text-gray-600 mt-1">{activity.note}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {activity.club}
                          </span>
                          {activity.status && (
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {activities.length > 10 && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="w-full mt-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          {showMore ? '表示を減らす' : 'さらに読み込む'}
        </button>
      )}
    </div>
  );
};