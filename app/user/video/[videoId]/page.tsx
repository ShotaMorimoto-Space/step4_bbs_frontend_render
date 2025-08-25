'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Play, Clock, MessageCircle, Star } from 'lucide-react';
import { RequestLayout } from '@/src/components/RequestLayout';
import { CommonButton } from '@/src/components/CommonLayout';

type VideoDetail = {
  video_id: string;
  thumbnail_url: string;
  video_url: string;
  upload_date: string;
  club_type: string;
  swing_form: string;
  swing_note: string;
  has_feedback: boolean;
  feedback_sections: Array<{
    section_id: string;
    time_range: string;
    tags: string[];
    has_comment: boolean;
    comment_summary: string;
    full_comment?: string;
  }>;
};

export default function VideoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.videoId as string;
  
  const [videoDetail, setVideoDetail] = useState<VideoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 動画詳細を取得
  useEffect(() => {
    const fetchVideoDetail = async () => {
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        router.push('/auth/login');
        return;
      }

      try {
        // まず、動画の基本情報を取得
        const videoResponse = await fetch(`/api/video/${videoId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (videoResponse.ok) {
          const videoData = await videoResponse.json();
          console.log('取得した動画基本情報:', videoData);
          
          // フィードバック情報も取得
          const feedbackResponse = await fetch(`/api/video/${videoId}/feedback-summary`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });

          let feedbackData = { feedback_sections: [], total_sections: 0 };
          if (feedbackResponse.ok) {
            feedbackData = await feedbackResponse.json();
            console.log('取得したフィードバック情報:', feedbackData);
          }
          
          // データをVideoDetail型に変換
          const video: VideoDetail = {
            video_id: videoData.video_id || videoId,
            thumbnail_url: videoData.thumbnail_url || videoData.thumbnail_file || '',
            video_url: videoData.video_url || videoData.video_file || '',
            upload_date: videoData.upload_date || videoData.created_at || '',
            club_type: videoData.club_type || '',
            swing_form: videoData.swing_form || '',
            swing_note: videoData.swing_note || '',
            has_feedback: feedbackData.total_sections > 0,
            feedback_sections: feedbackData.feedback_sections || []
          };
          
          console.log('構築された動画詳細:', video);
          setVideoDetail(video);
        } else {
          console.error('動画基本情報の取得に失敗:', videoResponse.status);
          
          // 404エラーの場合、動画が存在しないか、APIエンドポイントが間違っている
          if (videoResponse.status === 404) {
            setError('動画が見つかりません。APIエンドポイントを確認してください。');
          } else {
            setError('動画情報の取得に失敗しました');
          }
        }
      } catch (error) {
        console.error('動画詳細取得エラー:', error);
        setError('動画詳細の取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoDetail();
    }
  }, [videoId, router]);

  // サムネイルURLを完全なURLに変換
  const getFullThumbnailUrl = (url: string) => {
    if (!url) return '';
    
    // 既に完全なURLの場合はそのまま返す
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // 相対パスの場合、Azure Blob StorageのベースURLに変換
    if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
      const azureBaseUrl = process.env.NEXT_PUBLIC_AZURE_BASE_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net';
      return `${azureBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;
    }
    
    return url;
  };

  // 動画URLを完全なURLに変換
  const getFullVideoUrl = (url: string) => {
    if (!url) return '';
    
    // 既に完全なURLの場合はそのまま返す
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // 相対パスの場合、Azure Blob StorageのベースURLに変換
    if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
      const azureBaseUrl = process.env.NEXT_PUBLIC_AZURE_BASE_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net';
      return `${azureBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;
    }
    
    return url;
  };

  // 動画再生の処理
  const handleVideoPlay = () => {
    if (videoDetail?.video_url) {
      const fullVideoUrl = getFullVideoUrl(videoDetail.video_url);
      console.log('動画再生URL:', fullVideoUrl);
      
      // 新しいタブで動画を開く（または埋め込みプレイヤーで再生）
      window.open(fullVideoUrl, '_blank');
    }
  };

  // カテゴリラベルの取得
  const getCategoryLabel = (tag: string): string => {
    const categoryLabels: { [key: string]: string } = {
      address: 'アドレス',
      takeaway: 'テイクバック',
      halfway_back: 'ハーフウェイバック',
      backswing: 'バックスイング',
      top: 'トップ',
      transition: '切り返し',
      downswing: 'ダウンスイング',
      impact: 'インパクト',
      follow_through: 'フォロースイング',
      finish_1: 'フィニッシュ-1',
      finish_2: 'フィニッシュ-2',
      other: 'その他'
    };
    
    return categoryLabels[tag] || tag;
  };

  const handleBack = () => {
    router.push('/user/home');
  };

  if (loading) {
    return (
      <RequestLayout
        title="読み込み中"
        subtitle="動画詳細を取得しています"
        showBackButton={true}
        onBackClick={handleBack}
      >
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-white text-base">動画詳細を読み込み中...</span>
        </div>
      </RequestLayout>
    );
  }

  if (error || !videoDetail) {
    return (
      <RequestLayout
        title="エラー"
        subtitle="動画詳細の取得に失敗しました"
        showBackButton={true}
        onBackClick={handleBack}
      >
        <div className="text-center">
          <div className="text-white/70 text-base mb-6">{error || '動画が見つかりません'}</div>
          <CommonButton
            onClick={handleBack}
            className="w-full"
          >
            ホームに戻る
          </CommonButton>
        </div>
      </RequestLayout>
    );
  }

  return (
    <RequestLayout
      title="動画詳細"
      subtitle="アップロードされた動画の詳細情報"
      showBackButton={true}
      onBackClick={handleBack}
    >
      {/* 動画プレビュー */}
      <div className="mb-6">
        <div className="relative rounded-2xl overflow-hidden bg-black">
          {videoDetail.video_url ? (
            // 動画がある場合は動画プレイヤーを表示（縦型動画用に高さを調整）
            <video
              src={getFullVideoUrl(videoDetail.video_url)}
              controls
              className="w-full h-96 object-contain mx-auto"
              poster={videoDetail.thumbnail_url ? getFullThumbnailUrl(videoDetail.thumbnail_url) : undefined}
              onError={(e) => {
                console.error('動画読み込みエラー:', e);
                // 動画が読み込めない場合はサムネイルを表示
                e.currentTarget.style.display = 'none';
                const thumbnailDiv = e.currentTarget.nextElementSibling;
                if (thumbnailDiv) {
                  thumbnailDiv.classList.remove('hidden');
                }
              }}
            />
          ) : null}
          
          {/* サムネイル表示（動画がない場合、または動画読み込みエラー時） */}
          <div className={`${videoDetail.video_url ? 'hidden' : ''} w-full h-96 flex items-center justify-center`}>
            {videoDetail.thumbnail_url ? (
              <img 
                src={getFullThumbnailUrl(videoDetail.thumbnail_url)} 
                alt="動画サムネイル" 
                className="w-full h-96 object-contain"
                onError={(e) => {
                  console.error('サムネイル読み込みエラー:', videoDetail.thumbnail_url);
                  e.currentTarget.style.display = 'none';
                  const placeholderDiv = e.currentTarget.nextElementSibling;
                  if (placeholderDiv) {
                    placeholderDiv.classList.remove('hidden');
                  }
                }}
              />
            ) : null}
            
            {/* プレースホルダー（サムネイルも動画もない場合） */}
            <div className={`${videoDetail.thumbnail_url ? 'hidden' : ''} w-full h-96 bg-gray-800 flex items-center justify-center`}>
              <div className="text-white/50 text-center">
                <Play size={48} />
                <div className="text-sm mt-2">動画がありません</div>
              </div>
            </div>
          </div>
          
          {/* 再生ボタン（動画がある場合のみ表示） */}
          {videoDetail.video_url && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
              <div className="text-white/70 text-sm">動画プレイヤーで再生できます</div>
            </div>
          )}
        </div>
        
        {/* デバッグ情報 */}
        <div className="text-white/50 text-xs mt-2 space-y-1">
          <div>動画URL: {videoDetail.video_url || 'なし'}</div>
          <div>サムネイルURL: {videoDetail.thumbnail_url || 'なし'}</div>
          <div>変換後の動画URL: {videoDetail.video_url ? getFullVideoUrl(videoDetail.video_url) : 'なし'}</div>
          <div>変換後のサムネイルURL: {videoDetail.thumbnail_url ? getFullThumbnailUrl(videoDetail.thumbnail_url) : 'なし'}</div>
        </div>
      </div>

      {/* 動画情報 */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/30">
        <h2 className="text-white text-lg font-medium mb-4">動画情報</h2>
        <div className="space-y-3 text-white/90">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-violet-400" />
            <span>アップロード日: {videoDetail.upload_date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star size={16} className="text-violet-400" />
            <span>クラブ: {videoDetail.club_type || '未設定'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-violet-400" />
            <span>スイング形式: {videoDetail.swing_form || '未設定'}</span>
          </div>
          {videoDetail.swing_note && (
            <div className="pt-2 border-t border-white/20">
              <div className="text-sm text-white/70 mb-1">メモ:</div>
              <div className="text-white/90">{videoDetail.swing_note}</div>
            </div>
          )}
        </div>
      </div>

      {/* コーチからのフィードバック */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
        <h2 className="text-white text-lg font-medium mb-4">コーチからのフィードバック</h2>
        
        {videoDetail.feedback_sections.length === 0 ? (
          <div className="text-white/70 text-center py-8">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
            <div>まだフィードバックがありません</div>
            <div className="text-sm mt-2">コーチが動画を確認すると、ここにフィードバックが表示されます</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 全体的なディスクリプション */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <MessageCircle size={20} className="text-violet-400" />
                全体的な評価
              </h3>
              <div className="text-white/90 text-sm leading-relaxed">
                この動画では、スイングの基本的なフォームは良好ですが、いくつかの改善点があります。
                特に、バックスイングでの手首の角度と、ダウンスイングでの体重移動に注目して練習することをお勧めします。
                <span className="text-violet-300 font-medium">Read More...</span>
              </div>
            </div>

            {/* カテゴリ別フィードバック */}
            <div>
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Star size={20} className="text-violet-400" />
                スイングフェーズ別フィードバック
                <span className="text-white/50 text-sm font-normal ml-2">
                  {videoDetail.feedback_sections.length} Steps
                </span>
              </h3>
              
              <div className="space-y-4">
                {videoDetail.feedback_sections.map((section, index) => (
                  <div key={section.section_id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    {/* ステップ番号とタイムライン */}
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {(index + 1).toString().padStart(2, '0')}
                        </div>
                        {index < videoDetail.feedback_sections.length - 1 && (
                          <div className="w-0.5 h-8 bg-violet-500/30 mt-2"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        {/* カテゴリ名と時間 */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">
                              {getCategoryLabel(section.tags[0]) || 'その他'}
                            </span>
                            <span className="text-white/50 text-xs">
                              {section.time_range}
                            </span>
                          </div>
                          <span className="px-2 py-1 text-xs text-violet-300 bg-violet-500/20 rounded-full">
                            {section.has_comment ? 'コメントあり' : 'コメントなし'}
                          </span>
                        </div>
                        
                        {/* タグ */}
                        {section.tags.length > 0 && (
                          <div className="flex gap-2 mb-3">
                            {section.tags.map((tag, tagIndex) => (
                              <span key={tagIndex} className="px-2 py-1 text-xs text-violet-600 bg-white rounded-full">
                                {getCategoryLabel(tag)}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* コメント */}
                        {section.has_comment && (
                          <div className="bg-white/10 rounded-lg p-3">
                            <div className="text-white/90 text-sm leading-relaxed">
                              {section.comment_summary}
                            </div>
                            {section.full_comment && (
                              <details className="mt-2">
                                <summary className="text-white/70 text-sm cursor-pointer hover:text-white/90">
                                  詳細を見る
                                </summary>
                                <div className="mt-2 text-white/90 text-sm leading-relaxed">
                                  {section.full_comment}
                                </div>
                              </details>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ドリル練習メニュー */}
            <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-xl p-4 border border-violet-500/30">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Play size={20} className="text-violet-400" />
                ドリル練習メニュー
                <span className="text-white/50 text-sm font-normal ml-2">
                  2つのポイントに絞った練習
                </span>
              </h3>
              
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm mb-1">手首の角度を意識したバックスイング</h4>
                      <p className="text-white/80 text-sm leading-relaxed">
                        バックスイングで手首を適切にコックし、クラブシャフトが地面と平行になるように練習してください。
                        鏡の前でゆっくりと動作を確認しながら、正しい角度を身につけましょう。
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm mb-1">体重移動のタイミング</h4>
                      <p className="text-white/80 text-sm leading-relaxed">
                        ダウンスイングで左足への体重移動を適切なタイミングで行い、インパクトで左足に体重が乗るように練習してください。
                        スローモーションで体重の移動を確認しながら、リズムを身につけましょう。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RequestLayout>
  );
}
