'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RequestLayout } from '../../../../../src/components/RequestLayout';
import { CommonButton } from '../../../../../src/components/CommonLayout';

const PROBLEMS = ['スライス','フック','トップ','ダフリ','飛距離不足','方向性','弾道の高さ','スピン量','リズム','ミート率'];

export default function UserRequestProblemPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [draftData, setDraftData] = useState<any>({});

  // 前の画面から渡されたデータを取得
  useEffect(() => {
    const savedDraft = localStorage.getItem('sb:req:draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setDraftData(draft);
        console.log('取得したドラフトデータ:', draft);
      } catch (error) {
        console.error('ドラフトデータの解析に失敗:', error);
      }
    }
  }, []);

  const toggle = (p: string) => {
    if (selected.includes(p)) {
      setSelected(selected.filter((x) => x !== p));
    } else {
      if (selected.length < 2) {
        setSelected([...selected, p]);
      }
    }
  };

  const handleNext = async () => {
    console.log('次へ進む - 選択された問題:', selected);
    console.log('次へ進む - 入力されたメモ:', note);
    
    // 選んだ問題とメモをドラフトに保存
    const currentDraft = JSON.parse(localStorage.getItem('sb:req:draft') || '{}');
    const updatedDraft = { ...currentDraft, problems: selected, note };
    
    console.log('保存前のドラフト:', currentDraft);
    console.log('更新後のドラフト:', updatedDraft);
    
    localStorage.setItem('sb:req:draft', JSON.stringify(updatedDraft));
    
    // 保存確認
    const savedDraft = localStorage.getItem('sb:req:draft');
    console.log('localStorageに保存されたドラフト:', savedDraft);
    
    // 動画ファイルを取得
    const savedFiles = localStorage.getItem('sb:req:files');
    if (savedFiles) {
      try {
        const files = JSON.parse(savedFiles);
        if (files.length > 0 && files[0] && files[0].url) {
          console.log('保存されたファイル:', files);
          
          // ファイルの妥当性をチェック
          if (!files[0].name || !files[0].url) {
            console.error('ファイル情報が不完全:', files[0]);
            alert('ファイル情報が不完全です。確認画面で再度アップロードしてください。');
            router.push('/user/request-confirm');
            return;
          }
          
          // 動画アップロードを実行
          try {
            // FormDataを作成
            const formData = new FormData();
            
                      // 動画ファイルを追加（Blobから作成）
          let videoBlob;
          try {
            // URLの妥当性をチェック
            if (!files[0].url || files[0].url === 'undefined' || files[0].url === 'null') {
              throw new Error('動画ファイルのURLが無効です');
            }
            
            // ローカルファイルの場合は直接Blobを使用
            if (files[0].url.startsWith('blob:')) {
              videoBlob = files[0].blob || await fetch(files[0].url).then(r => r.blob());
            } else {
              videoBlob = await fetch(files[0].url).then(r => r.blob());
            }
            
            if (!videoBlob) {
              throw new Error('動画ファイルの取得に失敗しました');
            }
            
            formData.append('video_file', videoBlob, files[0].name);
            console.log('動画ファイルを追加:', files[0].name);
          } catch (fetchError) {
            console.error('動画ファイルの取得エラー:', fetchError);
            // ファイル取得に失敗した場合は、確認画面へ遷移
            alert('動画ファイルの処理に失敗しました。確認画面で再度アップロードしてください。');
            router.push('/user/request-confirm');
            return;
          }
            
            // ユーザー情報を追加
            const userId = localStorage.getItem('user_id');
            const userEmail = localStorage.getItem('user_email');
            
            if (userId) {
              formData.append('user_id', userId);
            }
            
            if (userEmail) {
              formData.append('user_email', userEmail);
            }
            
            // 選択された内容を追加
            if (updatedDraft.club) {
              formData.append('club_type', updatedDraft.club);
              console.log('クラブタイプを追加:', updatedDraft.club);
            }
            
            if (selected.length > 0) {
              const problemsText = selected.join(', ');
              formData.append('swing_form', problemsText);
              console.log('スイング形式（問題）を追加:', problemsText);
            }
            
            if (note) {
              formData.append('swing_note', note);
              console.log('スイングメモを追加:', note);
            }
            
            // フロントエンドで生成されたサムネイルを追加
            if (updatedDraft.videoThumb && updatedDraft.videoThumb.startsWith('data:image/')) {
              try {
                // Data URLからBlobを作成
                const response = await fetch(updatedDraft.videoThumb);
                const thumbnailBlob = await response.blob();
                formData.append('thumbnail_file', thumbnailBlob, 'thumbnail.jpg');
                console.log('サムネイルファイルを追加');
              } catch (thumbnailError) {
                console.error('サムネイル処理エラー:', thumbnailError);
                // サムネイルが失敗しても動画アップロードは続行
                console.log('サムネイルなしでアップロードを続行します');
              }
            }
            
            // FormDataの内容を確認
            console.log('FormDataの内容確認:');
            for (let [key, value] of formData.entries()) {
              console.log(`${key}:`, value);
            }
            
            // バックエンドのAPIエンドポイント
                  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';
      const uploadUrl = `${apiUrl}/upload-video`;
            
            console.log('アップロードURL:', uploadUrl);
      console.log('APIベースURL:', apiUrl);
      console.log('完全なURL:', uploadUrl);
            console.log('FormDataの内容（送信前）:');
            for (let [key, value] of formData.entries()) {
              console.log(`${key}:`, value);
            }
            
            const response = await fetch(uploadUrl, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
              },
              body: formData,
            }).catch(fetchError => {
              console.error('fetch実行エラー:', fetchError);
              throw new Error(`ネットワークエラー: ${fetchError.message}`);
            });
            
            if (response.ok) {
              const result = await response.json();
              console.log('動画アップロード成功:', result);
              
              // 成功したら確認画面へ
              router.push('/user/request-confirm');
            } else {
              console.error('動画アップロード失敗:', response.status, response.statusText);
              
              // エラーの詳細を取得
              try {
                const errorData = await response.text();
                console.error('エラー詳細:', errorData);
                
                // ユーザーにエラーを表示
                alert(`動画アップロードに失敗しました: ${response.status} ${response.statusText}\n\n詳細: ${errorData}`);
              } catch (parseError) {
                alert(`動画アップロードに失敗しました: ${response.status} ${response.statusText}`);
              }
            }
          } catch (error) {
            console.error('動画アップロードエラー:', error);
            
            // ユーザーにエラーを表示
            const errorMessage = error instanceof Error ? error.message : String(error);
            alert(`動画アップロード中にエラーが発生しました:\n\n${errorMessage}`);
          }
        } else {
          // ファイルがない場合は確認画面へ
          router.push('/user/request-confirm');
        }
      } catch (error) {
        console.error('ファイル解析エラー:', error);
        router.push('/user/request-confirm');
      }
    } else {
      // ファイルがない場合は確認画面へ
      router.push('/user/request-confirm');
    }
  };

  const handleBack = () => {
    router.push('/user/request-club');
  };

  return (
    <RequestLayout
      title="問題選択"
      subtitle="スイングの問題を選択してください（最大2つまで）"
      showBackButton={true}
      onBackClick={handleBack}
      currentStep={2}
      totalSteps={4}
    >
      {/* 選択されたクラブの確認 */}
      {draftData.club && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-blue-300 text-sm mb-6">
          <div className="font-bold mb-2">選択されたクラブ:</div>
          <div>{draftData.club}</div>
        </div>
      )}

      {/* 問題選択 */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {PROBLEMS.map(p => {
            const isActive = selected.includes(p);
            return (
              <button
                key={p}
                onClick={() => toggle(p)}
                disabled={!isActive && selected.length >= 2}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-white text-violet-600 border border-white shadow-lg' 
                    : selected.length >= 2 && !isActive
                      ? 'bg-white/10 text-white/50 border border-white/10 cursor-not-allowed'
                      : 'bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:scale-105'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* 自由記入 */}
      <div className="mb-8">
        <h2 className="text-white mb-2 text-lg font-medium">自由記入（任意）</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="その他あれば記入してください"
          className="w-full min-h-[120px] bg-white/20 rounded-2xl text-white p-4 placeholder-white/60 border border-white/30 focus:outline-none focus:border-white/50 transition-colors resize-none"
        />
      </div>

      {/* 次へボタン */}
      <div className="mt-8">
        <CommonButton
          onClick={handleNext}
          className="w-full"
        >
          次へ
        </CommonButton>
      </div>
    </RequestLayout>
  );
}
