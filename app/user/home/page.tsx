'use client';

import React, { useState, useMemo, useEffect } from 'react';
import './home.css';
import {
  Heart,
  Home as HomeIcon,
  FileText as FileTextIcon,
  User as UserIcon,
  Settings as SettingsIcon,
  Cog,
  Play,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserHomeLayout } from '../../../src/components/UserHomeLayout';

// 動画アイテムの型定義
type VideoItem = {
  video_id: string;
  thumbnail_url: string | null;
  upload_date: string;
  club_type: string;
  swing_form: string;
  has_feedback: boolean;
};

// クライアントサイドのみでレンダリングするデバッグ情報コンポーネント
const ClientOnlyDebugInfo: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-white/10 rounded-lg p-3 lg:p-4 text-white/70 text-xs lg:text-sm">
      <div>認証状態: {localStorage.getItem('access_token') ? 'ログイン中' : '未ログイン'}</div>
      <div>メール: {localStorage.getItem('user_email') || 'なし'}</div>
      <div>ロール: {localStorage.getItem('user_role') || 'なし'}</div>
    </div>
  );
};

export default function UserHomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 認証状態の確認とユーザーの動画一覧を取得
  useEffect(() => {
    const checkAuthAndFetchVideos = async () => {
      const accessToken = localStorage.getItem('access_token');
      const userEmail = localStorage.getItem('user_email');
      const userId = localStorage.getItem('user_id');
      const userType = localStorage.getItem('user_type');
      
      // デバッグ用：localStorageの内容を確認
      console.log('localStorageの内容:', {
        accessToken: accessToken ? `存在 (${accessToken.substring(0, 20)}...)` : 'なし',
        userEmail,
        userId,
        userType,
        userIdType: typeof userId,
        userIdLength: userId ? userId.length : 0
      });
      
      // 認証情報の詳細ログ
      console.log('認証情報詳細:', {
        hasAccessToken: !!accessToken,
        accessTokenLength: accessToken ? accessToken.length : 0,
        hasUserEmail: !!userEmail,
        hasUserId: !!userId,
        hasUserType: !!userType
      });
      
      if (!accessToken || !userEmail) {
        console.log('認証情報が不足しています。ログインページに移動します。');
        router.push('/auth/login');
        return;
      }

      // usertypeチェック - コーチの場合はcoach/homeに遷移
      if (userType === 'coach') {
        console.log('コーチアカウントです。コーチホームに移動します。');
        router.push('/coach/home');
        return;
      }
      
      console.log('認証確認完了:', { hasToken: !!accessToken, email: userEmail, userType });
      
      // ユーザーの動画一覧を取得
      if (userId && accessToken) {
        try {
          // UUIDの形式を検証
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (!uuidRegex.test(userId)) {
            console.error('無効なuser_id形式:', userId);
            setError('ユーザーIDの形式が無効です');
            setLoading(false);
            return;
          }
          
          // アクセストークンの形式を検証
          if (!accessToken.startsWith('mock_token_')) {
            console.error('無効なaccess_token形式:', accessToken);
            setError('アクセストークンの形式が無効です');
            setLoading(false);
            return;
          }
          
          console.log('動画取得APIを呼び出し:', {
            url: `/api/user/videos?user_id=${userId}`,
            userId: userId,
            hasToken: !!accessToken,
            isUUID: uuidRegex.test(userId)
          });
          
          const response = await fetch(`/api/user/videos?user_id=${userId}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          console.log('APIレスポンス:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('取得した動画データ:', data);
            console.log('動画データの詳細:', {
              total_videos: data.total_videos,
              videos_by_club_keys: Object.keys(data.videos_by_club),
              recent_videos_count: data.recent_videos?.length || 0
            });
            
            // クラブ別にグループ化された動画をフラット化
            const allVideos: VideoItem[] = [];
            Object.values(data.videos_by_club).forEach((clubVideos: any) => {
              console.log('クラブ別動画:', clubVideos);
              allVideos.push(...clubVideos);
            });
            
            // サムネイルURLの検証とクリーンアップ
            const validatedVideos = allVideos.map(video => {
              // デバッグ情報を追加
              console.log('動画データ検証中:', {
                video_id: video.video_id,
                thumbnail_url: video.thumbnail_url,
                thumbnail_url_type: typeof video.thumbnail_url,
                club_type: video.club_type,
                swing_form: video.swing_form
              });

              // サムネイルURLの検証
              let validThumbnailUrl = null;
              if (video.thumbnail_url && typeof video.thumbnail_url === 'string') {
                try {
                  const url = new URL(video.thumbnail_url);
                  // より緩やかな検証条件
                  if (url.protocol === 'https:' &&
                      url.hostname.includes('blob.core.windows.net') &&
                      url.pathname.includes('.jpg') &&
                      video.thumbnail_url.length > 20) {
                    validThumbnailUrl = video.thumbnail_url;
                    console.log('✅ 有効なサムネイルURL:', video.thumbnail_url);
                  } else {
                    console.warn('⚠️ サムネイルURL検証失敗:', {
                      url: video.thumbnail_url,
                      protocol: url.protocol,
                      hostname: url.hostname,
                      pathname: url.pathname,
                      length: video.thumbnail_url.length
                    });
                  }
                } catch (urlError) {
                  console.warn('❌ サムネイルURL解析エラー:', {
                    url: video.thumbnail_url,
                    error: urlError instanceof Error ? urlError.message : String(urlError)
                  });
                }
              } else {
                console.warn('⚠️ サムネイルURLが不正:', {
                  thumbnail_url: video.thumbnail_url,
                  type: typeof video.thumbnail_url
                });
              }

              return {
                ...video,
                thumbnail_url: validThumbnailUrl
              };
            });

            console.log('検証済み動画データ:', validatedVideos);
            console.log('各動画のサムネイルURL:', validatedVideos.map(v => v.thumbnail_url));

            setVideos(validatedVideos);
          } else {
            console.error('動画取得失敗:', response.status, response.statusText);
            
            // エラーの詳細を取得
            try {
              const errorData = await response.json();
              console.error('エラー詳細:', errorData);
              
              if (response.status === 422) {
                // バリデーションエラーの詳細を表示
                let errorMessage = `動画の取得に失敗しました: バリデーションエラー (${response.status})`;
                
                if (errorData.details && errorData.details.detail) {
                  console.log('バリデーションエラー詳細:', errorData.details.detail);
                  
                  if (Array.isArray(errorData.details.detail)) {
                    const validationErrors = errorData.details.detail.map((err: any) => {
                      if (err.loc && err.msg) {
                        return `${err.loc.join('.')}: ${err.msg}`;
                      } else if (err.msg) {
                        return err.msg;
                      }
                      return JSON.stringify(err);
                    }).join(', ');
                    
                    errorMessage += ` - ${validationErrors}`;
                  } else {
                    errorMessage += ` - ${JSON.stringify(errorData.details.detail)}`;
                  }
                }
                
                setError(errorMessage);
              } else {
                setError(`動画の取得に失敗しました: ${errorData.error || '不明なエラー'} (${response.status})`);
              }
            } catch (parseError) {
              setError(`動画の取得に失敗しました (${response.status})`);
            }
          }
        } catch (error) {
          console.error('動画取得エラー:', error);
          setError('動画の取得中にエラーが発生しました');
        }
      }
      
      setLoading(false);
    };

    checkAuthAndFetchVideos();
  }, [router]);

  // 検索クエリに基づいて動画をフィルタリング
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;
    
    return videos.filter(video => {
      const clubType = video.club_type?.toLowerCase() || '';
      const swingForm = video.swing_form?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();
      
      return clubType.includes(query) || swingForm.includes(query);
    });
  }, [videos, searchQuery]);

  // クラブ別に動画をグループ化
  const groupedVideos = useMemo(() => {
    const groups = {
      driverWood: [] as VideoItem[],
      ironUtilWedge: [] as VideoItem[],
      putter: [] as VideoItem[]
    };

    filteredVideos.forEach(video => {
      // club_typeがnullやundefinedの場合はスキップ
      if (!video.club_type) {
        console.warn('club_typeが設定されていない動画をスキップ:', video.video_id);
        return;
      }

      const clubType = video.club_type.toLowerCase();
      
      if (['driver', 'wood'].includes(clubType)) {
        groups.driverWood.push(video);
      } else if (['iron', 'utility', 'wedge'].includes(clubType)) {
        groups.ironUtilWedge.push(video);
      } else if (clubType === 'putter') {
        groups.putter.push(video);
      } else {
        // その他のクラブタイプはdriverWoodに分類（デフォルト）
        console.log('未分類のクラブタイプ:', clubType, 'をdriverWoodに分類');
        groups.driverWood.push(video);
      }
    });

    return groups;
  }, [filteredVideos]);

  // お気に入り切り替え
  const toggleFavorite = (videoId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(videoId)) {
        newFavorites.delete(videoId);
      } else {
        newFavorites.add(videoId);
      }
      return newFavorites;
    });
  };

  // 動画カードコンポーネント
  const VideoCard: React.FC<{ item: VideoItem }> = ({ item }) => {
    const router = useRouter();

    const handleVideoClick = () => {
      console.log('動画カードがクリックされました:', item.video_id);
      // 動画詳細ページに遷移（正しいパスに修正）
      router.push(`/user/video/${item.video_id}`);
    };

    return (
      <div 
        className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden video-card-hover cursor-pointer hover:bg-white/20 transition-all duration-200 hover:scale-105"
        onClick={handleVideoClick}
      >
        <div className="relative">
          {item.thumbnail_url ? (
            <img
              src={item.thumbnail_url}
              alt="Video thumbnail"
              className="w-full h-24 sm:h-28 md:h-32 lg:h-36 object-cover"
              onError={(e) => {
                console.error('サムネイル読み込みエラー:', item.thumbnail_url);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-24 sm:h-28 md:h-32 lg:h-36 bg-white/20 flex items-center justify-center">
              <Play className="text-white/50" size={24} />
            </div>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation(); // 親要素のクリックイベントを防ぐ
              toggleFavorite(item.video_id);
            }}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          >
            <Heart
              className={`${favorites.has(item.video_id) ? 'text-red-500 fill-current' : 'text-white'}`}
              size={16}
            />
          </button>
        </div>
        
        <div className="p-2 sm:p-3 lg:p-4">
          <div className="text-white text-sm lg:text-base font-medium mb-2">
            {item.club_type || '未設定'}
          </div>
          
          {/* swing_formを個別のタグとして表示 */}
          <div className="flex flex-wrap gap-1 mb-2">
            {item.swing_form ? (
              item.swing_form.split(',').map((form, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/20 text-white text-xs lg:text-sm rounded-full"
                >
                  {form.trim()}
                </span>
              ))
            ) : (
              <span className="px-2 py-1 bg-white/20 text-white text-xs lg:text-sm rounded-full">
                未設定
              </span>
            )}
          </div>
          
          <div className="text-white/70 text-xs lg:text-sm">
            {new Date(item.upload_date).toLocaleDateString('ja-JP')}
          </div>
        </div>
      </div>
    );
  };

  // ピンドリルカード
  const PinDrillCard = () => (
    <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl p-4 lg:p-6 text-white">
      <h3 className="text-lg lg:text-xl font-semibold mb-2">ピンドリル</h3>
      <p className="text-sm lg:text-base opacity-90 mb-3">今日の練習メニューを確認しましょう</p>
      <button className="bg-white/20 hover:bg-white/30 px-4 py-2 lg:px-6 lg:py-3 rounded-lg text-sm lg:text-base transition-colors">
        詳細を見る
      </button>
    </div>
  );

  // カテゴリセクション
  const CategorySection: React.FC<{ title: string; items: VideoItem[] }> = ({ title, items }) => (
    <div className="mb-8">
      <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-light mb-3" style={{ fontFamily: 'cursive' }}>
        {title}
      </h2>
      <div className="h-px bg-white/40 w-full mb-4"></div>
      {items.length > 0 ? (
        <div className="relative">
          {/* 横スクロールコンテナ - レスポンシブ対応 */}
          <div className="flex gap-3 lg:gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {items.map((item) => (
              <div key={item.video_id} className="flex-shrink-0 w-36 sm:w-40 md:w-44 lg:w-48 xl:w-52">
                <VideoCard item={item} />
              </div>
            ))}
          </div>

          {/* スクロールインジケーター */}
          {items.length > 3 && (
            <div className="flex justify-center mt-2">
              <div className="flex gap-1">
                {Array.from({ length: Math.ceil(items.length / 3) }, (_, i) => (
                  <div key={i} className="w-2 h-2 bg-white/30 rounded-full scroll-indicator"></div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-white/70 text-sm lg:text-base">該当する動画がありません</div>
      )}
    </div>
  );

  return (
    <UserHomeLayout
      searchQuery={searchQuery}
      onSearchChange={(e) => setSearchQuery(e.target.value)}
      profileImageUrl="https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100"
    >
      {/* デバッグ情報 - クライアントサイドのみ */}
      <ClientOnlyDebugInfo />
      
      {/* ローディング状態 */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-white text-base sm:text-lg lg:text-xl">動画を読み込み中...</span>
        </div>
      )}
      
      {/* エラー表示 */}
      {error && !loading && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 lg:p-6 text-center">
          <div className="text-red-400 text-sm lg:text-base mb-2">エラーが発生しました</div>
          <div className="text-red-300 text-xs lg:text-sm mb-3">{error}</div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 lg:px-6 lg:py-3 bg-red-500 text-white rounded-lg text-sm lg:text-base hover:bg-red-600 transition-colors"
            >
              再読み込み
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 lg:px-6 lg:py-3 bg-gray-600 text-white rounded-lg text-sm lg:text-base hover:bg-gray-700 transition-colors"
            >
              データリセット
            </button>
          </div>
        </div>
      )}

      {/* 動画コンテンツ */}
      {!loading && !error && (
        <>
          <PinDrillCard />
          <CategorySection title="Driver / Wood" items={groupedVideos.driverWood} />
          <CategorySection title="Iron / Utility / Wedge" items={groupedVideos.ironUtilWedge} />
          <CategorySection title="Putter" items={groupedVideos.putter} />
        </>
      )}

      {/* Bottom Tabs - レスポンシブ対応 */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[430px] lg:max-w-6xl xl:max-w-7xl bg-black/60 backdrop-blur-sm border-t border-white/10 z-50">
        <div className="flex justify-around py-3 lg:py-4">
          <button onClick={() => router.push('/user/home')} className="flex flex-col items-center space-y-1 text-violet-400">
            <HomeIcon size={20} className="lg:w-6 lg:h-6" />
            <span className="text-xs lg:text-sm">ホーム</span>
          </button>
          <button onClick={() => router.push('/user/request')} className="flex flex-col items-center space-y-1 text-white/70 hover:text-white">
            <FileTextIcon size={20} className="lg:w-6 lg:h-6" />
            <span className="text-xs lg:text-sm">添削依頼</span>
          </button>
          <button onClick={() => router.push('/user/mypage')} className="flex flex-col items-center space-y-1 text-white/70 hover:text-white">
            <UserIcon size={20} className="lg:w-6 lg:h-6" />
            <span className="text-xs lg:text-sm">マイページ</span>
          </button>
          <button onClick={() => router.push('/user/settings')} className="flex flex-col items-center space-y-1 text-white/70 hover:text-white">
            <Cog size={20} className="lg:w-6 lg:h-6" />
            <span className="text-xs lg:text-sm">設定</span>
          </button>
        </div>
      </nav>
    </UserHomeLayout>
  );
}
