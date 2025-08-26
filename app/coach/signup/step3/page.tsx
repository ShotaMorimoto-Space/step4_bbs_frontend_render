'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CoachLayout } from '../../../../../../src/components/CoachLayout';
import { CoachButton, CoachTextarea } from '../../../../../../src/components/CoachCommonLayout';
import { Upload, X, Play, Image as ImageIcon, Video, FileText, Camera, Trash2 } from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  type: 'image' | 'video' | 'document';
  preview: string;
  name: string;
}

export default function CoachSignupStep3Page() {
  const router = useRouter();
  
  // フォームの状態
  const [formData, setFormData] = useState({
    profileImage: null as UploadedFile | null,
    introductionVideo: null as UploadedFile | null,
    certificates: [] as UploadedFile[],
    sampleVideos: [] as UploadedFile[],
    additionalNotes: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // ファイル入力の参照
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // ファイルアップロード処理
  const handleFileUpload = (files: FileList, type: 'image' | 'video' | 'document') => {
    Array.from(files).forEach(file => {
      const fileId = Math.random().toString(36).substr(2, 9);
      const preview = type === 'image' || type === 'video' 
        ? URL.createObjectURL(file) 
        : '';

      const uploadedFile: UploadedFile = {
        id: fileId,
        file,
        type,
        preview,
        name: file.name
      };

      if (type === 'image') {
        setFormData(prev => ({ ...prev, profileImage: uploadedFile }));
      } else if (type === 'video') {
        if (formData.introductionVideo) {
          setFormData(prev => ({ ...prev, introductionVideo: uploadedFile }));
        } else {
          setFormData(prev => ({ ...prev, introductionVideo: uploadedFile }));
        }
      } else {
        setFormData(prev => ({ ...prev, certificates: [...prev.certificates, uploadedFile] }));
      }
    });
  };

  // ファイル削除処理
  const handleFileDelete = (fileId: string, type: 'profileImage' | 'introductionVideo' | 'certificates' | 'sampleVideos') => {
    if (type === 'profileImage') {
      if (formData.profileImage) {
        URL.revokeObjectURL(formData.profileImage.preview);
        setFormData(prev => ({ ...prev, profileImage: null }));
      }
    } else if (type === 'introductionVideo') {
      if (formData.introductionVideo) {
        URL.revokeObjectURL(formData.introductionVideo.preview);
        setFormData(prev => ({ ...prev, introductionVideo: null }));
      }
    } else if (type === 'certificates') {
      const fileToDelete = formData.certificates.find(f => f.id === fileId);
      if (fileToDelete) {
        URL.revokeObjectURL(fileToDelete.preview);
        setFormData(prev => ({
          ...prev,
          certificates: prev.certificates.filter(f => f.id !== fileId)
        }));
      }
    }
  };

  // ドラッグ&ドロップ処理
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = e.dataTransfer.files;
      const file = files[0];
      
      if (file.type.startsWith('image/')) {
        handleFileUpload(files, 'image');
      } else if (file.type.startsWith('video/')) {
        handleFileUpload(files, 'video');
      } else {
        handleFileUpload(files, 'document');
      }
    }
  };

  // バリデーション
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.profileImage) {
      newErrors.profileImage = 'プロフィール画像は必須です';
    }

    if (!formData.introductionVideo) {
      newErrors.introductionVideo = '自己紹介動画は必須です';
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
      console.log('コーチ登録Step 3データ:', formData);
      
      // 成功時の処理
      router.push('/coach/signup/step4');
    } catch (error) {
      console.error('コーチ登録Step 3エラー:', error);
      setErrors({ submit: '登録に失敗しました。もう一度お試しください。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 前のステップに戻る
  const handleBack = () => {
    router.push('/coach/signup/step2');
  };

  // ファイルサイズのフォーマット
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <CoachLayout
      title="Media Upload"
      subtitle="プロフィール画像と動画をアップロードしましょう"
      showBackButton
      onBackClick={handleBack}
      backButtonText="戻る"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* プロフィール画像 */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium mb-3 flex items-center gap-2">
            <Camera size={20} className="text-orange-400" />
            プロフィール画像
          </h3>
          
          <div className="space-y-3">
            {formData.profileImage ? (
              <div className="relative">
                <img
                  src={formData.profileImage.preview}
                  alt="プロフィール画像"
                  className="w-32 h-32 object-cover rounded-xl mx-auto"
                />
                <button
                  type="button"
                  onClick={() => handleFileDelete(formData.profileImage!.id, 'profileImage')}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
                <div className="text-center mt-2">
                  <p className="text-white/80 text-sm">{formData.profileImage.name}</p>
                  <p className="text-white/60 text-xs">{formatFileSize(formData.profileImage.file.size)}</p>
                </div>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed border-white/30 rounded-xl p-8 text-center transition-colors ${
                  dragActive ? 'border-white/60 bg-white/10' : ''
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <ImageIcon size={48} className="mx-auto mb-4 text-white/60" />
                <p className="text-white/80 mb-2">プロフィール画像をアップロード</p>
                <p className="text-white/60 text-sm mb-4">JPG, PNG形式、最大5MB</p>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'image')}
                  className="hidden"
                />
                <CoachButton
                  type="button"
                  variant="secondary"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Upload size={20} />
                  画像を選択
                </CoachButton>
              </div>
            )}
            {errors.profileImage && (
              <p className="text-red-400 text-sm text-center">{errors.profileImage}</p>
            )}
          </div>
        </div>

        {/* 自己紹介動画 */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium mb-3 flex items-center gap-2">
            <Video size={20} className="text-orange-400" />
            自己紹介動画
          </h3>
          
          <div className="space-y-3">
            {formData.introductionVideo ? (
              <div className="relative">
                <video
                  src={formData.introductionVideo.preview}
                  controls
                  className="w-full max-w-md mx-auto rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => handleFileDelete(formData.introductionVideo!.id, 'introductionVideo')}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
                <div className="text-center mt-2">
                  <p className="text-white/80 text-sm">{formData.introductionVideo.name}</p>
                  <p className="text-white/60 text-xs">{formatFileSize(formData.introductionVideo.file.size)}</p>
                </div>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed border-white/30 rounded-xl p-8 text-center transition-colors ${
                  dragActive ? 'border-white/60 bg-white/10' : ''
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Video size={48} className="mx-auto mb-4 text-white/60" />
                <p className="text-white/80 mb-2">自己紹介動画をアップロード</p>
                <p className="text-white/60 text-sm mb-4">MP4, MOV形式、最大100MB</p>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'video')}
                  className="hidden"
                />
                <CoachButton
                  type="button"
                  variant="secondary"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <Upload size={20} />
                  動画を選択
                </CoachButton>
              </div>
            )}
            {errors.introductionVideo && (
              <p className="text-red-400 text-sm text-center">{errors.introductionVideo}</p>
            )}
          </div>
        </div>

        {/* 認定証・資格書類 */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium mb-3 flex items-center gap-2">
            <FileText size={20} className="text-orange-400" />
            認定証・資格書類（任意）
          </h3>
          
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'document')}
              className="hidden"
            />
            
            {formData.certificates.length > 0 ? (
              <div className="space-y-3">
                {formData.certificates.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-orange-400" />
                      <div>
                        <p className="text-white text-sm">{cert.name}</p>
                        <p className="text-white/60 text-xs">{formatFileSize(cert.file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFileDelete(cert.id, 'certificates')}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-white/60 text-sm mb-2">認定証や資格書類があればアップロードしてください</p>
                <CoachButton
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={20} />
                  書類を選択
                </CoachButton>
              </div>
            )}
          </div>
        </div>

        {/* その他のメモ */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium mb-3 flex items-center gap-2">
            <FileText size={20} className="text-orange-400" />
            その他のメモ
          </h3>
          
          <CoachTextarea
            label="追加の情報や特記事項"
            value={formData.additionalNotes}
            onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
            placeholder="アップロードしたファイルについての説明や、その他の特記事項があれば記入してください"
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
