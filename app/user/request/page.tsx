'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Upload,
  X,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RequestLayout } from '../../../src/components/RequestLayout';
import { CommonButton, CommonErrorMessage } from '../../../src/components/CommonLayout';

type UploadFile = {
  id: string;
  file: File;
  url: string;
  size: number;
  name: string;
};

export default function UserRequestPage() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step] = useState<0 | 1 | 2 | 3>(0); // Request=0, Club=1, Problem=2, Done=3
  const [errorMessage, setErrorMessage] = useState('');
  const [thumbnailStatus, setThumbnailStatus] = useState<string>('');
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB（サムネイル生成のため）

  // クライアントサイドサムネイル生成関数
  const generateClientThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // ファイルサイズチェック
      if (file.size > MAX_FILE_SIZE) {
        reject(new Error('ファイルサイズが大きすぎます（30MB以下にしてください）'));
        return;
      }

      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas 2D context が利用できません'));
        return;
      }
      
      // タイムアウト設定（10秒）
      const timeout = setTimeout(() => {
        reject(new Error('クライアントサイド生成がタイムアウトしました'));
      }, 10000);
      
      video.onloadedmetadata = () => {
        console.log('動画メタデータ読み込み完了:', {
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          duration: video.duration
        });
        
        // メタデータが読み込まれた後にCanvasサイズを設定
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          const maxWidth = 400;
          const maxHeight = 300;
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;
          
          console.log('動画寸法:', { videoWidth, videoHeight });
          
          let width, height;
          if (videoWidth > maxWidth || videoHeight > maxHeight) {
            const ratio = Math.min(maxWidth / videoWidth, maxHeight / videoHeight);
            width = Math.floor(videoWidth * ratio);
            height = Math.floor(videoHeight * ratio);
          } else {
            width = videoWidth;
            height = videoHeight;
          }
          
          console.log('計算されたCanvasサイズ:', { width, height });
          
          canvas.width = width;
          canvas.height = height;
          
          console.log('Canvasサイズ設定完了:', { 
            canvasWidth: canvas.width, 
            canvasHeight: canvas.height,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight
          });
          
          // 動画の長さが1秒未満の場合は0秒目を使用
          const seekTime = Math.min(1, video.duration / 2);
          video.currentTime = seekTime;
        } else {
          console.error('動画の寸法が取得できません');
          reject(new Error('動画の寸法が取得できません'));
        }
      };
      
      video.onseeked = () => {
        try {
          console.log('フレーム抽出開始:', {
            currentTime: video.currentTime,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
            canvasWidth: canvas.width,
            canvasHeight: canvas.height
          });
          
          // 背景を黒で塗りつぶし
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // 動画フレームを描画
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
          console.log('サムネイル生成完了:', {
            thumbnailUrl: thumbnailUrl.substring(0, 50) + '...',
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            thumbnailLength: thumbnailUrl.length
          });
          
          clearTimeout(timeout);
          resolve(thumbnailUrl);
        } catch (error) {
          console.error('サムネイル生成エラー:', error);
          clearTimeout(timeout);
          reject(error);
        }
      };
      
      video.onerror = (e) => {
        console.error('動画読み込みエラー:', e);
        clearTimeout(timeout);
        reject(new Error('動画の読み込みに失敗しました'));
      };
      
      // 動画の読み込みを開始
      video.src = URL.createObjectURL(file);
      video.load();
      
      // 追加の読み込み確認
      video.oncanplay = () => {
        console.log('動画再生可能:', {
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          readyState: video.readyState
        });
      };
    });
  };

  // 認証状態の確認
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const userEmail = localStorage.getItem('user_email');
    
    if (!accessToken || !userEmail) {
      console.log('認証情報が不足しています。ログインページに移動します。');
      router.push('/auth/login');
      return;
    }
    
    console.log('認証確認完了:', { hasToken: !!accessToken, email: userEmail });
  }, [router]);

  // ユーザー認証の確認
  const checkAuth = () => {
    const accessToken = localStorage.getItem('access_token');
    const userEmail = localStorage.getItem('user_email');
    
    if (!accessToken || !userEmail) {
      setErrorMessage('ログインが必要です。ログインページに移動します。');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      return false;
    }
    
    return true;
  };

  // バックエンドに動画をアップロード
  const uploadVideo = async (file: File): Promise<{ video_url: string; thumbnail_url?: string }> => {
    // 認証チェック
    if (!checkAuth()) {
      throw new Error('認証が必要です');
    }

    // 1. クライアントサイド生成試行
    let clientThumbnail: string | null = null;
    try {
      setThumbnailStatus('クライアントサイドでサムネイル生成中...');
      console.log('クライアントサイドサムネイル生成開始...');
      clientThumbnail = await generateClientThumbnail(file);
      console.log('クライアントサイド生成成功:', {
        thumbnailLength: clientThumbnail.length,
        thumbnailStart: clientThumbnail.substring(0, 50),
        isDataUrl: clientThumbnail.startsWith('data:image/')
      });
      setThumbnailStatus('クライアントサイドでサムネイル生成完了！');
      setTimeout(() => setThumbnailStatus(''), 3000);
    } catch (error) {
      console.log('クライアントサイド生成失敗:', error);
      setThumbnailStatus('サムネイル生成に失敗しました');
      setTimeout(() => setThumbnailStatus(''), 3000);
    }

    const formData = new FormData();
    formData.append('video_file', file);
    
    // ユーザー情報を追加
    const userEmail = localStorage.getItem('user_email');
    const userId = localStorage.getItem('user_id');
    
    if (userEmail) {
      formData.append('user_email', userEmail);
    }
    
    if (userId) {
      formData.append('user_id', userId);
    }
    
    // request-clubとrequest-problemで選択された内容を追加
    const savedDraft = localStorage.getItem('sb:req:draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        console.log('保存されたドラフトデータ:', draft);
        
        if (draft.club) {
          formData.append('club_type', draft.club);
          console.log('クラブタイプを追加:', draft.club);
        }
        
        if (draft.problems && draft.problems.length > 0) {
          // 問題をカンマ区切りで結合
          const problemsText = draft.problems.join(', ');
          formData.append('swing_form', problemsText);
          console.log('スイング形式（問題）を追加:', problemsText);
        }
        
        if (draft.note) {
          formData.append('swing_note', draft.note);
          console.log('スイングメモを追加:', draft.note);
        }
      } catch (error) {
        console.error('ドラフトデータの解析に失敗:', error);
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
    
    console.log('アップロード情報:', {
      apiUrl,
      uploadUrl,
      userEmail,
      userId,
      fileName: file.name,
      fileSize: file.size,
      clientThumbnailGenerated: !!clientThumbnail
    });
    
    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      
      console.log('アップロードレスポンス:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { detail: response.statusText };
        }
        throw new Error(`アップロード失敗: ${errorData.detail || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('アップロード成功:', result);
      console.log('アップロード結果の詳細:', {
        user_id: result.user_id,
        video_url: result.video_url,
        thumbnail_url: result.thumbnail_url,
        club_type: result.club_type,
        swing_form: result.swing_form
      });

      // 新しいuser_idをlocalStorageに保存
      if (result.user_id) {
        localStorage.setItem('user_id', result.user_id);
        console.log('新しいuser_idをlocalStorageに保存:', result.user_id);
      }
      
      // 3. サムネイルURLの決定（クライアント生成優先）
      const thumbnailUrl = clientThumbnail || result.thumbnail_url;
      
      console.log('サムネイルURL決定:', {
        clientThumbnail: clientThumbnail ? clientThumbnail.substring(0, 50) + '...' : 'なし',
        serverThumbnail: result.thumbnail_url || 'なし',
        finalThumbnail: thumbnailUrl ? thumbnailUrl.substring(0, 50) + '...' : 'なし',
        thumbnailLength: thumbnailUrl?.length
      });
      
      return {
        video_url: result.video_url,
        thumbnail_url: thumbnailUrl
      };
    } catch (error) {
      console.error('動画アップロードエラー:', error);
      throw error;
    }
  };

  const persistForNext = (items: UploadFile[]) => {
    // 次画面で使う軽いメタだけ保存（巨大Fileは保存しない）
    const meta = items.map(i => ({ id: i.id, name: i.name, size: i.size, url: i.url }));
    localStorage.setItem('sb:req:files', JSON.stringify(meta));
  };

  const handlePickedFiles = async (selectedFiles: File[]) => {
    if (!selectedFiles.length) return;
    
    setIsSubmitting(true);
    setErrorMessage('動画をアップロード中...');
    
    try {
      const newFiles: UploadFile[] = [];
      const oversizedFiles: string[] = [];

      // ファイルサイズチェック
      selectedFiles.forEach(file => {
        if (file.size > MAX_FILE_SIZE) {
          oversizedFiles.push(file.name);
          return;
        }
      });

      if (oversizedFiles.length > 0) {
        setErrorMessage(`以下のファイルは30MBを超えているため選択できません: ${oversizedFiles.join(', ')}`);
        setTimeout(() => setErrorMessage(''), 5000);
        setIsSubmitting(false);
        return;
      }

      // 各ファイルをバックエンドにアップロード
      for (const file of selectedFiles) {
        try {
          const uploadResult = await uploadVideo(file);
          
          const id = crypto.randomUUID();
          const url = URL.createObjectURL(file); // ローカルプレビュー用
          
          newFiles.push({
            id,
            file,
            url,
            size: file.size,
            name: file.name
          });
          
          // ドラフトに動画情報を保存
          const currentDraft = JSON.parse(localStorage.getItem('sb:req:draft') || '{}');
          const updatedDraft = { 
            ...currentDraft, 
            videoThumb: uploadResult.thumbnail_url,
            videoUrl: uploadResult.video_url
          };
          
          console.log('ドラフト保存:', {
            videoThumb: uploadResult.thumbnail_url?.substring(0, 50) + '...',
            videoUrl: uploadResult.video_url,
            thumbnailLength: uploadResult.thumbnail_url?.length
          });
          
          localStorage.setItem('sb:req:draft', JSON.stringify(updatedDraft));
          
        } catch (error) {
          console.error(`ファイル ${file.name} のアップロード失敗:`, error);
          setErrorMessage(`ファイル ${file.name} のアップロードに失敗しました`);
          setTimeout(() => setErrorMessage(''), 5000);
          setIsSubmitting(false);
          return;
        }
      }

      setFiles(prev => {
        const next = [...prev, ...newFiles];
        // 次画面用に軽量メタだけ保存
        const meta = next.map(i => ({ id: i.id, name: i.name, size: i.size, url: i.url }));
        localStorage.setItem('sb:req:files', JSON.stringify(meta));
        return next;
      });
      
      setErrorMessage('');
      setIsSubmitting(false);
      
      // アップロード完了後、自動遷移は行わない
      // 「次へ」ボタンを押したときだけ次の画面に遷移
      console.log('[upload] 動画アップロード完了。次へボタンを押して次の画面に進んでください。');
      
    } catch (error) {
      console.error('動画処理エラー:', error);
      setErrorMessage('動画の処理に失敗しました');
      setTimeout(() => setErrorMessage(''), 5000);
      setIsSubmitting(false);
    }
  };

  const openVideoPicker = async () => {
    // File System Access API が使える場合（Safari 16.4+ / Chrome 86+ など）
    const anyWindow = window as any;
    if (anyWindow.showOpenFilePicker) {
      try {
        console.log('[picker] Using File System Access API');
        const handles = await anyWindow.showOpenFilePicker({
          multiple: true,
          types: [
            {
              description: 'Videos',
              accept: { 'video/*': ['.mp4', '.mov', '.webm', '.m4v'] },
            },
          ],
          excludeAcceptAllOption: true,
        });
        const selectedFiles = await Promise.all(handles.map((h: any) => h.getFile()));
        console.log('[picked]', selectedFiles.length);
        handlePickedFiles(selectedFiles);
        return;
      } catch (err) {
        // ユーザーキャンセル等はフォールバックせず無視
        console.log('File picker cancelled or failed:', err);
      }
    }
    // フォールバック：<input type="file"> を開く
    console.log('[picker] Using fallback input');
    fileInputRef.current?.click();
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;

    setIsSubmitting(true);
    
    // ダミー送信処理
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // クリーンアップ
    files.forEach(file => URL.revokeObjectURL(file.url));
    setFiles([]);
    setIsSubmitting(false);
    
    // アップロード完了メッセージ
    alert('アップロードを受け付けました');
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)}MB`;
  };

  return (
    <RequestLayout
      title="動画アップロード"
      subtitle="添削依頼する動画を選択してください"
      currentStep={step}
      totalSteps={4}
    >
      {/* 動画アップロード完了後の「次へ」ボタン */}
      {files.length > 0 && !isSubmitting && (
        <div className="space-y-4">
          {/* 保存される情報のプレビュー */}
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-blue-300 text-sm">
            <div className="font-bold mb-2">次の画面に渡される情報:</div>
            <div>動画ファイル数: {files.length}個</div>
            <div>ファイル名: {files.map(f => f.name).join(', ')}</div>
            <div>合計サイズ: {formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}</div>
          </div>
          
          {/* 次へボタン */}
          <div className="text-center">
            <CommonButton
              onClick={() => {
                // 選択された動画ファイルの情報をlocalStorageに保存
                const videoData = files.map(file => ({
                  id: file.id,
                  name: file.name,
                  size: file.size,
                  url: file.url
                }));
                
                localStorage.setItem('selectedVideos', JSON.stringify(videoData));
                console.log('動画ファイル情報を保存:', videoData);
                
                // 次の画面（クラブ選択）に遷移
                router.push('/user/request-club');
              }}
              className="w-full"
            >
              次へ
            </CommonButton>
          </div>
        </div>
      )}

      {/* 動画アップロードエリア */}
      <div className="text-center">
        {/* Upload Button */}
        <div className="flex flex-col items-center mb-8">
          <button
            type="button"
            onClick={openVideoPicker}
            disabled={isSubmitting}
            aria-label="動画をアップロード"
            className={`bg-white rounded-full h-[54px] px-6 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="text-violet-600 animate-spin" size={20} />
                <span className="text-violet-600 font-medium">アップロード中...</span>
              </>
            ) : (
              <>
                <Upload className="text-violet-600" size={20} />
                <span className="text-violet-600 font-medium">動画をアップロード</span>
              </>
            )}
          </button>
          
          {/* Error Message */}
          {errorMessage && <CommonErrorMessage message={errorMessage} />}
          
          {/* Thumbnail Status */}
          {thumbnailStatus && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-blue-300 text-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                <span>{thumbnailStatus}</span>
              </div>
            </div>
          )}
          
          {/* Success Message */}
          {files.length > 0 && !isSubmitting && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-green-300 text-sm">
              <div className="font-bold mb-2">✅ 動画アップロード完了！</div>
              <div>{files.length}個の動画が正常にアップロードされました</div>
              <div className="mt-2 text-xs opacity-80">
                下の「次へ」ボタンを押して、クラブ選択画面に進んでください
              </div>
            </div>
          )}
        </div>

        {/* 非表示の動画ファイル入力（フォールバック用） */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,.mp4,.mov,.webm"
          multiple
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files ?? []);
            console.log('[picked]', selectedFiles.length);
            handlePickedFiles(selectedFiles);
            // 同じファイルを連続選択できるようにリセット
            e.currentTarget.value = '';
          }}
          className="hidden"
        />

        {/* File Queue */}
        {files.length > 0 && (
          <div className="space-y-3 mb-8">
            <h3 className="text-white text-lg font-medium mb-4">選択された動画</h3>
            {files.map((file) => (
              <div
                key={file.id}
                className="rounded-2xl bg-white/10 border border-white/15 p-3 flex items-center gap-3"
              >
                {/* Video Preview */}
                <video
                  src={file.url}
                  muted
                  playsInline
                  className="w-16 h-10 object-cover rounded-lg bg-black/20"
                />
                
                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {file.name}
                  </p>
                  <p className="text-white/70 text-xs">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => removeFile(file.id)}
                  aria-label={`${file.name}を削除`}
                  className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                >
                  <X className="text-red-400" size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequestLayout>
  );
}
