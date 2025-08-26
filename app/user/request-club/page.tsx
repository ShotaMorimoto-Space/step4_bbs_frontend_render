'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RequestLayout } from '@/components/RequestLayout';
import { CommonButton } from '@/components/CommonLayout';
import { safeLocalStorage } from '../../../utils/storage';

type Club = 'Driver' | 'Wood' | 'Utility' | 'Iron' | 'Wedge' | 'Putter';

export default function UserRequestClubPage() {
  const router = useRouter();
  const [club, setClub] = useState<Club | ''>('');
  const [selectedVideos, setSelectedVideos] = useState<any[]>([]);

  // 前の画面から渡された動画ファイル情報を取得
  useEffect(() => {
    const savedVideos = safeLocalStorage.getItem('selectedVideos');
    if (savedVideos) {
      try {
        const videoData = JSON.parse(savedVideos);
        setSelectedVideos(videoData);
        console.log('取得した動画情報:', videoData);
      } catch (error) {
        console.error('動画情報の解析に失敗:', error);
      }
    }
  }, []);

  const handleClubSelect = (selectedClub: Club) => {
    console.log('クラブ選択:', selectedClub);
    setClub(selectedClub);
  };

  const handleNext = () => {
    if (club) {
      console.log('次へ進む - 選択されたクラブ:', club);
      
      // 選んだクラブをドラフトに保存
      const currentDraft = JSON.parse(safeLocalStorage.getItem('sb:req:draft') || '{}');
      const updatedDraft = { ...currentDraft, club };
      
      console.log('保存前のドラフト:', currentDraft);
      console.log('更新後のドラフト:', updatedDraft);
      
      safeLocalStorage.setItem('sb:req:draft', JSON.stringify(updatedDraft));
      
      // 保存確認
      const savedDraft = safeLocalStorage.getItem('sb:req:draft');
      console.log('localStorageに保存されたドラフト:', savedDraft);
      
      // 次画面へ遷移
      router.push('/user/request-problem');
    } else {
      console.log('クラブが選択されていません');
    }
  };

  const handleBack = () => {
    router.push('/user/request');
  };

  const clubs: Club[] = ['Driver', 'Wood', 'Utility', 'Iron', 'Wedge', 'Putter'];

  return (
    <RequestLayout
      title="クラブ選択"
      subtitle="使用したクラブを選択してください"
      showBackButton={true}
      onBackClick={handleBack}
      currentStep={1}
      totalSteps={4}
    >
      {/* 選択された動画の確認 */}
      {selectedVideos.length > 0 && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-blue-300 text-sm mb-6">
          <div className="font-bold mb-2">選択された動画:</div>
          <div>動画ファイル数: {selectedVideos.length}個</div>
          <div>ファイル名: {selectedVideos.map(v => v.name).join(', ')}</div>
        </div>
      )}

      {/* Club Selection Grid - 全6項目選択可能 */}
      <div className="mb-8">
        <div className="grid grid-cols-3 gap-x-3 gap-y-4 justify-items-center">
          {clubs.map((clubName) => (
            <button
              key={clubName}
              type="button"
              aria-pressed={club === clubName}
              onClick={() => handleClubSelect(clubName)}
              className={`px-4 py-2 h-11 rounded-full text-[14px] font-medium transition-all duration-200 min-w-[100px] ${
                club === clubName
                  ? 'bg-white text-violet-600 shadow-lg' 
                  : 'bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:scale-105'
              }`}
            >
              {clubName}
            </button>
          ))}
        </div>
      </div>

      {/* Next Button - クラブ選択時のみ有効 */}
      <div className="mt-8">
        <CommonButton
          onClick={handleNext}
          disabled={!club}
          className="w-full"
        >
          次へ
        </CommonButton>
      </div>
    </RequestLayout>
  );
}
