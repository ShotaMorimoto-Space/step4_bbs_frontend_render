'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CoachLayout } from '@/components/CoachLayout';
import { safeLocalStorage } from '@/utils/storage';
import { CoachButton } from '@/components/CoachCommonLayout';
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

  // セクショングループ作成とフィードバック画面への遷移
  const createFeedbackSession = async () => {
    try {
      const accessToken = safeLocalStorage.getItem('access_token');
      if (!accessToken) {
        setError('認証トークンがありません');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';
      
      // セクショングループを作成
      const response = await fetch(`${apiUrl}/coach/create-section-group-simple/${videoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          video_id: videoId,
          session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('セクショングループ作成エラー:', response.status, errorData);
        throw new Error(`セクショングループの作成に失敗しました: ${response.status}`);
      }

      const result = await response.json();
      console.log('セクショングループ作成結果:', result);

      // 添削画面へ遷移
      router.push(`/coach/videos/${videoId}/feedback`);
      
    } catch (error) {
      console.error('セクショングループ作成エラー:', error);
      setError('セクショングループの作成に失敗しました');
    }
  };

  // 認証チェック
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = safeLocalStorage.getItem('access_token');
      const userType = safeLocalStorage.getItem('user_type');
      
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
        
        const accessToken = safeLocalStorage.getItem('access_token');
        if (!accessToken) {
          setError('認証トークンがありません');
          setLoading(false);
          return;
        }

        // 既存のバックエンドAPIを直接呼び出し
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';
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
    if (video) {
      console.log('動画再生開始:', video.video_url);
      setIsPlaying(true);
    }
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

        {/* 動画情報 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/30">
          <h2 className="text-white text-lg font-medium mb-4">動画情報</h2>
          <div className="space-y-3 text-white/90">
            <div className="flex items-center gap-2">
              <User size={16} className="text-violet-400" />
              <span>ユーザー: {video.user_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Video size={16} className="text-violet-400" />
              <span>クラブ: {video.club_type || '未設定'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target size={16} className="text-violet-400" />
              <span>スイング形式: {video.swing_form || '未設定'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-violet-400" />
              <span>アップロード日: {new Date(video.upload_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={16} className="text-violet-400" />
              <span>ステータス: {video.status}</span>
            </div>
            {video.swing_note && (
              <div className="pt-2 border-t border-white/20">
                <div className="text-sm text-white/70 mb-1">メモ:</div>
                <div className="text-white/90">{video.swing_note}</div>
              </div>
            )}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/30">
          <h2 className="text-white text-lg font-medium mb-4">アクション</h2>
          <div className="space-y-3">
            <button
              onClick={createFeedbackSession}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare size={20} />
              添削フィードバックを作成
            </button>
            <div className="text-sm text-white/60 text-center">
              このボタンを押すと、フィードバック用のセッションが作成され、添削画面に遷移します
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
