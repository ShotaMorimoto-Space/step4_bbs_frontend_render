'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  Edit3, 
  Camera,
  Save,
  X,
  ArrowLeft
} from 'lucide-react';
import { SettingsLayout } from '../../../../src/components/SettingsLayout';
import { CommonButton } from '../../../../src/components/CommonLayout';

export default function UserSettingsPage() {
  const router = useRouter();
  
  // ユーザー情報の状態
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    avatar: '',
    phone: '',
    birthDate: '',
    gender: '',
    experience: '',
    bio: '',
    lineUserId: '',
    zipCode: '',
    state: '',
    address1: '',
    address2: '',
    sportExp: '',
    industry: '',
    jobTitle: '',
    position: ''
  });

  // 通知設定の状態
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    coachUpdates: true,
    newFeatures: false,
    marketing: false
  });

  // 編集モードの状態
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // バックエンドAPIのベースURL
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';

  // 選択肢の定数
  const SPORT_OPTIONS = [
    'サッカー', '野球', 'テニス', 'バスケットボール', 'バレーボール', '卓球', 'バドミントン',
    '陸上競技', '水泳', '柔道', '剣道', '空手', '弓道', 'アーチェリー',
    'スキー', 'スノーボード', 'スケート', 'フィギュアスケート',
    '体操', '新体操', 'ダンス', 'その他'
  ];

  const INDUSTRY_OPTIONS = [
    'IT・ソフトウェア', '金融・保険', '製造業', '建設業', '不動産',
    '小売・流通', '運輸・物流', '医療・福祉', '教育', '公務員',
    'メディア・広告', 'コンサルティング', '法律・会計', '飲食・宿泊',
    '美容・ファッション', 'エンターテイメント', 'その他'
  ];

  // 認証状態の確認
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      const email = localStorage.getItem('user_email');
      const userId = localStorage.getItem('user_id');
      
      console.log('設定画面認証チェック:', {
        token: token ? 'あり' : 'なし',
        email: email || 'なし',
        userId: userId || 'なし'
      });
      
      if (!token || !email) {
        console.log('基本的な認証情報不足のためログインページに遷移');
        router.push('/auth/login');
        return;
      }
      
      // userIdが不足している場合は、APIから取得を試行
      if (!userId) {
        console.log('user_idが不足、APIから取得を試行');
        try {
          // Next.jsのプロキシ経由でAPI呼び出し
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            console.log('/api/auth/meレスポンス詳細:', userData);
            
            // profileオブジェクトからuser_idを取得
            let fetchedUserId = null;
            if (userData.profile && userData.profile.user_id) {
              fetchedUserId = userData.profile.user_id;
            } else if (userData.user_id) {
              fetchedUserId = userData.user_id;
            } else if (userData.id) {
              fetchedUserId = userData.id;
            }
            
            if (fetchedUserId) {
              localStorage.setItem('user_id', fetchedUserId);
              console.log('APIから取得したuser_idを保存:', fetchedUserId);
            } else {
              console.warn('/api/auth/meレスポンスにuser_idが含まれていません:', userData);
            }
          } else {
            console.error('/auth/me取得失敗:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('user_id取得エラー:', error);
        }
      }

      // ユーザー情報をローカルストレージから取得
      setUserInfo(prev => ({
        ...prev,
        name: localStorage.getItem('user_name') || '',
        email: email,
        avatar: localStorage.getItem('user_avatar') || '',
        phone: localStorage.getItem('user_phone') || '',
        birthDate: localStorage.getItem('user_birth_date') || '',
        gender: localStorage.getItem('user_gender') || '',
        experience: localStorage.getItem('user_experience') || '',
        bio: localStorage.getItem('user_bio') || '',
        lineUserId: localStorage.getItem('user_line_user_id') || '',
        zipCode: localStorage.getItem('user_zip_code') || '',
        state: localStorage.getItem('user_state') || '',
        address1: localStorage.getItem('user_address1') || '',
        address2: localStorage.getItem('user_address2') || '',
        sportExp: localStorage.getItem('user_sport_exp') || '',
        industry: localStorage.getItem('user_industry') || '',
        jobTitle: localStorage.getItem('user_job_title') || '',
        position: localStorage.getItem('user_position') || ''
      }));

      // 通知設定をローカルストレージから取得
      const savedNotifications = localStorage.getItem('notification_settings');
      if (savedNotifications) {
        try {
          setNotificationSettings(JSON.parse(savedNotifications));
        } catch (error) {
          console.error('通知設定の読み込みに失敗しました:', error);
        }
      }
    };

    checkAuth();
  }, [router]);

  // 設定項目の定義
  const settingsItems = [
    {
      id: 'basic',
      title: '基本情報',
      icon: User,
      items: [
        { key: 'avatar', label: 'プロフィール画像', value: userInfo.avatar ? '設定済み' : '未設定', type: 'avatar', avatar: userInfo.avatar },
        { key: 'name', label: '名前', value: userInfo.name || '未設定' },
        { key: 'email', label: 'メールアドレス', value: userInfo.email, readonly: true },
        { key: 'birthDate', label: '生年月日', value: userInfo.birthDate || '未設定' },
        { key: 'gender', label: '性別', value: userInfo.gender === 'male' ? '男性' : userInfo.gender === 'female' ? '女性' : userInfo.gender === 'other' ? 'その他' : '未設定' }
      ]
    },
    {
      id: 'golf',
      title: 'ゴルフ関連',
      icon: User,
      items: [
        { key: 'experience', label: 'ゴルフ経験年数', value: userInfo.experience === 'beginner' ? '初心者（1年未満）' : userInfo.experience === 'intermediate' ? '中級者（1-5年）' : userInfo.experience === 'advanced' ? '上級者（5-10年）' : userInfo.experience === 'expert' ? 'エキスパート（10年以上）' : '未設定' }
      ]
    },
    {
      id: 'profile',
      title: 'プロフィール',
      icon: User,
      items: [
        { key: 'bio', label: 'プロフィール文', value: userInfo.bio || '未設定' },
        { key: 'lineUserId', label: 'LINEユーザーID', value: userInfo.lineUserId || '未設定' }
      ]
    },
    {
      id: 'address',
      title: '住所',
      icon: User,
      items: [
        { 
          key: 'address', 
          label: '住所', 
          value: userInfo.zipCode && userInfo.state && userInfo.address1 ? 
            `〒${userInfo.zipCode} ${userInfo.state} ${userInfo.address1}${userInfo.address2 ? ` ${userInfo.address2}` : ''}` : '未設定' 
        }
      ]
    },
    {
      id: 'career',
      title: '経歴・職歴',
      icon: User,
      items: [
        { key: 'sportExp', label: 'スポーツ経験', value: userInfo.sportExp || '未設定' },
        { key: 'industry', label: '業界', value: userInfo.industry || '未設定' },
        { key: 'jobTitle', label: '職種', value: userInfo.jobTitle || '未設定' },
        { key: 'position', label: '役職', value: userInfo.position || '未設定' }
      ]
    }
  ];

  // 通知設定更新
  const handleNotificationUpdate = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // ローカルストレージに保存
      localStorage.setItem('notification_settings', JSON.stringify(notificationSettings));
      
      setSuccessMessage('通知設定が更新されました');
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('通知設定の更新に失敗しました');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ログアウト
  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth/login');
  };

  // タブコンテンツ
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4">
            {settingsItems.map((category) => (
              <div key={category.id} className="bg-white/10 rounded-2xl p-4">
                <h3 className="text-white text-lg font-medium mb-3">{category.title}</h3>
                <div className="space-y-2">
                  {category.items.map((item) => (
                    <div
                      key={item.key}
                      onClick={() => {
                        if (item.readonly) return;
                        if (item.type === 'avatar') {
                          // アバター画像の場合は基本情報編集画面に遷移
                          router.push('/user/settings/basic');
                        } else {
                          router.push(`/user/settings/${category.id}`);
                        }
                      }}
                      className={`p-3 rounded-lg transition-colors ${
                        item.readonly 
                          ? 'bg-white/5 cursor-default' 
                          : 'bg-white/10 hover:bg-white/20 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {item.type === 'avatar' && (
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                              {item.avatar ? (
                                <img src={item.avatar} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                <User size={24} className="text-white/70" />
                              )}
                            </div>
                          )}
                          <div>
                            <div className="text-white/70 text-sm">{item.label}</div>
                            <div className="text-white font-medium">{item.value}</div>
                          </div>
                        </div>
                        {!item.readonly && (
                          <div className="text-white/50">
                            <Edit3 size={16} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            {/* 通知設定 */}
            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="text-white text-lg font-medium mb-4">通知設定</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">メール通知</div>
                    <div className="text-white/70 text-sm">重要な更新をメールで受け取る</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">プッシュ通知</div>
                    <div className="text-white/70 text-sm">アプリ内で通知を受け取る</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">コーチからの更新</div>
                    <div className="text-white/70 text-sm">コーチからのアドバイスや返信</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.coachUpdates}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, coachUpdates: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">新機能のお知らせ</div>
                    <div className="text-white/70 text-sm">アプリの新機能や改善について</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.newFeatures}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, newFeatures: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">マーケティング情報</div>
                    <div className="text-white/70 text-sm">特別なオファーやイベント情報</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.marketing}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, marketing: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              <button
                onClick={handleNotificationUpdate}
                disabled={isSubmitting}
                className="w-full mt-6 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? '保存中...' : '通知設定を保存'}
              </button>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="text-white text-lg font-medium mb-4">プライバシー設定</h3>
              <div className="space-y-4 text-white/70">
                <p>プライバシーポリシーの詳細については、お問い合わせください。</p>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-6">
            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="text-white text-lg font-medium mb-4">ヘルプ・サポート</h3>
              <div className="space-y-4 text-white/70">
                <p>お困りの際は、サポートチームまでお気軽にお問い合わせください。</p>
                <p>Email: support@example.com</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SettingsLayout
      title="設定"
      subtitle="アカウントの設定を管理"
      showBackButton={true}
      onBackClick={() => router.push('/user/home')}
    >
      {/* メッセージ表示 */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
          {errorMessage}
        </div>
      )}

      {/* タブナビゲーション */}
      <div className="flex bg-white/20 rounded-lg p-1 mb-6">
        {[
          { id: 'profile', label: 'プロフィール', icon: User },
          { id: 'notifications', label: '通知', icon: Bell },
          { id: 'privacy', label: 'プライバシー', icon: Shield },
          { id: 'help', label: 'ヘルプ', icon: HelpCircle }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center py-2 px-1 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-violet-600'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <tab.icon size={16} className="mb-1" />
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      {renderTabContent()}

      {/* デバッグ情報 */}
      <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 text-xs">
        <div className="font-bold mb-2">認証情報デバッグ:</div>
        <div>アクセストークン: {localStorage.getItem('access_token') ? 'あり' : 'なし'}</div>
        <div>ユーザーID: {localStorage.getItem('user_id') || 'なし'}</div>
        <div>メール: {localStorage.getItem('user_email') || 'なし'}</div>
        <div>ロール: {localStorage.getItem('user_role') || 'なし'}</div>
      </div>

      {/* ログアウトボタン */}
      <div className="mt-8">
        <CommonButton
          variant="danger"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          ログアウト
        </CommonButton>
      </div>
    </SettingsLayout>
  );
}
