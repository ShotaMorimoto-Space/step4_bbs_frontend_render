export type Lang = 'ja' | 'en';

export const dict = {
  ja: {
    tab: { home: 'ホーム', request: '添削依頼', mypage: 'マイページ', settings: '設定' },
    settings: {
      title: '設定',
      profileTitle: 'プロフィール',
      editProfile: 'プロフィールを編集',
      general: '基本設定',
      language: '言語',
      language_ja: '日本語',
      language_en: 'English',
      appearance: '表示モード',
      theme_light: 'ライト',
      theme_dark: 'ダーク',
      theme_system: '端末に合わせる',
      brightness: '背景の明るさ',
      appSettings: 'アプリ設定',
      notifications: '通知設定',
      subscription: 'プラン / チケット',
      favoritesCoaches: 'お気に入りコーチ',
      videoPrefs: '動画アップロード設定',
      dataStorage: 'データと保存容量',
      support: 'サポート',
      help: 'ヘルプ / お問い合わせ',
      terms: '利用規約',
      privacy: 'プライバシー',
      about: 'アプリ情報',
      rate: 'アプリを評価',
      back: '戻る',
    },
    mypage: { title: 'マイページ' },
    coach: {
      signup: {
        title: 'コーチ登録',
        step1: '基本情報',
        step2: '経験・料金',
        step3: 'SNS・プロフィール',
        step4: '拠点・対応',
        basic: {
          name: '氏名',
          name_kanji: '氏名（漢字）',
          name_kana: '氏名（フリガナ）',
          email: 'メールアドレス',
          phone: '電話番号',
          birthday: '生年月日',
          sex: '性別',
          line_id: 'LINE ID',
          male: '男性',
          female: '女性',
          other: 'その他'
        },
        career: {
          golf_exp: 'ゴルフ歴（年）',
          hourly_rate: '時給（円）',
          certification: '認定資格',
          lesson_rank: 'レッスンランク',
          bio: '自己紹介',
          rank_high: '上級',
          rank_low: '初級',
          lesson_level: 'レッスン対応レベル',
          levels: {
            beginner: '初心者',
            intermediate: '中級者',
            advanced: '上級者'
          },
          competitive: '競技者（大会出場者）対応可'
        },
        social: {
          profile_picture: 'プロフィール画像',
          instagram: 'Instagram',
          twitter: 'X (Twitter)',
          youtube: 'YouTube',
          facebook: 'Facebook',
          tiktok: 'TikTok'
        },
        location: {
          main_location: '主拠点',
          support_locations: '対応会場',
          online_support: 'オンラインレッスン対応',
          notes: '備考・条件'
        },
        submit: '応募を送信',
        submitting: '送信中...',
        success: 'コーチ申請を受け付けました',
        thankyou: 'ありがとうございます',
        review_message: '審査には1-3営業日かかります。結果はメールでご連絡します。'
      }
    },
    home: { title: 'ホーム' },
  },
  en: {
    tab: { home: 'Home', request: 'Request', mypage: 'My Page', settings: 'Settings' },
    settings: {
      title: 'Settings',
      profileTitle: 'Profile',
      editProfile: 'Edit Profile',
      general: 'General',
      language: 'Language',
      language_ja: 'Japanese',
      language_en: 'English',
      appearance: 'Appearance',
      theme_light: 'Light',
      theme_dark: 'Dark',
      theme_system: 'Use system',
      brightness: 'Background brightness',
      appSettings: 'App Settings',
      notifications: 'Notifications',
      subscription: 'Plan / Tickets',
      favoritesCoaches: 'Favorite Coaches',
      videoPrefs: 'Upload Preferences',
      dataStorage: 'Data & Storage',
      support: 'Support',
      help: 'Help / Contact',
      terms: 'Terms',
      privacy: 'Privacy',
      about: 'About',
      rate: 'Rate this app',
      back: 'Back',
    },
    mypage: { title: 'My Page' },
    coach: {
      signup: {
        title: 'Coach Registration',
        step1: 'Basic Info',
        step2: 'Experience & Rate',
        step3: 'Social & Profile',
        step4: 'Location & Support',
        basic: {
          name: 'Name',
          name_kanji: 'Name (Kanji)',
          name_kana: 'Name (Kana)',
          email: 'Email',
          phone: 'Phone',
          birthday: 'Birthday',
          sex: 'Gender',
          line_id: 'LINE ID',
          male: 'Male',
          female: 'Female',
          other: 'Other'
        },
        career: {
          golf_exp: 'Golf Experience (Years)',
          hourly_rate: 'Hourly Rate (¥)',
          certification: 'Certification',
          lesson_rank: 'Lesson Rank',
          bio: 'Bio',
          rank_high: 'Advanced',
          rank_low: 'Beginner',
          lesson_level: 'Lesson level you can coach',
          levels: {
            beginner: 'Beginner',
            intermediate: 'Intermediate',
            advanced: 'Advanced'
          },
          competitive: 'Can coach competitive players'
        },
        social: {
          profile_picture: 'Profile Picture',
          instagram: 'Instagram',
          twitter: 'X (Twitter)',
          youtube: 'YouTube',
          facebook: 'Facebook',
          tiktok: 'TikTok'
        },
        location: {
          main_location: 'Main Location',
          support_locations: 'Support Locations',
          online_support: 'Online Lesson Support',
          notes: 'Notes & Conditions'
        },
        submit: 'Submit Application',
        submitting: 'Submitting...',
        success: 'Coach application received',
        thankyou: 'Thank you',
        review_message: 'Review takes 1-3 business days. We will contact you by email.'
      }
    },
    home: { title: 'Home' },
  },
} as const;