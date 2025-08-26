'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CoachLayout } from '@/components/CoachLayout';
import { CoachButton } from '@/components/CoachCommonLayout';
import { 
  ArrowLeft,
  Video,
  Clock,
  User,
  Play,
  Eye,
  MessageSquare,
  Filter,
  Search
} from 'lucide-react';

// 動画アイテムの型定義
type VideoItem = {
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
};

export default function CoachVideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  // 添削依頼動画の取得
  useEffect(() => {
    const fetchVideos = async () => {
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
        const response = await fetch(`${apiUrl}/videos`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('API呼び出しエラー:', response.status, errorData);
          throw new Error(`API呼び出しに失敗しました: ${response.status}`);
        }

        const videosData = await response.json();
        console.log('取得した動画データ:', videosData);
        
        // デバッグ用：最初の動画のユーザー情報を詳細にログ出力
        if (videosData.length > 0) {
          console.log('最初の動画のユーザー情報:', {
            video: videosData[0],
            user: videosData[0].user,
            username: videosData[0].user?.username,
            email: videosData[0].user?.email,
            userKeys: videosData[0].user ? Object.keys(videosData[0].user) : 'user object is null/undefined'
          });
        }
        
        // バックエンドのレスポンス形式に合わせて変換
        const coachVideos = videosData.map((video: any) => ({
          video_id: video.video_id,
          user_id: video.user_id,
          user_name: video.user?.username || video.user?.name || 'Unknown User',
          user_email: video.user?.email || 'unknown@example.com',
          video_url: video.video_url,
          thumbnail_url: video.thumbnail_url,
          club_type: video.club_type,
          swing_form: video.swing_form,
          swing_note: video.swing_note,
          upload_date: video.upload_date,
          status: video.section_groups && video.section_groups.length > 0 ? 'completed' : 'pending',
          priority: video.section_groups && video.section_groups.length > 0 ? 'low' : 'high'
        }));
        
        setVideos(coachVideos);
        setError(null);
      } catch (err) {
        console.error('動画取得エラー:', err);
        setError(err instanceof Error ? err.message : '動画の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // フィルタリングされた動画
  const filteredVideos = videos.filter(video => {
    const statusMatch = filterStatus === 'all' || video.status === filterStatus;
    const searchMatch = video.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       video.club_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       video.swing_form.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (video.swing_note && video.swing_note.toLowerCase().includes(searchQuery.toLowerCase()));
    return statusMatch && searchMatch;
  });

  // 動画の詳細表示
  const handleVideoClick = (videoId: string) => {
    router.push(`/coach/videos/${videoId}`);
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <CoachLayout
      title="動画管理"
      subtitle="添削依頼動画の管理"
      showBackButton={true}
      onBackClick={() => router.push('/coach/home')}
      backButtonText="ホーム"
    >
      <div className="space-y-6">
        {/* 検索・フィルター */}
        <div className="space-y-4">
          {/* 検索バー */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
            <input
              type="text"
              placeholder="ユーザー名、クラブ、問題を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* フィルター */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { value: 'all', label: '全て' },
              { value: 'pending', label: '未対応' },
              { value: 'in_progress', label: '対応中' },
              { value: 'completed', label: '完了' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filterStatus === filter.value
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">
              {videos.filter(v => v.status === 'pending').length}
            </div>
            <div className="text-white/60 text-sm">未対応</div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">
              {videos.filter(v => v.status === 'in_progress').length}
            </div>
            <div className="text-white/60 text-sm">対応中</div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">
              {videos.filter(v => v.status === 'completed').length}
            </div>
            <div className="text-white/60 text-sm">完了</div>
          </div>
        </div>

        {/* 動画一覧 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white/60 mt-4">動画を読み込み中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <CoachButton onClick={() => window.location.reload()}>
              再試行
            </CoachButton>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <Video size={48} className="mx-auto mb-4 text-white/40" />
            <p className="text-white/60">該当する動画がありません</p>
            <p className="text-white/40 text-sm mt-2">検索条件を変更してください</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-white text-lg font-medium">
              動画一覧 ({filteredVideos.length}件)
            </h3>
            
                         {filteredVideos.map((video) => (
               <div
                 key={video.video_id}
                 onClick={() => handleVideoClick(video.video_id)}
                 className="bg-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-colors border border-white/20"
               >
                 <div className="flex items-start gap-3">
                   {/* サムネイル */}
                   <div className="relative w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                     {video.thumbnail_url ? (
                       <img
                         src={video.thumbnail_url}
                         alt="動画サムネイル"
                         className="w-full h-full object-cover"
                       />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center">
                         <Video size={24} className="text-white/40" />
                       </div>
                     )}
                     <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                       <Play size={16} className="text-white" />
                     </div>
                   </div>

                   {/* 動画情報 */}
                   <div className="flex-1 min-w-0 max-w-[calc(100%-6rem)]">
                     <div className="flex flex-col gap-2 mb-3">
                       <h4 className="text-white font-medium truncate">
                         {video.user_name} さん
                       </h4>
                       
                       {/* ステータスと優先度を縦に配置 */}
                       <div className="flex flex-col gap-1">
                         <span className={`px-2 py-1 rounded-full text-xs font-medium text-white w-fit ${getStatusColor(video.status)}`}>
                           {getStatusLabel(video.status)}
                         </span>
                         <span className={`px-2 py-1 rounded-full text-xs font-medium text-white w-fit ${getPriorityColor(video.priority)}`}>
                           {getPriorityLabel(video.priority)}
                         </span>
                       </div>
                     </div>

                     <div className="space-y-2 text-sm">
                       {/* クラブタイプとスイングフォームを縦に配置 */}
                       <div className="flex flex-col gap-1">
                         <span className="bg-orange-500/20 px-2 py-1 rounded text-xs text-white w-fit">
                           {video.club_type}
                         </span>
                         {/* スイングフォームを分割して個別のアイコンとして表示 */}
                         <div className="flex flex-wrap gap-1">
                           {video.swing_form ? (
                             video.swing_form.split(',').map((form, index) => (
                               <span 
                                 key={index} 
                                 className="bg-blue-500/20 px-2 py-1 rounded text-xs text-white w-fit"
                               >
                                 {form.trim()}
                               </span>
                             ))
                           ) : (
                             <span className="bg-gray-500/20 px-2 py-1 rounded text-xs text-white w-fit">
                               未設定
                             </span>
                           )}
                         </div>
                       </div>
                       
                       {video.swing_note && (
                         <p className="text-white/70 text-xs line-clamp-2">
                           {video.swing_note}
                         </p>
                       )}
                       
                       <div className="flex flex-col gap-1 text-white/60 text-xs">
                         <div className="flex items-center gap-1">
                           <Clock size={14} />
                           <span className="truncate">{formatDate(video.upload_date)}</span>
                         </div>
                         <div className="flex items-center gap-1">
                           <User size={14} />
                           <span className="truncate">{video.user_email}</span>
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* アクションボタン */}
                   <div className="flex flex-col gap-2">
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         handleVideoClick(video.video_id);
                       }}
                       className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                     >
                       <Eye size={16} />
                       詳細
                     </button>
                     
                     {video.status === 'pending' && (
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           router.push(`/coach/videos/${video.video_id}/feedback`);
                         }}
                         className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                       >
                         <MessageSquare size={16} />
                         添削
                       </button>
                     )}
                   </div>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </CoachLayout>
  );
}
