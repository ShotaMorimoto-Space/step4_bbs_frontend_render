'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CoachLayout } from '../../../../src/components/CoachLayout';
import { CoachButton } from '../../../../src/components/CoachCommonLayout';
import { CheckCircle, Mail, User, Star, ArrowRight, Home, Settings } from 'lucide-react';

export default function CoachSignupCompletePage() {
  const router = useRouter();

  // ホーム画面に遷移
  const handleGoHome = () => {
    router.push('/coach/home');
  };

  // 設定画面に遷移
  const handleGoSettings = () => {
    router.push('/coach/settings');
  };

  // ログイン画面に遷移
  const handleGoLogin = () => {
    router.push('/coach/login');
  };

  return (
    <CoachLayout
      title="Welcome Coach!"
      subtitle="コーチアカウントの登録が完了しました"
    >
      <div className="text-center space-y-8">
        {/* 成功アイコン */}
        <div className="relative">
          <CheckCircle size={80} className="mx-auto text-green-400" />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <Star size={16} className="text-white" />
          </div>
        </div>

        {/* メインメッセージ */}
        <div className="space-y-4">
          <h2 className="text-white text-2xl font-bold">おめでとうございます！</h2>
          <p className="text-white/80 text-lg leading-relaxed">
            コーチアカウントの登録が完了しました。<br />
            これで、ゴルファーへの指導を開始できます。
          </p>
        </div>

        {/* 次のステップ */}
        <div className="bg-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-white text-lg font-medium">次のステップ</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                1
              </div>
              <div>
                <p className="text-white font-medium">メール確認</p>
                <p className="text-white/60 text-sm">登録したメールアドレスに確認メールが送信されます</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                2
              </div>
              <div>
                <p className="text-white font-medium">プロフィール完成</p>
                <p className="text-white/60 text-sm">設定画面から詳細情報を追加して、プロフィールを充実させましょう</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                3
              </div>
              <div>
                <p className="text-white font-medium">レッスン開始</p>
                <p className="text-white/60 text-sm">生徒からのレッスンリクエストをお待ちしています</p>
              </div>
            </div>
          </div>
        </div>

        {/* 重要な注意事項 */}
        <div className="bg-orange-500/20 border border-orange-500/30 rounded-2xl p-6 space-y-3">
          <h3 className="text-white text-lg font-medium flex items-center gap-2">
            <Mail size={20} className="text-orange-400" />
            重要な注意事項
          </h3>
          <div className="text-left space-y-2 text-sm">
            <p className="text-white/80">
              • 登録したメールアドレスに確認メールが送信されます
            </p>
            <p className="text-white/80">
              • メール内のリンクをクリックしてアカウントを有効化してください
            </p>
            <p className="text-white/80">
              • アカウントの審査には通常1-2営業日かかります
            </p>
            <p className="text-white/80">
              • 審査完了後、レッスンの受注が可能になります
            </p>
          </div>
        </div>

        {/* プロフィール充実の案内 */}
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-6 space-y-3">
          <h3 className="text-white text-lg font-medium flex items-center gap-2">
            <Settings size={20} className="text-blue-400" />
            プロフィールを充実させましょう
          </h3>
          <div className="text-left space-y-2 text-sm">
            <p className="text-white/80">
              • レッスン料金や可能時間の設定
            </p>
            <p className="text-white/80">
              • 得意分野やレッスンタイプの詳細設定
            </p>
            <p className="text-white/80">
              • プロフィール画像や自己紹介動画のアップロード
            </p>
            <p className="text-white/80">
              • 認定証や資格書類の追加
            </p>
            <p className="text-white/80">
              • これらの情報は設定画面から後から追加できます
            </p>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="space-y-4">
          <CoachButton
            onClick={handleGoHome}
            className="w-full"
          >
            <Home size={20} />
            コーチホームへ
          </CoachButton>
          
          <CoachButton
            variant="secondary"
            onClick={handleGoSettings}
            className="w-full"
          >
            <Settings size={20} />
            プロフィール設定
          </CoachButton>
          
          <div className="pt-4 border-t border-white/20">
            <p className="text-white/60 text-sm mb-3">すでにアカウントをお持ちですか？</p>
            <button
              onClick={handleGoLogin}
              className="text-orange-400 hover:text-orange-300 text-sm font-medium flex items-center gap-2 mx-auto hover:underline"
            >
              ログイン画面へ
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* サポート情報 */}
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-white/60 text-sm">
            ご不明な点がございましたら、
            <a href="/support" className="text-orange-400 hover:text-orange-300 underline">
              サポートセンター
            </a>
            までお気軽にお問い合わせください。
          </p>
        </div>
      </div>
    </CoachLayout>
  );
}
