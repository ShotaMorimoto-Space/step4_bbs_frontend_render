'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CoachLayout } from '../../src/components/CoachLayout';
import { CoachButton, CoachTextarea } from '../../src/components/CoachCommonLayout';
import { CheckCircle, Edit, User, DollarSign, Clock, MapPin, Target, Camera, Video, FileText } from 'lucide-react';

export default function CoachSignupStep4Page() {
  const router = useRouter();
  
  // フォームの状態（実際の実装では、前のステップからデータを受け取る）
  const [formData] = useState({
    // Step 1: 基本情報
    coachname: '山田 太郎',
    email: 'coach@example.com',
    phone: '090-1234-5678',
    location: '東京都渋谷区',
    certification: 'PGA認定プロ',
    experience: '11-15年',
    bio: 'ゴルフ指導歴15年のPGA認定プロです。初心者から上級者まで、一人ひとりのレベルに合わせた丁寧な指導を行っています。',
    
    // Step 2: レッスン詳細
    hourlyRate: '8000',
    lessonDuration: '60',
    maxStudents: '3',
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    availableTimeStart: '09:00',
    availableTimeEnd: '18:00',
    specialties: ['beginner', 'intermediate', 'swing_fix', 'putting'],
    lessonTypes: ['individual', 'group', 'course_lesson'],
    facilities: ['driving_range', 'golf_course', 'putting_green'],
    additionalServices: 'レッスン後のフォローアップメールと、月1回の進捗レポートを提供しています。',
    
    // Step 3: メディア
    profileImage: 'profile.jpg',
    introductionVideo: 'introduction.mp4',
    certificates: ['pga_cert.pdf', 'jpga_cert.pdf'],
    additionalNotes: 'プロフィール画像は最新のものを使用し、自己紹介動画では実際のレッスン風景も含めています。'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 前のステップに戻る
  const handleBack = () => {
    router.push('/coach/signup/step3');
  };

  // 編集画面に戻る
  const handleEdit = (step: number) => {
    switch (step) {
      case 1:
        router.push('/coach/signup');
        break;
      case 2:
        router.push('/coach/signup/step2');
        break;
      case 3:
        router.push('/coach/signup/step3');
        break;
    }
  };

  // 最終登録処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);

    try {
      // TODO: 実際のAPI呼び出しを実装
      console.log('コーチ登録最終データ:', formData);
      
      // 成功時の処理
      setShowSuccess(true);
      
      // 3秒後に完了画面に遷移
      setTimeout(() => {
        router.push('/coach/signup/complete');
      }, 3000);
      
    } catch (error) {
      console.error('コーチ登録エラー:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 日付の表示用
  const getDayLabels = (days: string[]) => {
    const dayLabels: { [key: string]: string } = {
      monday: '月',
      tuesday: '火',
      wednesday: '水',
      thursday: '木',
      friday: '金',
      saturday: '土',
      sunday: '日'
    };
    return days.map(day => dayLabels[day]).join('・');
  };

  // 得意分野の表示用
  const getSpecialtyLabels = (specialties: string[]) => {
    const specialtyLabels: { [key: string]: string } = {
      beginner: '初心者向け',
      intermediate: '中級者向け',
      advanced: '上級者向け',
      junior: 'ジュニア向け',
      senior: 'シニア向け',
      women: '女性向け',
      swing_fix: 'スイング矯正',
      putting: 'パッティング',
      short_game: 'ショートゲーム',
      course_management: 'コースマネジメント'
    };
    return specialties.map(specialty => specialtyLabels[specialty]).join('、');
  };

  // レッスンタイプの表示用
  const getLessonTypeLabels = (types: string[]) => {
    const typeLabels: { [key: string]: string } = {
      individual: '個人レッスン',
      group: 'グループレッスン',
      online: 'オンラインレッスン',
      course_lesson: 'コースレッスン',
      video_analysis: '動画分析'
    };
    return types.map(type => typeLabels[type]).join('、');
  };

  // 施設の表示用
  const getFacilityLabels = (facilities: string[]) => {
    const facilityLabels: { [key: string]: string } = {
      driving_range: 'ドライビングレンジ',
      golf_course: 'ゴルフコース',
      indoor_facility: '室内施設',
      putting_green: 'パッティンググリーン',
      bunker_practice: 'バンカー練習場'
    };
    return facilities.map(facility => facilityLabels[facility]).join('、');
  };

  if (showSuccess) {
    return (
      <CoachLayout
        title="Registration Complete!"
        subtitle="コーチ登録が完了しました！"
      >
        <div className="text-center space-y-6">
          <CheckCircle size={64} className="mx-auto text-green-400" />
          <div className="space-y-2">
            <h3 className="text-white text-xl font-medium">登録完了！</h3>
            <p className="text-white/80">
              コーチアカウントの登録が完了しました。<br />
              まもなく完了画面に遷移します...
            </p>
          </div>
        </div>
      </CoachLayout>
    );
  }

  return (
    <CoachLayout
      title="Confirm Details"
      subtitle="入力内容を確認して、最終登録を行いましょう"
      showBackButton
      onBackClick={handleBack}
      backButtonText="戻る"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: 基本情報 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-medium flex items-center gap-2">
              <User size={20} className="text-orange-400" />
              基本情報
            </h3>
            <button
              type="button"
              onClick={() => handleEdit(1)}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <Edit size={16} />
              編集
            </button>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60">コーチ名:</span>
                <span className="text-white ml-2">{formData.coachname}</span>
              </div>
              <div>
                <span className="text-white/60">メールアドレス:</span>
                <span className="text-white ml-2">{formData.email}</span>
              </div>
              <div>
                <span className="text-white/60">電話番号:</span>
                <span className="text-white ml-2">{formData.phone}</span>
              </div>
              <div>
                <span className="text-white/60">所在地:</span>
                <span className="text-white ml-2">{formData.location}</span>
              </div>
              <div>
                <span className="text-white/60">認定資格:</span>
                <span className="text-white ml-2">{formData.certification}</span>
              </div>
              <div>
                <span className="text-white/60">経験年数:</span>
                <span className="text-white ml-2">{formData.experience}</span>
              </div>
            </div>
            <div>
              <span className="text-white/60">自己紹介:</span>
              <p className="text-white mt-1 text-sm leading-relaxed">{formData.bio}</p>
            </div>
          </div>
        </div>

        {/* Step 2: レッスン詳細 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-medium flex items-center gap-2">
              <DollarSign size={20} className="text-orange-400" />
              レッスン詳細
            </h3>
            <button
              type="button"
              onClick={() => handleEdit(2)}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <Edit size={16} />
              編集
            </button>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60">料金:</span>
                <span className="text-white ml-2">¥{formData.hourlyRate}/時間</span>
              </div>
              <div>
                <span className="text-white/60">レッスン時間:</span>
                <span className="text-white ml-2">{formData.lessonDuration}分</span>
              </div>
              <div>
                <span className="text-white/60">最大生徒数:</span>
                <span className="text-white ml-2">{formData.maxStudents}名</span>
              </div>
              <div>
                <span className="text-white/60">レッスン可能日:</span>
                <span className="text-white ml-2">{getDayLabels(formData.availableDays)}</span>
              </div>
              <div>
                <span className="text-white/60">時間帯:</span>
                <span className="text-white ml-2">{formData.availableTimeStart} - {formData.availableTimeEnd}</span>
              </div>
            </div>
            <div>
              <span className="text-white/60">得意分野:</span>
              <p className="text-white mt-1 text-sm">{getSpecialtyLabels(formData.specialties)}</p>
            </div>
            <div>
              <span className="text-white/60">レッスンタイプ:</span>
              <p className="text-white mt-1 text-sm">{getLessonTypeLabels(formData.lessonTypes)}</p>
            </div>
            <div>
              <span className="text-white/60">利用可能施設:</span>
              <p className="text-white mt-1 text-sm">{getFacilityLabels(formData.facilities)}</p>
            </div>
            <div>
              <span className="text-white/60">その他のサービス:</span>
              <p className="text-white mt-1 text-sm leading-relaxed">{formData.additionalServices}</p>
            </div>
          </div>
        </div>

        {/* Step 3: メディア */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-medium flex items-center gap-2">
              <Camera size={20} className="text-orange-400" />
              メディア
            </h3>
            <button
              type="button"
              onClick={() => handleEdit(3)}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <Edit size={16} />
              編集
            </button>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60">プロフィール画像:</span>
                <span className="text-white ml-2">{formData.profileImage}</span>
              </div>
              <div>
                <span className="text-white/60">自己紹介動画:</span>
                <span className="text-white ml-2">{formData.introductionVideo}</span>
              </div>
            </div>
            <div>
              <span className="text-white/60">認定証・資格書類:</span>
              <p className="text-white mt-1 text-sm">{formData.certificates.join(', ')}</p>
            </div>
            <div>
              <span className="text-white/60">追加メモ:</span>
              <p className="text-white mt-1 text-sm leading-relaxed">{formData.additionalNotes}</p>
            </div>
          </div>
        </div>

        {/* 利用規約・プライバシーポリシー */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium mb-3">利用規約・プライバシーポリシー</h3>
          
          <div className="bg-white/5 rounded-xl p-4">
            <div className="space-y-3">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  required
                  className="w-5 h-5 text-orange-600 bg-white/20 border-white/30 rounded focus:ring-orange-500 focus:ring-2 mt-0.5"
                />
                <span className="text-white/80 text-sm leading-relaxed">
                  <a href="/terms" className="text-orange-400 hover:text-orange-300 underline">利用規約</a>
                  と
                  <a href="/privacy" className="text-orange-400 hover:text-orange-300 underline">プライバシーポリシー</a>
                  に同意します
                </span>
              </label>
              
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  required
                  className="w-5 h-5 text-orange-600 bg-white/20 border-white/30 rounded focus:ring-orange-500 focus:ring-2 mt-0.5"
                />
                <span className="text-white/80 text-sm leading-relaxed">
                  提供した情報が真実であることを確認し、虚偽の申告がないことを誓約します
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* ボタン */}
        <div className="flex gap-4 mt-8">
          <CoachButton
            type="button"
            variant="secondary"
            onClick={handleBack}
            className="flex-1"
          >
            戻る
          </CoachButton>
          
          <CoachButton
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? '登録中...' : '登録を完了する'}
          </CoachButton>
        </div>
      </form>
    </CoachLayout>
  );
}
