import React, { useState } from 'react';
import { MoreHorizontal, Edit3, Trash2, Copy, Plus } from 'lucide-react';
import type { ReviewClip } from '../../../src/types/review';

export type TimelineProps = {
  clips: ReviewClip[];
  currentTime: number;
  onSeek: (time: number) => void;
  onAddClip: () => void;
  onUpdateClip: (clip: ReviewClip) => void;
  onDeleteClip: (id: string) => void;
};

export const Timeline: React.FC<TimelineProps> = ({
  clips,
  currentTime,
  onSeek,
  onAddClip,
  onUpdateClip,
  onDeleteClip
}) => {
  const [editingClip, setEditingClip] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const handleEditStart = (clip: ReviewClip) => {
    setEditingClip(clip.id);
    setEditLabel(clip.label);
    setShowMenu(null);
  };

  const handleEditSave = () => {
    if (!editingClip) return;
    
    const clip = clips.find(c => c.id === editingClip);
    if (clip) {
      onUpdateClip({ ...clip, label: editLabel });
    }
    
    setEditingClip(null);
    setEditLabel('');
  };

  const handleEditCancel = () => {
    setEditingClip(null);
    setEditLabel('');
  };

  const handleDuplicate = (clip: ReviewClip) => {
    const newClip: ReviewClip = {
      ...clip,
      id: crypto.randomUUID(),
      label: `${clip.label} (コピー)`,
      time: clip.time + 1
    };
    onUpdateClip(newClip);
    setShowMenu(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-t-2xl border-t border-white/10 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium text-lg">タイムライン</h3>
        <button
          onClick={onAddClip}
          className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={16} />
          クリップ追加
        </button>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {clips.map((clip) => (
          <div
            key={clip.id}
            className={`relative bg-white/10 rounded-lg border transition-all duration-200 ${
              Math.abs(currentTime - clip.time) < 1
                ? 'border-purple-400 bg-purple-500/20'
                : 'border-white/20 hover:bg-white/15'
            }`}
          >
            <button
              onClick={() => onSeek(clip.time)}
              className="w-full p-3 text-left focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {/* Thumbnail */}
                <div className="w-16 h-12 bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                  {clip.thumbUrl ? (
                    <img
                      src={clip.thumbUrl}
                      alt={clip.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {clip.label.split(' ')[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {editingClip === clip.id ? (
                    <input
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave();
                        if (e.key === 'Escape') handleEditCancel();
                      }}
                      className="w-full bg-white/20 text-white px-2 py-1 rounded border border-white/30 focus:outline-none focus:border-white"
                      autoFocus
                    />
                  ) : (
                    <h4 className="text-white font-medium truncate">{clip.label}</h4>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-white/70 text-sm">{formatTime(clip.time)}</span>
                    {clip.annotations.length > 0 && (
                      <span className="px-2 py-0.5 bg-purple-500/30 text-purple-200 text-xs rounded-full">
                        {clip.annotations.length}個の注釈
                      </span>
                    )}
                  </div>
                </div>

                {/* Menu Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(showMenu === clip.id ? null : clip.id);
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <MoreHorizontal className="text-white" size={16} />
                </button>
              </div>
            </button>

            {/* Menu Dropdown */}
            {showMenu === clip.id && (
              <div className="absolute top-full right-4 mt-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg py-1 z-10 min-w-[120px]">
                <button
                  onClick={() => handleEditStart(clip)}
                  className="w-full text-left px-3 py-2 text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <Edit3 size={14} />
                  名前変更
                </button>
                <button
                  onClick={() => handleDuplicate(clip)}
                  className="w-full text-left px-3 py-2 text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <Copy size={14} />
                  複製
                </button>
                <button
                  onClick={() => {
                    onDeleteClip(clip.id);
                    setShowMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  削除
                </button>
              </div>
            )}

            {/* Edit Actions */}
            {editingClip === clip.id && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 flex gap-2">
                <button
                  onClick={handleEditCancel}
                  className="flex-1 px-3 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleEditSave}
                  className="flex-1 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  保存
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};