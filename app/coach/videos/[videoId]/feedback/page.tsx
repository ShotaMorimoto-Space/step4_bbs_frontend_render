'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CoachLayout } from '../../../../src/components/CoachLayout';
import { CoachButton, CoachInput, CoachTextarea, CoachSelect } from '../../../../src/components/CoachCommonLayout';
import CustomVideoSlider from '../../../../src/components/CustomVideoSlider';
import { 
  ArrowLeft,
  Video,
  MessageSquare,
  Save,
  Send,
  Star,
  Target,
  Award
} from 'lucide-react';

// フィードバックの型定義
type Feedback = {
  overall_feedback: string;
  overall_feedback_summary: string;
  next_training_menu: string;
  next_training_menu_summary: string;
  swing_sections: {
    [key: string]: {
      feedback: string;
      rating: number;
      captured_image?: string;
      markup_image?: string;
      start_sec?: number;
      end_sec?: number;
      selected?: boolean;
    };
  };
};

// キャプチャされたセクションの型定義
type CapturedSection = {
  key: string;
  label: string;
  captured_image: string;
  markup_image?: string;
  start_sec: number;
  end_sec: number;
  feedback: string;
  rating: number;
};

// スイングセクションの定義
const SWING_SECTIONS = [
  { key: 'address', label: 'アドレス', description: '構えの姿勢とボールの位置' },
  { key: 'takeback', label: 'テイクバック', description: 'バックスイングの開始部分' },
  { key: 'halfway_back', label: 'ハーフウェイバック', description: 'バックスイングの中間点' },
  { key: 'top', label: 'トップ', description: 'バックスイングの最高点' },
  { key: 'downswing', label: 'ダウンスイング', description: 'フォワードスイングの開始' },
  { key: 'impact', label: 'インパクト', description: 'ボールとの接触点' },
  { key: 'follow_through', label: 'フォロースルー', description: 'インパクト後の振り抜き' },
  { key: 'finish', label: 'フィニッシュ', description: 'スイングの完了姿勢' }
];

export default function CoachFeedbackPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.videoId as string;
  
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [capturedSections, setCapturedSections] = useState<CapturedSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>({
    overall_feedback: '',
    overall_feedback_summary: '',
    next_training_menu: '',
    next_training_menu_summary: '',
    swing_sections: {}
  });

  // 動画情報の取得
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('認証トークンがありません');
          setLoading(false);
          return;
        }

        // バックエンドAPIから動画データを取得
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';
        const response = await fetch(`${apiUrl}/video/${videoId}/with-sections`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('動画取得APIエラー:', response.status, errorData);
          throw new Error(`動画取得に失敗しました: ${response.status}`);
        }

        const videoData = await response.json();
        console.log('バックエンドから取得した動画データ:', videoData);
        
        // バックエンドのレスポンス形式に合わせて変換
        const transformedVideo = {
          video_id: videoData.video_id,
          user_name: videoData.user?.username || 'Unknown User',
          club_type: videoData.club_type || 'Unknown Club',
          swing_form: videoData.swing_form || '未設定',
          swing_note: videoData.swing_note || '',
          video_url: videoData.video_url,
          thumbnail_url: videoData.thumbnail_url,
          user_profile: {
            golf_score_ave: videoData.user?.golf_score_ave || '未設定',
            golf_exp: videoData.user?.golf_exp || '未設定',
            sport_exp: videoData.user?.sport_exp || '未設定'
          },
          user_email: videoData.user?.email || 'unknown@example.com'
        };

        setVideo(transformedVideo);
        
        // 初期化
        const initialSections: { [key: string]: { feedback: string; rating: number } } = {};
        SWING_SECTIONS.forEach(section => {
          initialSections[section.key] = { feedback: '', rating: 5 };
        });
        
        setFeedback(prev => ({
          ...prev,
          swing_sections: initialSections
        }));
        
      } catch (err) {
        console.error('動画取得エラー:', err);
        // エラー時はモックデータを使用
        const fallbackVideo = {
          video_id: videoId,
          user_name: 'エラー: データ取得失敗',
          club_type: 'Unknown',
          swing_form: '未設定',
          video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbnail_url: 'https://picsum.photos/400/300?random=1'
        };
        setVideo(fallbackVideo);
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  // フィードバックの更新
  const updateFeedback = (field: keyof Feedback, value: string) => {
    setFeedback(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // セクション選択
  const selectSection = (sectionKey: string) => {
    setSelectedSection(sectionKey);
    setFeedback(prev => ({
      ...prev,
      swing_sections: {
        ...prev.swing_sections,
        [sectionKey]: {
          ...prev.swing_sections[sectionKey],
          selected: true
        }
      }
    }));
  };

  // フレームキャプチャ（バックエンドでの処理）
  const captureFrame = async (sectionKey: string) => {
    try {
      const videoElement = document.getElementById('feedback-video') as HTMLVideoElement;
      if (!videoElement) {
        alert('動画が見つかりません');
        return;
      }

      const currentTime = videoElement.currentTime;
      
      // バックエンドにキャプチャ画像をアップロード
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        alert('認証トークンがありません');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';
      
      // セクショングループを作成または取得
      const sectionGroupData = {
        video_id: videoId,
        session_id: null  // セッションIDは必須だが、ここではnull
      };
      
      console.log('セクショングループ作成リクエスト:', {
        url: `${apiUrl}/create-section-group/${videoId}`,
        data: sectionGroupData
      });
      
      const sectionGroupResponse = await fetch(`${apiUrl}/create-section-group/${videoId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sectionGroupData)
      });

      if (!sectionGroupResponse.ok) {
        const errorText = await sectionGroupResponse.text();
        console.error('セクショングループ作成エラー:', {
          status: sectionGroupResponse.status,
          statusText: sectionGroupResponse.statusText,
          error: errorText
        });
        throw new Error(`セクショングループの作成に失敗しました: ${sectionGroupResponse.status} - ${errorText}`);
      }

      const sectionGroup = await sectionGroupResponse.json();
      
      // セクションを追加
      const formData = new FormData();
      formData.append('start_sec', currentTime.toString());
      formData.append('end_sec', (currentTime + 1).toString());
      formData.append('coach_comment', '');  // 空のコメント
      
      const sectionResponse = await fetch(`${apiUrl}/add-section/${sectionGroup.section_group_id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });

      if (!sectionResponse.ok) {
        throw new Error('セクションの追加に失敗しました');
      }

      const section = await sectionResponse.json();

      // バックエンドでフレームキャプチャを実行
      const captureResponse = await fetch(`${apiUrl}/upload/capture-video-frame`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          video_url: video.video_url,
          section_id: section.section_id,
          timestamp: currentTime
        })
      });

      if (!captureResponse.ok) {
        throw new Error('フレームキャプチャに失敗しました');
      }

      const captureResult = await captureResponse.json();

      // キャプチャされたセクションを追加
      const newCapturedSection: CapturedSection = {
        key: sectionKey,
        label: SWING_SECTIONS.find(s => s.key === sectionKey)?.label || sectionKey,
        captured_image: captureResult.image_url,
        start_sec: currentTime,
        end_sec: currentTime + 1,
        feedback: '',
        rating: 5
      };

      setCapturedSections(prev => [...prev, newCapturedSection]);
      
      // フィードバック状態を更新
      setFeedback(prev => ({
        ...prev,
        swing_sections: {
          ...prev.swing_sections,
          [sectionKey]: {
            ...prev.swing_sections[sectionKey],
            captured_image: captureResult.image_url,
            start_sec: currentTime,
            end_sec: currentTime + 1,
            selected: false
          }
        }
      }));

      setSelectedSection(null);
      alert(`${newCapturedSection.label}のキャプチャが完了しました！`);

    } catch (error) {
      console.error('キャプチャエラー:', error);
      alert('キャプチャに失敗しました: ' + error);
    }
  };

  // セクションフィードバックの更新
  const updateSectionFeedback = (sectionKey: string, field: 'feedback' | 'rating', value: string | number) => {
    setFeedback(prev => ({
      ...prev,
      swing_sections: {
        ...prev.swing_sections,
        [sectionKey]: {
          ...prev.swing_sections[sectionKey],
          [field]: value
        }
      }
    }));
  };

  // フィードバックの保存
  const handleSave = async () => {
    try {
      setSaving(true);
      
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        alert('認証トークンがありません');
        return;
      }

      // バックエンドAPIにフィードバックを保存
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';
      
      // 全体的なフィードバックを保存
      const overallFeedbackResponse = await fetch(`${apiUrl}/coach/add-overall-feedback/${videoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          overall_feedback: feedback.overall_feedback,
          overall_feedback_summary: feedback.overall_feedback_summary,
          next_training_menu: feedback.next_training_menu,
          next_training_menu_summary: feedback.next_training_menu_summary
        })
      });
      
      if (!overallFeedbackResponse.ok) {
        const errorData = await overallFeedbackResponse.text();
        console.error('全体的フィードバック保存エラー:', overallFeedbackResponse.status, errorData);
        throw new Error(`全体的フィードバックの保存に失敗しました: ${overallFeedbackResponse.status}`);
      }
      
      console.log('フィードバック保存完了:', feedback);
      alert('フィードバックを保存しました');
      
    } catch (err) {
      console.error('保存エラー:', err);
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  // フィードバックの送信
  const handleSubmit = async () => {
    try {
      setSaving(true);
      
      // 実際のAPI呼び出し
      // const response = await fetch(`/api/coach/videos/${videoId}/feedback/submit`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localToken.getItem('access_token')}`
      //   },
      //   body: JSON.stringify(feedback)
      // });
      
      // モック送信
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('フィードバック送信:', feedback);
      alert('フィードバックを送信しました');
      
      // 動画一覧に戻る
      router.push('/coach/videos');
      
    } catch (err) {
      console.error('送信エラー:', err);
      alert('送信に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  // 時間表示の更新
  const updateTimeDisplay = () => {
    const videoElement = document.getElementById('feedback-video') as HTMLVideoElement;
    const timeDisplay = document.getElementById('time-display');
    if (videoElement && timeDisplay) {
      const currentTime = Math.floor(videoElement.currentTime);
      const duration = Math.floor(videoElement.duration);
      const currentMinutes = Math.floor(currentTime / 60);
      const currentSeconds = currentTime % 60;
      const durationMinutes = Math.floor(duration / 60);
      const durationSeconds = duration % 60;
      
      timeDisplay.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')} / ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
    }
  };

  // 評価の星表示
  const renderStars = (rating: number, onChange: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="text-2xl hover:scale-110 transition-transform"
          >
            {star <= rating ? (
              <Star className="text-yellow-400 fill-current" />
            ) : (
              <Star className="text-gray-400" />
            )}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <CoachLayout
        title="Loading..."
        subtitle="読み込み中..."
        showBackButton={true}
        onBackClick={() => router.push(`/coach/videos/${videoId}`)}
        backButtonText="動画詳細"
      >
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        </div>
      </CoachLayout>
    );
  }

  if (!video) {
    return (
      <CoachLayout
        title="エラー"
        subtitle="動画が見つかりません"
        showBackButton={true}
        onBackClick={() => router.push('/coach/videos')}
        backButtonText="動画一覧"
      >
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">動画の読み込みに失敗しました</p>
          <CoachButton onClick={() => router.push('/coach/videos')}>
            動画一覧に戻る
          </CoachButton>
        </div>
      </CoachLayout>
    );
  }

  return (
    <CoachLayout
      title="添削フィードバック"
      subtitle={`${video.user_name} さんの${video.club_type}動画`}
      showBackButton={true}
      onBackClick={() => router.push(`/coach/videos/${videoId}`)}
      backButtonText="動画詳細"
    >
      <div className="space-y-6">
        {/* 動画プレビューとマークアップ - 最初に配置 */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl">
          <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-3">
            <Video size={24} className="text-orange-400" />
            動画プレビューとマークアップ
          </h3>
          
          {/* 洗練された動画プレビュー */}
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl overflow-hidden mb-4 shadow-inner">
            <div className="w-full h-[75vh] sm:h-[80vh]">
              {video.video_url ? (
                <div className="relative w-full h-full">
                  <video
                    src={video.video_url}
                    className="w-full h-full object-contain"
                    poster={video.thumbnail_url || undefined}
                    id="feedback-video"
                    crossOrigin="anonymous"
                    onTimeUpdate={() => {
                      const videoElement = document.getElementById('feedback-video') as HTMLVideoElement;
                      if (videoElement) {
                        updateTimeDisplay();
                      }
                    }}
                    onLoadedMetadata={() => {
                      updateTimeDisplay();
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video size={64} className="text-white/40" />
                  <p className="text-white/60 ml-2">動画がありません</p>
                </div>
              )}
            </div>
          </div>
          
          {/* カスタムビデオスライダー */}
          <CustomVideoSlider
            currentTime={(() => {
              const videoElement = document.getElementById('feedback-video') as HTMLVideoElement;
              return videoElement ? videoElement.currentTime : 0;
            })()}
            duration={(() => {
              const videoElement = document.getElementById('feedback-video') as HTMLVideoElement;
              return videoElement ? videoElement.duration : 0;
            })()}
            onSeek={(time: number) => {
              const videoElement = document.getElementById('feedback-video') as HTMLVideoElement;
              if (videoElement) {
                videoElement.currentTime = time;
              }
            }}
            onPlayPause={() => {
              const videoElement = document.getElementById('feedback-video') as HTMLVideoElement;
              if (videoElement) {
                if (videoElement.paused) {
                  videoElement.play();
                } else {
                  videoElement.pause();
                }
              }
            }}
            isPlaying={(() => {
              const videoElement = document.getElementById('feedback-video') as HTMLVideoElement;
              return videoElement ? !videoElement.paused : false;
            })()}
            onSpeedChange={(speed: number) => {
              const videoElement = document.getElementById('feedback-video') as HTMLVideoElement;
              if (videoElement) {
                videoElement.playbackRate = speed;
              }
            }}
            playbackSpeed={1}
            onUndo={() => console.log('Undo')}
            onRedo={() => console.log('Redo')}
            onAddKeyframe={() => console.log('Add keyframe')}
            onConfirm={() => console.log('Confirm')}
          />

          {/* 横スクロール可能なセクション選択 */}
          <div className="overflow-x-auto">
            <div className="flex gap-2 min-w-max mb-4">
              {SWING_SECTIONS.map((section) => (
                <button
                  key={section.key}
                  onClick={() => selectSection(section.key)}
                  className={`px-4 py-2 text-white text-sm rounded-lg transition-all duration-200 whitespace-nowrap ${
                    feedback.swing_sections[section.key]?.selected
                      ? 'bg-orange-500 shadow-lg scale-105'
                      : feedback.swing_sections[section.key]?.captured_image
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {feedback.swing_sections[section.key]?.captured_image && (
                      <span className="text-green-400">✓</span>
                    )}
                    {section.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* キャプチャボタン */}
          <div className="mb-4">
            <button
              onClick={() => selectedSection && captureFrame(selectedSection)}
              disabled={!selectedSection}
              className={`px-6 py-3 text-white font-medium rounded-lg transition-all duration-200 ${
                selectedSection
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedSection 
                ? `${SWING_SECTIONS.find(s => s.key === selectedSection)?.label}をキャプチャ` 
                : 'セクションを選択してください'
              }
            </button>
          </div>
        </div>

        {/* 動画情報サマリー */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
          <h3 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
            <Video size={20} className="text-orange-400" />
            動画情報
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Video size={16} className="text-orange-400" />
              <span className="text-white/80 text-sm">ユーザー</span>
              <span className="text-white font-medium">{video.user_name}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Target size={16} className="text-orange-400" />
              <span className="text-white/80 text-sm">クラブ</span>
              <span className="bg-orange-500/20 px-2 py-1 rounded text-xs text-white">
                {video.club_type}
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

        {/* 全体的な評価 */}
        <div className="bg-white/10 rounded-xl p-4">
          <h3 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
            <Award size={20} className="text-orange-400" />
            全体的な評価
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">全体的なフィードバック</label>
              <CoachTextarea
                label="全体的なフィードバック"
                value={feedback.overall_feedback}
                onChange={(e) => updateFeedback('overall_feedback', e.target.value)}
                placeholder="スイング全体についての総合的な評価とアドバイスを記入してください..."
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm mb-2">フィードバック要約</label>
              <CoachInput
                label="フィードバック要約"
                value={feedback.overall_feedback_summary}
                onChange={(e) => updateFeedback('overall_feedback_summary', e.target.value)}
                placeholder="フィードバックの要点を簡潔に..."
              />
            </div>
          </div>
        </div>

        {/* キャプチャされたセクションのフィードバック */}
        {capturedSections.length > 0 && (
          <div className="bg-white/10 rounded-xl p-4">
            <h3 className="text-white text-lg font-medium mb-4">キャプチャされたセクションのフィードバック</h3>
            
            <div className="space-y-6">
              {capturedSections.map((section) => (
                <div key={section.key} className="border-b border-white/20 pb-4 last:border-b-0">
                  <div className="mb-3">
                    <h4 className="text-white font-medium mb-1">{section.label}</h4>
                    <p className="text-white/60 text-sm">
                      時間: {section.start_sec}s - {section.end_sec}s
                    </p>
                  </div>
                  
                  {/* キャプチャ画像表示 */}
                  <div className="mb-4">
                    <img 
                      src={section.captured_image} 
                      alt={`${section.label}のキャプチャ`}
                      className="w-full max-w-md rounded-lg border border-white/20"
                    />
                    
                    {/* マークアップ追加ボタン */}
                    <div className="mt-2">
                      <button
                        onClick={() => console.log(`${section.label}にマークアップを追加`)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-all duration-200"
                      >
                        マークアップ追加
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">評価</label>
                      {renderStars(
                        section.rating,
                        (rating) => {
                          setCapturedSections(prev => 
                            prev.map(s => 
                              s.key === section.key 
                                ? { ...s, rating } 
                                : s
                            )
                          );
                        }
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm mb-2">フィードバック</label>
                      <CoachTextarea
                        label="フィードバック"
                        value={section.feedback}
                        onChange={(e) => {
                          setCapturedSections(prev => 
                            prev.map(s => 
                              s.key === section.key 
                                ? { ...s, feedback: e.target.value } 
                                : s
                            )
                          );
                        }}
                        placeholder={`${section.label}についての具体的なアドバイスを記入してください...`}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 未キャプチャのセクション一覧 */}
        <div className="bg-white/10 rounded-xl p-4">
          <h3 className="text-white text-lg font-medium mb-4">未キャプチャのセクション</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {SWING_SECTIONS.filter(section => 
              !feedback.swing_sections[section.key]?.captured_image
            ).map((section) => (
              <div key={section.key} className="text-center">
                <button
                  onClick={() => selectSection(section.key)}
                  className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg transition-all duration-200"
                >
                  {section.label}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 次の練習メニュー */}
        <div className="bg-white/10 rounded-xl p-4">
          <h3 className="text-white text-lg font-medium mb-4">次の練習メニュー</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">練習メニュー</label>
              <CoachTextarea
                label="練習メニュー"
                value={feedback.next_training_menu}
                onChange={(e) => updateFeedback('next_training_menu', e.target.value)}
                placeholder="改善のための具体的な練習メニューを記入してください..."
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm mb-2">メニュー要約</label>
              <CoachInput
                label="メニュー要約"
                value={feedback.next_training_menu_summary}
                onChange={(e) => updateFeedback('next_training_menu_summary', e.target.value)}
                placeholder="練習メニューの要点を簡潔に..."
              />
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-4">
          <CoachButton
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-orange-500 hover:bg-orange-600"
          >
            <Save size={20} />
            {saving ? '保存中...' : '下書き保存'}
          </CoachButton>
          
          <CoachButton
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
          >
            <Send size={20} />
            {saving ? '送信中...' : 'フィードバック送信'}
          </CoachButton>
        </div>
      </div>
    </CoachLayout>
  );
}
