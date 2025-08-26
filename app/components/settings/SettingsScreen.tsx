import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Edit3,
  Moon,
  Globe,
  HelpCircle,
  FileText,
  Shield,
  Star,
  ChevronRight,
  Bell,
  CreditCard,
  Heart,
  Video,
  Database
} from 'lucide-react';
import { useI18n } from '../../../src/i18n/I18nProvider';
import { applyTheme, initTheme, setBrightness, type Theme } from '../../../src/theme';

export type SettingsProps = {
  onNavigate: (screen: string) => void;
};

type Profile = {
  name: string;
  email: string;
  avatar: string;
};

export const SettingsScreen: React.FC<SettingsProps> = ({ onNavigate }) => {
  const { t, lang, setLang } = useI18n();
  
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const saved = localStorage.getItem('sb:profile');
      return saved ? JSON.parse(saved) : {
        name: 'Takahashi Koji',
        email: 'koji@gmail.com',
        avatar: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=200'
      };
    } catch {
      return {
        name: 'Takahashi Koji',
        email: 'koji@gmail.com',
        avatar: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=200'
      };
    }
  });

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('sb:theme') as Theme) || 'system';
  });

  const [brightness, setBrightnessState] = useState(() => {
    const saved = localStorage.getItem('sb:bgdim');
    return saved ? parseFloat(saved) : 0.15;
  });

  // Initialize theme on mount
  useEffect(() => {
    initTheme();
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleBrightnessChange = (value: number) => {
    setBrightnessState(value);
    setBrightness(value);
  };

  const handleItemPress = (item: string) => {
    switch (item) {
      case 'edit-profile':
        onNavigate('mypage');
        break;
      case 'notifications':
      case 'subscription':
      case 'favorites':
      case 'video-prefs':
      case 'data-storage':
      case 'help':
      case 'terms':
      case 'privacy':
      case 'about':
      case 'rate':
        // Placeholder for future implementation
        console.log(`${item} pressed`);
        break;
    }
  };

  const SettingItem: React.FC<{
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    iconBg: string;
  }> = ({ icon, title, subtitle, onPress, rightElement, iconBg }) => (
    <button
      onClick={onPress}
      className="w-full flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/15 transition-all duration-200 min-h-[56px]"
      aria-label={title}
    >
      <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h3 className="text-white font-medium text-base">{title}</h3>
        {subtitle && (
          <p className="text-white/70 text-sm">{subtitle}</p>
        )}
      </div>
      <div className="flex-shrink-0">
        {rightElement || <ChevronRight className="text-white/70" size={20} />}
      </div>
    </button>
  );

  const LanguageSegment: React.FC = () => (
    <div className="flex bg-white/10 rounded-full p-1">
      <button
        onClick={() => setLang('ja')}
        className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          lang === 'ja'
            ? 'bg-white text-purple-600 shadow-sm'
            : 'text-white/70 hover:text-white'
        }`}
      >
        {t('settings.language_ja')}
      </button>
      <button
        onClick={() => setLang('en')}
        className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          lang === 'en'
            ? 'bg-white text-purple-600 shadow-sm'
            : 'text-white/70 hover:text-white'
        }`}
      >
        {t('settings.language_en')}
      </button>
    </div>
  );

  const ThemeSegment: React.FC = () => (
    <div className="flex bg-white/10 rounded-full p-1">
      {(['light', 'dark', 'system'] as Theme[]).map((themeOption) => (
        <button
          key={themeOption}
          onClick={() => handleThemeChange(themeOption)}
          className={`flex-1 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
            theme === themeOption
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-white/70 hover:text-white'
          }`}
        >
          {t(`settings.theme_${themeOption}`)}
        </button>
      ))}
    </div>
  );

  const BrightnessSlider: React.FC = () => (
    <div className="flex items-center gap-3">
      <span className="text-white/70 text-sm">🌙</span>
      <input
        type="range"
        min="0"
        max="0.6"
        step="0.05"
        value={brightness}
        onChange={(e) => handleBrightnessChange(parseFloat(e.target.value))}
        className="flex-1 h-2 bg-white/20 rounded-full appearance-none slider"
        style={{
          background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${(brightness / 0.6) * 100}%, rgba(255,255,255,0.2) ${(brightness / 0.6) * 100}%, rgba(255,255,255,0.2) 100%)`
        }}
      />
      <span className="text-white/70 text-sm">☀️</span>
    </div>
  );

  return (
    <div className="max-w-[430px] mx-auto bg-gray-900 min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/bg.jpg)' }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-b from-gray-900/95 via-gray-800/90 to-gray-900/95"
          style={{ backgroundColor: `rgba(0,0,0,var(--bg-dim))` }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-100dvh h-100dvh pl-safe pr-safe">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-safe pt-4 pb-6">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label={t('settings.back')}
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          
          <h1 
            className="text-white text-2xl font-light"
            style={{ fontFamily: 'cursive' }}
          >
            {t('settings.profileTitle')}
          </h1>
          
          <div className="w-10" />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 pb-24">
          {/* Profile Section */}
          <div className="text-center mb-8">
            <div className="w-22 h-22 rounded-full overflow-hidden mx-auto mb-4 bg-white/10">
              <img
                src={profile.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-white text-xl font-bold mb-1">{profile.name}</h2>
            <p className="text-white/70 text-base">{profile.email}</p>
          </div>

          {/* Edit Profile */}
          <div className="mb-6">
            <SettingItem
              icon={<Edit3 className="text-white" size={20} />}
              title={t('settings.editProfile')}
              onPress={() => handleItemPress('edit-profile')}
              iconBg="bg-gradient-to-br from-purple-500 to-blue-500"
            />
          </div>

          {/* General Settings */}
          <div className="mb-6">
            <h3 className="text-white/90 text-lg font-medium mb-4">{t('settings.general')}</h3>
            
            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Globe className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-base">{t('settings.language')}</h3>
                  </div>
                </div>
                <LanguageSegment />
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                    <Moon className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-base">{t('settings.appearance')}</h3>
                  </div>
                </div>
                <ThemeSegment />
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                    <span className="text-white text-lg">💡</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-base">{t('settings.brightness')}</h3>
                  </div>
                </div>
                <BrightnessSlider />
              </div>
            </div>
          </div>

          {/* App Settings */}
          <div className="mb-6">
            <h3 className="text-white/90 text-lg font-medium mb-4">{t('settings.appSettings')}</h3>
            
            <div className="space-y-3">
              <SettingItem
                icon={<Bell className="text-white" size={20} />}
                title={t('settings.notifications')}
                onPress={() => onNavigate('settings-notifications')}
                iconBg="bg-gradient-to-br from-green-500 to-emerald-500"
              />

              <SettingItem
                icon={<CreditCard className="text-white" size={20} />}
                title={t('settings.subscription')}
                onPress={() => onNavigate('settings-plan')}
                iconBg="bg-gradient-to-br from-yellow-500 to-orange-500"
              />

              <SettingItem
                icon={<Heart className="text-white" size={20} />}
                title={t('settings.favoritesCoaches')}
                onPress={() => onNavigate('settings-favorites')}
                iconBg="bg-gradient-to-br from-red-500 to-pink-500"
              />

              <SettingItem
                icon={<Video className="text-white" size={20} />}
                title={t('settings.videoPrefs')}
                onPress={() => onNavigate('settings-upload')}
                iconBg="bg-gradient-to-br from-purple-500 to-violet-500"
              />

              <SettingItem
                icon={<Database className="text-white" size={20} />}
                title={t('settings.dataStorage')}
                onPress={() => onNavigate('settings-storage')}
                iconBg="bg-gradient-to-br from-gray-500 to-slate-500"
              />
            </div>
          </div>

          {/* Support */}
          <div className="mb-6">
            <h3 className="text-white/90 text-lg font-medium mb-4">{t('settings.support')}</h3>
            
            <div className="space-y-3">
              <SettingItem
                icon={<HelpCircle className="text-white" size={20} />}
                title={t('settings.help')}
                onPress={() => onNavigate('settings-help')}
                iconBg="bg-gradient-to-br from-blue-500 to-cyan-500"
              />

              <SettingItem
                icon={<FileText className="text-white" size={20} />}
                title={t('settings.terms')}
                onPress={() => onNavigate('settings-terms')}
                iconBg="bg-gradient-to-br from-purple-500 to-pink-500"
              />

              <SettingItem
                icon={<Shield className="text-white" size={20} />}
                title={t('settings.privacy')}
                onPress={() => onNavigate('settings-privacy')}
                iconBg="bg-gradient-to-br from-red-500 to-pink-500"
              />

              <SettingItem
                icon={<HelpCircle className="text-white" size={20} />}
                title={t('settings.about')}
                onPress={() => onNavigate('settings-appinfo')}
                iconBg="bg-gradient-to-br from-gray-500 to-gray-600"
              />

              <SettingItem
                icon={<Star className="text-white" size={20} />}
                title={t('settings.rate')}
                onPress={() => onNavigate('settings-rate')}
                iconBg="bg-gradient-to-br from-yellow-500 to-orange-500"
              />
            </div>
          </div>
        </main>

        {/* Bottom Tab Bar */}
        <div className="sticky bottom-0 bg-black/60 backdrop-blur-sm border-t border-white/10 rounded-t-3xl">
          <div className="flex justify-around py-3 pb-safe">
            <button
              onClick={() => onNavigate('home')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span className="text-xs">{t('tab.home')}</span>
            </button>
            <button
              onClick={() => onNavigate('request')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              <span className="text-xs">{t('tab.request')}</span>
            </button>
            <button
              onClick={() => onNavigate('mypage')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
              </svg>
              <span className="text-xs">{t('tab.mypage')}</span>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
              </svg>
              <span className="text-xs font-medium">{t('tab.settings')}</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};