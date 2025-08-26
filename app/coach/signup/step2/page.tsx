'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CoachLayout } from '../../../../src/components/CoachLayout';
import { CoachButton, CoachInput, CoachTextarea, CoachSelect } from '../../../../src/components/CoachCommonLayout';
import { DollarSign, Clock, MapPin, Star, Target, Users, Calendar } from 'lucide-react';

export default function CoachSignupStep2Page() {
  const router = useRouter();
  
  // フォームの状態
  const [formData, setFormData] = useState({
    hourlyRate: '',
    lessonDuration: '',
    maxStudents: '',
    availableDays: [] as string[],
    availableTimeStart: '',
    availableTimeEnd: '',
    specialties: [] as string[],
    teachingStyle: '',
    lessonTypes: [] as string[],
    facilities: [] as string[],
    additionalServices: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 入力フィールドの変更処理
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 配列フィールドの変更処理
  const handleArrayChange = (field: 'availableDays' | 'specialties' | 'lessonTypes' | 'facilities', value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  // バリデーション
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.hourlyRate.trim()) {
      newErrors.hourlyRate = '料金は必須です';
    } else if (isNaN(Number(formData.hourlyRate)) || Number(formData.hourlyRate) <= 0) {
      newErrors.hourlyRate = '有効な料金を入力してください';
    }

    if (!formData.lessonDuration) {
      newErrors.lessonDuration = 'レッスン時間は必須です';
    }

    if (!formData.maxStudents.trim()) {
      newErrors.maxStudents = '最大生徒数は必須です';
    } else if (isNaN(Number(formData.maxStudents)) || Number(formData.maxStudents) <= 0) {
      newErrors.maxStudents = '有効な生徒数を入力してください';
    }

    if (formData.availableDays.length === 0) {
      newErrors.availableDays = 'レッスン可能日は必須です';
    }

    if (!formData.availableTimeStart) {
      newErrors.availableTimeStart = '開始時間は必須です';
    }

    if (!formData.availableTimeEnd) {
      newErrors.availableTimeEnd = '終了時間は必須です';
    }

    if (formData.specialties.length === 0) {
      newErrors.specialties = '得意分野は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 実際のAPI呼び出しを実装
      console.log('コーチ登録Step 2データ:', formData);
      
      // 成功時の処理
      router.push('/coach/signup/step3');
    } catch (error) {
      console.error('コーチ登録Step 2エラー:', error);
      setErrors({ submit: '登録に失敗しました。もう一度お試しください。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 前のステップに戻る
  const handleBack = () => {
    router.push('/coach/signup');
  };

  // オプション設定
  const lessonDurationOptions = [
    { value: '30', label: '30分' },
    { value: '45', label: '45分' },
    { value: '60', label: '60分' },
    { value: '90', label: '90分' },
    { value: '120', label: '120分' }
  ];

  const dayOptions = [
    { value: 'monday', label: '月曜日' },
    { value: 'tuesday', label: '火曜日' },
    { value: 'wednesday', label: '水曜日' },
    { value: 'thursday', label: '木曜日' },
    { value: 'friday', label: '金曜日' },
    { value: 'saturday', label: '土曜日' },
    { value: 'sunday', label: '日曜日' }
  ];

  const timeOptions = [
    { value: '06:00', label: '6:00' },
    { value: '07:00', label: '7:00' },
    { value: '08:00', label: '8:00' },
    { value: '09:00', label: '9:00' },
    { value: '10:00', label: '10:00' },
    { value: '11:00', label: '11:00' },
    { value: '12:00', label: '12:00' },
    { value: '13:00', label: '13:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },
    { value: '16:00', label: '16:00' },
    { value: '17:00', label: '17:00' },
    { value: '18:00', label: '18:00' },
    { value: '19:00', label: '19:00' },
    { value: '20:00', label: '20:00' },
    { value: '21:00', label: '21:00' }
  ];

  const specialtyOptions = [
    { value: 'beginner', label: '初心者向け' },
    { value: 'intermediate', label: '中級者向け' },
    { value: 'advanced', label: '上級者向け' },
    { value: 'junior', label: 'ジュニア向け' },
    { value: 'senior', label: 'シニア向け' },
    { value: 'women', label: '女性向け' },
    { value: 'swing_fix', label: 'スイング矯正' },
    { value: 'putting', label: 'パッティング' },
    { value: 'short_game', label: 'ショートゲーム' },
    { value: 'course_management', label: 'コースマネジメント' }
  ];

  const lessonTypeOptions = [
    { value: 'individual', label: '個人レッスン' },
    { value: 'group', label: 'グループレッスン' },
    { value: 'online', label: 'オンラインレッスン' },
    { value: 'course_lesson', label: 'コースレッスン' },
    { value: 'video_analysis', label: '動画分析' }
  ];

  const facilityOptions = [
    { value: 'driving_range', label: 'ドライビングレンジ' },
    { value: 'golf_course', label: 'ゴルフコース' },
    { value: 'indoor_facility', label: '室内施設' },
    { value: 'putting_green', label: 'パッティンググリーン' },
    { value: 'bunker_practice', label: 'バンカー練習場' }
  ];

  return (
    <CoachLayout
      title="Lesson Details"
      subtitle="レッスンの詳細情報を設定しましょう"
      showBackButton
      onBackClick={handleBack}
      backButtonText="戻る"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 料金・レッスン設定 */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium mb-3 flex items-center gap-2">
            <DollarSign size={20} className="text-orange-400" />
            料金・レッスン設定
          </h3>
          
          <CoachInput
            label="1時間あたりの料金（円）"
            type="number"
            value={formData.hourlyRate}
            onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
            placeholder="5000"
            error={errors.hourlyRate}
            required
          />
          
          <CoachSelect
            label="標準レッスン時間"
            value={formData.lessonDuration}
            onChange={(e) => handleInputChange('lessonDuration', e.target.value)}
            options={lessonDurationOptions}
            placeholder="レッスン時間を選択"
            error={errors.lessonDuration}
            required
          />
          
          <CoachInput
            label="同時レッスン可能な最大生徒数"
            type="number"
            value={formData.maxStudents}
            onChange={(e) => handleInputChange('maxStudents', e.target.value)}
            placeholder="3"
            error={errors.maxStudents}
            required
          />
        </div>

        {/* レッスン可能時間 */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium mb-3 flex items-center gap-2">
            <Clock size={20} className="text-orange-400" />
            レッスン可能時間
          </h3>
          
          <div className="space-y-3">
            <label className="block text-white text-sm font-medium">
              レッスン可能日 <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {dayOptions.map((day) => (
                <label key={day.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={day.value}
                    checked={formData.availableDays.includes(day.value)}
                    onChange={(e) => handleArrayChange('availableDays', day.value, e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-white/20 border-white/30 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <span className="text-white text-sm">{day.label}</span>
                </label>
              ))}
            </div>
            {errors.availableDays && (
              <p className="text-red-400 text-sm">{errors.availableDays}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <CoachSelect
              label="開始時間"
              value={formData.availableTimeStart}
              onChange={(e) => handleInputChange('availableTimeStart', e.target.value)}
              options={timeOptions}
              placeholder="開始時間を選択"
              error={errors.availableTimeStart}
              required
            />
            
            <CoachSelect
              label="終了時間"
              value={formData.availableTimeEnd}
              onChange={(e) => handleInputChange('availableTimeEnd', e.target.value)}
              options={timeOptions}
              placeholder="終了時間を選択"
              error={errors.availableTimeEnd}
              required
            />
          </div>
        </div>

        {/* 得意分野・レッスンタイプ */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium mb-3 flex items-center gap-2">
            <Target size={20} className="text-orange-400" />
            得意分野・レッスンタイプ
          </h3>
          
          <div className="space-y-3">
            <label className="block text-white text-sm font-medium">
              得意分野 <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {specialtyOptions.map((specialty) => (
                <label key={specialty.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={specialty.value}
                    checked={formData.specialties.includes(specialty.value)}
                    onChange={(e) => handleArrayChange('specialties', specialty.value, e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-white/20 border-white/30 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <span className="text-white text-sm">{specialty.label}</span>
                </label>
              ))}
            </div>
            {errors.specialties && (
              <p className="text-red-400 text-sm">{errors.specialties}</p>
            )}
          </div>
          
          <div className="space-y-3">
            <label className="block text-white text-sm font-medium">
              レッスンタイプ
            </label>
            <div className="grid grid-cols-2 gap-3">
              {lessonTypeOptions.map((type) => (
                <label key={type.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={type.value}
                    checked={formData.lessonTypes.includes(type.value)}
                    onChange={(e) => handleArrayChange('lessonTypes', type.value, e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-white/20 border-white/30 rounded focus:ring-2"
                  />
                  <span className="text-white text-sm">{type.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 施設・その他 */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium mb-3 flex items-center gap-2">
            <MapPin size={20} className="text-orange-400" />
            施設・その他
          </h3>
          
          <div className="space-y-3">
            <label className="block text-white text-sm font-medium">
              利用可能施設
            </label>
            <div className="grid grid-cols-2 gap-3">
              {facilityOptions.map((facility) => (
                <label key={facility.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={facility.value}
                    checked={formData.facilities.includes(facility.value)}
                    onChange={(e) => handleArrayChange('facilities', facility.value, e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-white/20 border-white/30 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <span className="text-white text-sm">{facility.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <CoachTextarea
            label="その他のサービス・特記事項"
            value={formData.additionalServices}
            onChange={(e) => handleInputChange('additionalServices', e.target.value)}
            placeholder="特別なサービスや、生徒へのメッセージなどがあれば記入してください"
            rows={3}
          />
        </div>

        {/* エラーメッセージ */}
        {errors.submit && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm">
            {errors.submit}
          </div>
        )}

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
            {isSubmitting ? '送信中...' : '次へ進む'}
          </CoachButton>
        </div>
      </form>
    </CoachLayout>
  );
}
