'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CoachLayout } from '../../../src/components/CoachLayout';
import { CoachButton } from '../../../src/components/CoachCommonLayout';
import { 
  ArrowLeft,
  Video,
  Clock,
  User,
  Play,
  MessageSquare,
  Calendar,
  Award,
  Target
} from 'lucide-react';

// 動画詳細の型定義
type VideoDetail = {
  video_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  video_url: string;
  thumbnail_url: string | null;
  club_type: string;
  swing_form: string;
  swing_note: string | null;
  upload_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  user_profile?: {
    golf_score_ave: number;
    golf_exp: string;
    sport_exp: string;
  };
};

export default function CoachVideoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.videoId as string;
  
  const [video, setVideo] = useState<VideoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 認証チェック
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('access_token');
      const userType = localStorage.getItem('user_type');
      
      if (!accessToken) {
        router.push('/auth/login');
        return;
      }

      if (userType !== 'coach') {
        router.push('/user/home');
        return;
      }
    };

    checkAuth();
  }, [router]);

  // 動画詳細の取得
  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        setLoading(true);
        
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          setError('認証トークンがありません');
          setLoading(false);
          return;
        }

        // 既存のバックエンドAPIを直接呼び出し
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';
        const response = await fetch(`${apiUrl}/video/${videoId}/with-sections`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('API呼び出しエラー:', response.status, errorData);
          throw new Error(`API呼び出しに失敗しました: ${response.status}`);
        }

        const videoData = await response.json();
        console.log('取得した動画詳細:', videoData);
        
        // バックエンドのレスポンス形式に合わせて変換
        const coachVideoDetail: VideoDetail = {
          video_id: videoData.video_id,
          user_id: videoData.user_id,
          user_name: videoData.user?.username || 'Unknown User',
          user_email: videoData.user?.email || 'unknown@example.com',
          video_url: videoData.video_url,
          thumbnail_url: videoData.thumbnail_url,
          club_type: videoData.club_type,
          swing_form: videoData.swing_form,
          swing_note: videoData.swing_note,
          upload_date: videoData.upload_date,
          status: videoData.section_groups && videoData.section_groups.length > 0 ? 'completed' : 'pending',
          priority: videoData.section_groups && videoData.section_groups.length > 0 ? 'low' : 'high',
          user_profile: videoData.user ? {
            golf_score_ave: videoData.user.golf_score_ave || 0,
            golf_exp: videoData.user.golf_exp || '不明',
            sport_exp: videoData.user.sport_exp || '不明'
          } : undefined
        };
        
        setVideo(coachVideoDetail);
        setError(null);
      } catch (err) {
        console.error('動画詳細取得エラー:', err);
        setError(err instanceof Error ? err.message : '動画の詳細取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoDetail();
    }
  }, [videoId]);

  // 動画再生の制御
  const handleVideoClick = () => {
    console.log('動画再生開始:', video.video_url);
    setIsPlaying(true);
  };

  // 動画再生停止
  const handleVideoStop = () => {
    console.log('動画再生停止');
    setIsPlaying(false);
  };

  // ステータスに基づく色の取得
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // ステータスの日本語表示
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '未対応';
      case 'in_progress': return '対応中';
      case 'completed': return '完了';
      default: return '不明';
    }
  };

  // 優先度に基づく色の取得
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // 優先度の日本語表示
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '不明';
    }
  };

  // 日付のフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ゴルフ経験の日本語表示
  const getGolfExpLabel = (exp: string) => {
    switch (exp) {
      case '1年未満': return '1年未満';
      case '1-3年': return '1-3年';
      case '3-5年': return '3-5年';
      case '5-10年': return '5-10年';
      case '10年以上': return '10年以上';
      default: return exp;
    }
  };

  if (loading) {
    return (
      <CoachLayout
        title="Loading..."
        subtitle="読み込み中..."
        showBackButton={true}
        onBackClick={() => router.push('/coach/videos')}
        backButtonText="動画一覧"
      >
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        </div>
      </CoachLayout>
    );
  }

  if (error || !video) {
    return (
      <CoachLayout
        title="エラー"
        subtitle="動画の読み込みに失敗しました"
        showBackButton={true}
        onBackClick={() => router.push('/coach/videos')}
        backButtonText="動画一覧"
      >
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error || '動画が見つかりません'}</p>
          <CoachButton onClick={() => router.push('/coach/videos')}>
            動画一覧に戻る
          </CoachButton>
        </div>
      </CoachLayout>
    );
  }

  return (
    <CoachLayout
      title="動画詳細"
      subtitle={`${video.user_name} さんの動画`}
      showBackButton={true}
      onBackClick={() => router.push('/coach/videos')}
      backButtonText="動画一覧"
    >
      <div className="space-y-6">
        {/* 動画プレビュー */}
        <div className="bg-white/10 rounded-xl p-4">
          <h3 className="text-white text-lg font-medium mb-4">動画プレビュー</h3>
          
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            {isPlaying ? (
              <div className="relative w-full h-full">
                <video
                  src={video.video_url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.error('動画再生エラー:', e);
                    setIsPlaying(false);
                  }}
                />
                {/* 停止ボタン */}
                <button
                  onClick={handleVideoStop}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 transition-colors"
                >
                  <Play size={16} className="rotate-90" />
                </button>
              </div>
            ) : (
              <>
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt="動画サムネイル"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video size={48} className="text-white/40" />
                  </div>
                )}
                
                {/* 再生ボタン */}
                <button
                  onClick={handleVideoClick}
                  className="absolute inset-0 bg-black/30 flex items-center justify-center hover:bg-black/40 transition-colors"
                >
                  <div className="bg-white/90 rounded-full p-4">
                    <Play size={32} className="text-gray-800 ml-1" />
                  </div>
                </button>
              </>
            )}
          </div>
          
          {/* 動画URL情報（デバッグ用） */}
          <div className="mt-2 text-xs text-white/60">
            <p>動画URL: {video.video_url}</p>
            <p>サムネイルURL: {video.thumbnail_url || 'なし'}</p>
          </div>
        </div>

        {/* 基本情報 */}
        <div className="bg-white/10 rounded-xl p-4">
          <h3 className="text-white text-lg font-medium mb-4">基本情報</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User size={16} className="text-orange-400" />
                <span className="text-white/80 text-sm">ユーザー名</span>
                <span className="text-white font-medium">{video.user_name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-orange-400" />
                <span className="text-white/80 text-sm">アップロード日時</span>
                <span className="text-white font-medium">{formatDate(video.upload_date)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Target size={16} className="text-orange-400" />
                <span className="text-white/80 text-sm">クラブ</span>
                <span className="bg-orange-500/20 px-2 py-1 rounded text-xs text-white">
                  {video.club_type}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-sm">ステータス</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(video.status)}`}>
                  {getStatusLabel(video.status)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-sm">優先度</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(video.priority)}`}>
                  {getPriorityLabel(video.priority)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-sm">問題</span>
                <span className="bg-blue-500/20 px-2 py-1 rounded text-xs text-white">
                  {video.swing_form}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ユーザープロフィール */}
        {video.user_profile && (
          <div className="bg-white/10 rounded-xl p-4">
            <h3 className="text-white text-lg font-medium mb-4">ユーザープロフィール</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-white text-2xl font-bold">{video.user_profile.golf_score_ave}</div>
                <div className="text-white/60 text-sm">平均スコア</div>
              </div>
              
              <div className="text-center">
                <div className="text-white text-lg font-medium">
                  {getGolfExpLabel(video.user_profile.golf_exp)}
                </div>
                <div className="text-white/60 text-sm">ゴルフ経験</div>
              </div>
              
              <div className="text-center">
                <div className="text-white text-sm font-medium">
                  {video.user_profile.sport_exp}
                </div>
                <div className="text-white/60 text-sm">スポーツ経験</div>
              </div>
            </div>
          </div>
        )}

        {/* 問題の詳細 */}
        {video.swing_note && (
          <div className="bg-white/10 rounded-xl p-4">
            <h3 className="text-white text-lg font-medium mb-4">問題の詳細</h3>
            
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/90 leading-relaxed">{video.swing_note}</p>
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex flex-col gap-4 mb-40">
          <CoachButton
            onClick={() => router.push(`/coach/videos/${videoId}/feedback`)}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-lg font-semibold"
          >
            <MessageSquare size={24} />
            添削フィードバックを作成
          </CoachButton>
          
          <CoachButton
            onClick={() => router.push('/coach/videos')}
            variant="secondary"
            className="w-full py-4 text-lg font-semibold"
          >
            動画一覧に戻る
          </CoachButton>
        </div>
        
        {/* メニューバーとの重複を避けるための追加スペース */}
        <div className="h-20"></div>
      </div>
    </CoachLayout>
  );
}
