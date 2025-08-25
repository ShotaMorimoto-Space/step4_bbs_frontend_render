'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CoachLayout } from '@/src/components/CoachLayout';
import { CoachButton, CoachInput, CoachTextarea, CoachSelect } from '@/src/components/CoachCommonLayout';
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
    };
  };
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
        
        // モックデータ
        const mockVideo = {
          video_id: videoId,
          user_name: '田中太郎',
          club_type: 'Driver',
          swing_form: 'スライス, ダフリ'
        };

        setVideo(mockVideo);
        
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
      
      // 実際のAPI呼び出し
      // const response = await fetch(`/api/coach/videos/${videoId}/feedback`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      //   },
      //   body: JSON.stringify(feedback)
      // });
      
      // モック保存
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('フィードバック保存:', feedback);
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
        {/* 動画情報サマリー */}
        <div className="bg-white/10 rounded-xl p-4">
          <h3 className="text-white text-lg font-medium mb-4">動画情報</h3>
          
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
                value={feedback.overall_feedback}
                onChange={(e) => updateFeedback('overall_feedback', e.target.value)}
                placeholder="スイング全体についての総合的な評価とアドバイスを記入してください..."
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm mb-2">フィードバック要約</label>
              <CoachInput
                value={feedback.overall_feedback_summary}
                onChange={(e) => updateFeedback('overall_feedback_summary', e.target.value)}
                placeholder="フィードバックの要点を簡潔に..."
              />
            </div>
          </div>
        </div>

        {/* スイングセクション別フィードバック */}
        <div className="bg-white/10 rounded-xl p-4">
          <h3 className="text-white text-lg font-medium mb-4">スイングセクション別フィードバック</h3>
          
          <div className="space-y-6">
            {SWING_SECTIONS.map((section) => (
              <div key={section.key} className="border-b border-white/20 pb-4 last:border-b-0">
                <div className="mb-3">
                  <h4 className="text-white font-medium mb-1">{section.label}</h4>
                  <p className="text-white/60 text-sm">{section.description}</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">評価</label>
                    {renderStars(
                      feedback.swing_sections[section.key]?.rating || 5,
                      (rating) => updateSectionFeedback(section.key, 'rating', rating)
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm mb-2">フィードバック</label>
                    <CoachTextarea
                      value={feedback.swing_sections[section.key]?.feedback || ''}
                      onChange={(e) => updateSectionFeedback(section.key, 'feedback', e.target.value)}
                      placeholder={`${section.label}についての具体的なアドバイスを記入してください...`}
                      rows={3}
                    />
                  </div>
                </div>
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
                value={feedback.next_training_menu}
                onChange={(e) => updateFeedback('next_training_menu', e.target.value)}
                placeholder="改善のための具体的な練習メニューを記入してください..."
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm mb-2">メニュー要約</label>
              <CoachInput
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
