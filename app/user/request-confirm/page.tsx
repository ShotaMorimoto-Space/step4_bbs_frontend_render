'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RequestLayout } from '@/src/components/RequestLayout';
import { CommonButton } from '@/src/components/CommonLayout';

interface RequestDraft {
  videoThumb?: string;
  club?: string;
  problems?: string[];
  note?: string;
}

export default function UserRequestConfirmPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<RequestDraft>({});
  const [videoThumb, setVideoThumb] = useState<string>('');

  useEffect(() => {
    // ローカルストレージからドラフトデータを読み込み
    const savedDraft = localStorage.getItem('sb:req:draft');
    if (savedDraft) {
      setDraft(JSON.parse(savedDraft));
    }

    // 動画ファイルのURLも直接取得
    const savedFiles = localStorage.getItem('sb:req:files');
    if (savedFiles) {
      try {
        const files = JSON.parse(savedFiles);
        if (files.length > 0 && files[0].url) {
          setVideoThumb(files[0].url);
        }
      } catch (error) {
        console.error('Error parsing saved files:', error);
      }
    }

    // デバッグ用：保存されているデータを確認
    console.log('Saved draft:', savedDraft);
    console.log('Saved files:', savedFiles);
  }, []);

  const handleComplete = () => {
    // 依頼完了処理（後でバックエンドAPIと連携）
    console.log('依頼完了:', draft);
    
    // ドラフトデータをクリア
    localStorage.removeItem('sb:req:draft');
    localStorage.removeItem('sb:req:files');
    
    // 完了画面へ遷移
    router.push('/user/request-done');
  };

  const handleBack = () => {
    router.push('/user/request-problem');
  };

  // サムネイルURLを決定（優先順位：ドラフト > ファイル > デフォルト）
  const thumbnailUrl = draft.videoThumb || videoThumb || '/images/bg.jpg';

  // サムネイルURLを完全なURLに変換
  const getFullThumbnailUrl = (url: string) => {
    if (!url || url === '/images/bg.jpg') return url;
    
    // 相対パスの場合、Azure Blob StorageのベースURLに変換
    if (url.startsWith('/uploads/')) {
      // 環境変数からAzure Blob StorageのベースURLを取得
      const azureBaseUrl = process.env.NEXT_PUBLIC_AZURE_BASE_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net';
      return `${azureBaseUrl}${url}`;
    }
    
    return url;
  };

  const fullThumbnailUrl = getFullThumbnailUrl(thumbnailUrl);

  return (
    <RequestLayout
      title="依頼内容確認"
      subtitle="選択した内容を確認してください"
      showBackButton={true}
      onBackClick={handleBack}
      currentStep={3}
      totalSteps={4}
    >
      {/* 動画サムネイル */}
      <div className="mb-6">
        {fullThumbnailUrl && fullThumbnailUrl !== '/images/bg.jpg' ? (
          <img 
            src={fullThumbnailUrl} 
            className="w-full rounded-xl object-contain bg-black h-[200px]" 
            alt="動画サムネイル"
            onError={(e) => {
              console.error('サムネイル読み込みエラー:', e);
              // エラー時はプレースホルダーを表示
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        
        {/* プレースホルダー（サムネイルがない場合） */}
        <div className={`w-full rounded-xl bg-black h-[200px] flex items-center justify-center ${fullThumbnailUrl && fullThumbnailUrl !== '/images/bg.jpg' ? 'hidden' : ''}`}>
          <div className="text-white/70 text-center">
            <div className="text-4xl mb-2">🎥</div>
            <div className="text-sm">動画サムネイル</div>
          </div>
        </div>
        
        {/* デバッグ情報 */}
        <div className="text-white/50 text-xs mt-2 space-y-1">
          <div>元のサムネイルURL: {thumbnailUrl || 'なし'}</div>
          <div>変換後のURL: {fullThumbnailUrl || 'なし'}</div>
          <div>AzureベースURL: https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net</div>
        </div>
      </div>

      {/* 依頼内容の確認 */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/30 text-white space-y-4 mb-8">
        <div className="flex items-start">
          <span className="font-semibold min-w-[80px]">クラブ：</span>
          <span className="flex-1">{draft.club || '未選択'}</span>
        </div>
        <div className="flex items-start">
          <span className="font-semibold min-w-[80px]">課題：</span>
          <span className="flex-1">{draft.problems?.join('、') || '未選択'}</span>
        </div>
        <div className="flex items-start">
          <span className="font-semibold min-w-[80px]">自由記入：</span>
          <span className="flex-1">{draft.note || '（なし）'}</span>
        </div>
      </div>

      {/* 完了ボタン */}
      <div className="mt-8">
        <CommonButton
          onClick={handleComplete}
          className="w-full"
        >
          依頼を完了する
        </CommonButton>
      </div>
    </RequestLayout>
  );
}
