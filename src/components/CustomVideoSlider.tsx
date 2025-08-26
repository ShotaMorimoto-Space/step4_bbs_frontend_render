'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Plus, Check } from 'lucide-react';

interface CustomVideoSliderProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onPlayPause: () => void;
  isPlaying: boolean;
  onSpeedChange: (speed: number) => void;
  playbackSpeed: number;
  onUndo?: () => void;
  onRedo?: () => void;
  onAddKeyframe?: () => void;
  onConfirm?: () => void;
}

export default function CustomVideoSlider({
  currentTime,
  duration,
  onSeek,
  onPlayPause,
  isPlaying,
  onSpeedChange,
  playbackSpeed,
  onUndo,
  onRedo,
  onAddKeyframe,
  onConfirm
}: CustomVideoSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [keyframes, setKeyframes] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // 時間をフォーマット
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${tenths}`;
  };

  // スライダーのクリック/ドラッグ処理（滑らかさを改善）
  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const sliderWidth = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / sliderWidth));
    const newTime = percentage * duration;
    
    // 即座にシーク
    onSeek(newTime);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    // マウスダウン時にも即座にシーク
    const rect = sliderRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const sliderWidth = rect.width;
      const percentage = Math.max(0, Math.min(1, mouseX / sliderWidth));
      const newTime = percentage * duration;
      onSeek(newTime);
    }
    
    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // React用のマウス移動ハンドラー
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const sliderWidth = rect.width;
    const percentage = Math.max(0, Math.min(1, mouseX / sliderWidth));
    const newTime = percentage * duration;
    
    // ドラッグ中はリアルタイムでシーク
    onSeek(newTime);
  };

  // document.addEventListener用のマウス移動ハンドラー
  const handleDocumentMouseMove = (e: globalThis.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const sliderWidth = rect.width;
    const percentage = Math.max(0, Math.min(1, mouseX / sliderWidth));
    const newTime = percentage * duration;
    
    // ドラッグ中はリアルタイムでシーク
    onSeek(newTime);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleDocumentMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // コンポーネントのクリーンアップ
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // キーフレームを追加
  const addKeyframe = () => {
    setKeyframes(prev => [...prev, currentTime]);
    onAddKeyframe?.();
  };

  // キーフレームを削除
  const removeKeyframe = (time: number) => {
    setKeyframes(prev => prev.filter(k => k !== time));
  };

  // 現在位置のパーセンテージ
  const currentPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-white/10 rounded-lg p-4 mb-4">
      {/* 上部コントロール - 不要なボタンを削除 */}

              {/* カスタムスライダー */}
        <div className="mb-4">
                      <div
              ref={sliderRef}
              className="relative h-8 bg-gray-800 rounded-lg cursor-pointer overflow-hidden"
              onClick={handleSliderClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
                          onTouchStart={(e) => {
              const touch = e.touches[0];
              const rect = sliderRef.current?.getBoundingClientRect();
              if (rect) {
                const touchX = touch.clientX - rect.left;
                const sliderWidth = rect.width;
                const percentage = Math.max(0, Math.min(1, touchX / sliderWidth));
                const newTime = percentage * duration;
                onSeek(newTime);
              }
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              const rect = sliderRef.current?.getBoundingClientRect();
              if (rect) {
                const touchX = touch.clientX - rect.left;
                const sliderWidth = rect.width;
                const percentage = Math.max(0, Math.min(1, touchX / sliderWidth));
                const newTime = percentage * duration;
                onSeek(newTime);
              }
            }}
            >
            {/* アクティブセグメント（シンプルな緑色） */}
            <div
              className="absolute top-0 left-0 h-full bg-green-500"
              style={{ width: `${currentPercentage}%` }}
            />
            
            {/* 現在位置インジケーター（シンプルな白い丸） */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-gray-800"
              style={{ left: `${currentPercentage}%` }}
            />
            
            {/* キーフレームマーカー（シンプルな白い丸） */}
            {keyframes.map((keyframe, index) => {
              const keyframePercentage = (keyframe / duration) * 100;
              return (
                <div
                  key={index}
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full border border-gray-600"
                  style={{ left: `${keyframePercentage}%` }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeKeyframe(keyframe);
                    }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full text-white text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              );
            })}
            
            {/* スライダーの目盛り（シンプルな線） */}
            <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="w-0.5 h-2 bg-white/20"
                  style={{ left: `${(i / 5) * 100}%` }}
                />
              ))}
            </div>
          </div>
        
        {/* 時間表示 */}
        <div className="flex items-center justify-between text-sm text-white/80">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 下部コントロール - レイアウトを改善 */}
      <div className="mt-4 space-y-3">
        {/* 再生/一時停止ボタン - 中央配置 */}
        <div className="flex justify-center">
          <button
            onClick={onPlayPause}
            className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isPlaying ? (
              <Pause size={24} className="text-white" />
            ) : (
              <Play size={24} className="text-white" />
            )}
          </button>
        </div>
        
        {/* 再生速度選択 - 分かりやすいレイアウト */}
        <div className="flex justify-center">
          <div className="bg-black/20 rounded-lg p-2 backdrop-blur-sm">
            <div className="flex items-center gap-1">
              <span className="text-white/80 text-xs px-2 py-1">再生速度:</span>
              <button
                onClick={() => onSpeedChange(0.5)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  playbackSpeed === 0.5 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg scale-105' 
                    : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                }`}
              >
                0.5x
              </button>
              <button
                onClick={() => onSpeedChange(1.0)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  playbackSpeed === 1.0 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg scale-105' 
                    : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                }`}
              >
                1.0x
              </button>
            </div>
          </div>
        </div>
        
        {/* キーフレーム情報 - 右寄せ */}
        <div className="flex justify-end">
          <div className="text-xs text-white/60 bg-black/20 px-3 py-1 rounded-lg backdrop-blur-sm">
            {keyframes.length > 0 ? (
              <span>キーフレーム: {keyframes.length}個</span>
            ) : (
              <span>キーフレームなし</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
