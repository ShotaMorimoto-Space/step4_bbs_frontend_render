import React from 'react';
import { Heart, MessageCircle, Clock, Ticket, Pen as Yen } from 'lucide-react';
import type { RequestItem } from '../../../src/types/requests';

interface RequestCardProps {
  request: RequestItem;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onViewDetail: (id: string) => void;
  loading?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onAccept,
  onDecline,
  onToggleFavorite,
  onViewDetail,
  loading = false
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return '1時間以内';
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffDays < 7) return `${diffDays}日前`;
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getClubLabel = (club: string) => {
    switch (club) {
      case 'driver': return '1W';
      case 'wood': return '3W';
      case 'utility': return 'UT';
      case 'iron': return '7I';
      case 'wedge': return 'SW';
      case 'putter': return 'PT';
      default: return club.toUpperCase();
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:bg-white/15 transition-all duration-200">
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <img
          src={request.thumbnailUrl}
          alt={`${request.userHandle}の動画`}
          className="w-full h-full object-cover"
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
          </div>
        </div>
        
        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(request.durationSec)}
        </div>
        
        {/* Unread indicator */}
        {request.unread && (
          <div className="absolute top-2 left-2 w-3 h-3 bg-blue-500 rounded-full"></div>
        )}
        
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(request.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <Heart
            size={16}
            className={`${
              request.isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
            } transition-colors`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* User info */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={request.userAvatar}
            alt={request.userHandle}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">@{request.userHandle}</span>
              <span className={`px-2 py-0.5 text-xs text-white rounded-full ${getLevelBadgeColor(request.level)}`}>
                {request.level}
              </span>
            </div>
          </div>
          <div className="text-white/70 text-sm">
            {formatDate(request.createdAt)}
          </div>
        </div>

        {/* Club and tags */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-orange-500 text-white text-sm font-medium rounded">
            {getClubLabel(request.club)}
          </span>
          {request.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/20 text-white text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {request.tags.length > 2 && (
            <span className="text-white/70 text-xs">+{request.tags.length - 2}</span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-white/70">
              <MessageCircle size={14} />
              <span className="text-sm">{request.commentsCount}</span>
            </div>
            <div className="flex items-center gap-1 text-white/70">
              {request.reward.kind === 'ticket' ? <Ticket size={14} /> : <Yen size={14} />}
              <span className="text-sm">{request.reward.amount}</span>
            </div>
          </div>
          
          {request.status === 'accepted' && request.deadline && (
            <div className="flex items-center gap-1 text-yellow-400">
              <Clock size={14} />
              <span className="text-xs">
                {Math.ceil((new Date(request.deadline).getTime() - Date.now()) / (1000 * 60 * 60))}h
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {request.status === 'new' && (
          <div className="flex gap-2">
            <button
              onClick={() => onViewDetail(request.id)}
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              案件詳細
            </button>
            <button
              onClick={() => onAccept(request.id)}
              disabled={loading}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              受諾
            </button>
            <button
              onClick={() => onDecline(request.id)}
              disabled={loading}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              辞退
            </button>

          </div>
        )}
        
        {request.status === 'accepted' && (
          <div className="flex gap-2">
            <button
              onClick={() => onViewDetail(request.id)}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              対応中
            </button>
            <button className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
              チャット
            </button>
          </div>
        )}
        
        {request.status === 'completed' && (
          <div className="text-center py-2">
            <span className="text-green-400 font-medium">完了済み</span>
          </div>
        )}
      </div>
    </div>
  );
};