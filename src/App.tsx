/* === App.tsx 修正版（前半）=== */
import React, { useState, useEffect } from 'react';
import {
  Home as HomeIcon,
  User as UserIcon,
  Settings as SettingsIcon,
  FileText as FileTextIcon,
  ArrowLeft,
} from 'lucide-react';
import { OnboardingFrame } from './components/OnboardingFrame';
import { LogoBlock } from './components/LogoBlock';
import { GolferSilhouette } from './components/GolferSilhouette';
import { GolfBagSilhouette } from './components/GolfBagSilhouette';
import { CrouchingGolferSilhouette } from './components/CrouchingGolferSilhouette';
import { StepText } from './components/StepText';
import { Dots } from './components/Dots';
import { SignupName } from './screens/SignupName';
import { SignupBirth } from './screens/SignupBirth';
import { SignupGender } from './screens/SignupGender';
import { SignupMail } from './screens/SignupMail';
import { HomeScreen } from './screens/Home';
import { RequestScreen } from './screens/Request';
import { RequestClubScreen } from './screens/RequestClub';
import { RequestProblemScreen } from './screens/RequestProblem';
import { RequestDoneScreen } from './screens/RequestDone';
import { MyPageScreen } from './components/mypage/MyPageScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { NotificationsScreen } from './screens/settings/Notifications';
import { PlanScreen } from './screens/settings/Plan';
import { FavoritesScreen } from './screens/settings/Favorites';
import { UploadSettingsScreen } from './screens/settings/UploadSettings';
import { StorageScreen } from './screens/settings/Storage';
import { HelpScreen } from './screens/settings/Help';
import { TermsScreen } from './screens/settings/Terms';
import { PrivacyScreen } from './screens/settings/Privacy';
import { AppInfoScreen } from './screens/settings/AppInfo';
import { RateScreen } from './screens/settings/Rate';
import { CoachSignupMain } from './screens/CoachSignup/CoachSignupMain';
import { CoachSignupDone } from './screens/CoachSignup/CoachSignupDone';
import { CoachHome } from './screens/coach/CoachHome';
import { RequestDetail } from './screens/RequestDetail';
import { CoachJobsScreen } from './screens/coach/CoachJobsScreen';
import { CoachReviewScreen } from './screens/coach/CoachReviewScreen';
import { ReviewPlayerScreen } from './screens/review/ReviewPlayerScreen';
import { ReviewDetailScreen } from './screens/review/ReviewDetailScreen';
import { ReviewTimelineScreen } from './screens/review/ReviewTimelineScreen';
import { initAuth, setRole, setRoleCandidate, getHomeScreen, getAuth } from './state/auth';
import type { Review } from './types/review';

import { RequestConfirmScreen } from './screens/RequestConfirmScreen';

// ★ 追加：コーチ新フロー
import VideoDetail from './screens/videos/VideoDetail';
import AdviceNew from './screens/coach/AdviceNew';

// APIテスト用
import ApiTest from './components/ApiTest';

type Screen =
  | 'welcome' | 'signin' | 'signup' | 'signup-name' | 'signup-birth' | 'signup-gender' | 'signup-mail'
  | 'onboarding' | 'main' | 'home' | 'coach-home'
  | 'request' | 'request-club' | 'request-problem' | 'request-done' | 'request-detail' | 'request-confirm'
  | 'mypage' | 'settings' | 'settings-notifications' | 'settings-plan' | 'settings-favorites'
  | 'settings-upload' | 'settings-storage' | 'settings-help' | 'settings-terms' | 'settings-privacy'
  | 'settings-appinfo' | 'settings-rate' | 'coach-signup' | 'coach-signup-done'
  | 'review-player' | 'review-detail' | 'review-timeline' | 'coach-jobs' | 'coach-review'
  | 'video-detail' | 'coach-advice-new' | 'api-test';

const DEV_BYPASS = process.env.NODE_ENV !== 'production';

const COACH_ONLY: Screen[] = [
  'coach-home', 'coach-signup', 'coach-signup-done', 'coach-jobs', 'coach-review', 'request-detail',
  'video-detail', 'coach-advice-new',
];
const USER_ONLY: Screen[] = ['home', 'request', 'request-club', 'request-problem', 'request-done', 'mypage'];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [requestDetailId, setRequestDetailId] = useState<string>('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [coachReviewRequestId, setCoachReviewRequestId] = useState<string>('');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [nameData, setNameData] = useState({
    kanji: ['', ''] as [string, string],
    kana: ['', ''] as [string, string],
  });
  const [birthData, setBirthData] = useState({ year: '', month: '', day: '' });
  const [genderData, setGenderData] = useState<'male' | 'female' | ''>('');
  const [mailData, setMailData] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
// ★追加：依頼プレビュー用draft
const [requestDraft, setRequestDraft] = useState({
  videoThumb: '',
  club: '',
  problems: [] as string[],
  note: ''
});


  useEffect(() => {
    initAuth();
  }, []);

  const guardedSetScreen = (screen: Screen, params?: any) => {
    const role = getAuth().role;
    const normalized = (screen as any) === 'profile' ? ('mypage' as Screen) : screen;

    if (role === 'user' && COACH_ONLY.includes(normalized)) {
      setCurrentScreen('home');
      return;
    }
    if (role === 'coach' && USER_ONLY.includes(normalized)) {
      setCurrentScreen('coach-home');
      return;
    }
    if (normalized === 'request-detail' && params?.id) {
      setRequestDetailId(params.id);
    }
    if ((normalized === 'video-detail' || normalized === 'coach-advice-new') && params?.videoId) {
      setCurrentVideoId(params.videoId);
    }
    setCurrentScreen(normalized);
  };

  const handleNavigate = (screen: string, params?: any) => {
    switch (screen) {
      case 'home':
        guardedSetScreen(getHomeScreen());
        break;
      default:
        guardedSetScreen(screen as Screen, params);
        break;
    }
  };
  const handleOpenReview = (review: Review) => {
  setSelectedReview(review);
  setCurrentScreen('review-detail');
};



  const renderWelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center mb-16">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-light text-white mb-2" style={{ fontFamily: 'cursive' }}>
            SWING
          </h1>
          <h2
            className="text-4xl md:text-5xl font-bold text-white tracking-wider"
            style={{ fontFamily: 'monospace', letterSpacing: '0.2em' }}
          >
            BUDDY
          </h2>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-4 mb-8">
        <button
          onClick={() => setCurrentScreen('signin')}
          className="w-full bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 font-semibold py-4 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          ログイン
        </button>
        <button
          onClick={() => setCurrentScreen('onboarding')}
          className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-4 px-6 rounded-full border-2 border-white border-opacity-50 transition-all duration-300 hover:border-opacity-80"
        >
          初めて登録の方
        </button>
      </div>
    </div>
  );
  const renderOnboardingScreen = () => {
    const onboardingData = [
      { step: 1, lines: ['Easy upload', 'your swing', 'video'], component: 'golfer' },
      { step: 2, lines: ['Not AI.', 'Not theory.', 'Real feedback', 'from a', 'real coach.'], component: 'golfbag' },
      { step: 3, lines: ['Find your', 'best golf', 'buddy'], component: 'crouching' },
    ] as const;


    const currentData = onboardingData[onboardingStep];

    return (
      <OnboardingFrame>
        <div className="pt-16 pb-8">
          <LogoBlock />
        </div>

        <div
          className={`absolute h-[58vh] w-auto ${
            currentData.component === 'crouching' ? 'right-0 bottom-16' : 'left-0 bottom-20'
          }`}
        >
          {currentData.component === 'golfer' ? (
            <GolferSilhouette className="h-full w-auto" />
          ) : currentData.component === 'crouching' ? (
            <CrouchingGolferSilhouette className="h-full w-auto" />
          ) : (
            <GolfBagSilhouette className="h-full w-auto" />
          )}
        </div>

        <div
          className={`absolute bottom-40 max-w-[18ch] ${
            currentData.component === 'crouching' ? 'left-6 text-left' : 'right-6 text-right'
          }`}
        >
          <StepText
            step={currentData.step}
            lines={currentData.lines}
            alignment={currentData.component === 'crouching' ? 'left' : 'right'}
          />
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <Dots activeIndex={onboardingStep} />
        </div>

        <div
          className="absolute left-0 top-0 w-1/2 h-full cursor-pointer"
          onClick={() => {
            if (onboardingStep > 0) setOnboardingStep(onboardingStep - 1);
            else setCurrentScreen('welcome');
          }}
        />
        <div
          className="absolute right-0 top-0 w-1/2 h-full cursor-pointer"
          onClick={() => {
            if (onboardingStep < 2) setOnboardingStep(onboardingStep + 1);
            else setCurrentScreen('signup-name'); // ★ signup ではなく signup-name に遷移
          }}
        />
      </OnboardingFrame>
    );
  };

  const renderSignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
      if (!email || !password) {
        setError('メールアドレスとパスワードを入力してください');
        return;
      }

      setLoading(true);
      setError('');

      try {
        // AuthServiceを使用してログイン
        const { AuthService } = await import('./services/auth');
        const response = await AuthService.login({
          username: email, // OAuth2PasswordRequestFormではusernameフィールドにemailを設定
          password: password
        });

        console.log('Login successful:', response);
        
        // ログイン成功後の処理
        if (response.role === 'coach') {
          setCurrentScreen('coach-home');
        } else {
          setCurrentScreen('home');
        }
      } catch (error) {
        console.error('Login failed:', error);
        setError(error instanceof Error ? error.message : 'ログインに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 flex flex-col p-6">
        <div className="flex items-center justify-between mb-8 pt-4">
          <button
            onClick={() => setCurrentScreen('welcome')}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h3 className="text-xl font-semibold text-white">ログイン</h3>
          <div className="w-10" />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20">
            <div className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-white focus:border-opacity-60"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-white focus:border-opacity-60"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
              
              {/* エラーメッセージ */}
              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-300 rounded-lg p-3">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}
              
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-white text-purple-600 font-semibold py-4 rounded-xl hover:bg-opacity-90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'ログイン中...' : 'ログイン'}
              </button>
              
              <button
                onClick={() => setCurrentScreen('api-test')}
                className="w-full mt-2 bg-yellow-500 text-white font-semibold py-4 rounded-xl hover:bg-yellow-600 transition-colors shadow-lg"
              >
                🧪 APIテスト
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSignUpScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignUp = async () => {
      if (!email || !password || !confirmPassword) {
        setError('全ての項目を入力してください');
        return;
      }

      if (password !== confirmPassword) {
        setError('パスワードが一致しません');
        return;
      }

      if (password.length < 6) {
        setError('パスワードは6文字以上で入力してください');
        return;
      }

      setLoading(true);
      setError('');

      try {
        // AuthServiceを使用してユーザー登録
        const { AuthService } = await import('./services/auth');
        const response = await AuthService.registerUser({
          username: email, // 一時的にemailをusernameとして使用
          email: email,
          password: password
        });

        console.log('User registration successful:', response);
        
        // 登録成功後、ログイン画面に遷移
        setCurrentScreen('signin');
      } catch (error) {
        console.error('User registration failed:', error);
        setError(error instanceof Error ? error.message : 'ユーザー登録に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 flex flex-col p-6">
        <div className="flex items-center justify-between mb-8 pt-4">
          <button
            onClick={() => setCurrentScreen('welcome')}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h3 className="text-xl font-semibold text-white">新規登録</h3>
          <div className="w-10" />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20">
            <div className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-white focus:border-opacity-60"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-white focus:border-opacity-60"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-white focus:border-opacity-60"
                  placeholder="Confirm your password"
                  disabled={loading}
                />
              </div>
              
              {/* エラーメッセージ */}
              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-300 rounded-lg p-3">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}
              
              <button
                onClick={handleSignUp}
                disabled={loading}
                className="w-full bg-white text-purple-600 font-semibold py-4 rounded-xl hover:bg-opacity-90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '登録中...' : '登録を開始する'}
              </button>
              
              <button
                onClick={() => setCurrentScreen('signup-name')}
                className="w-full bg-purple-500 text-white font-semibold py-4 rounded-xl hover:bg-purple-600 transition-colors shadow-lg"
              >
                詳細登録画面へ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMainScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 pt-12 pb-6 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
            <p className="text-white text-opacity-80">Ready to swing?</p>
          </div>
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <UserIcon size={24} className="text-white" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🏌️‍♂️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">SWING BUDDY</h2>
          <p className="text-gray-600 mb-8">Your golf companion is ready!</p>
          <button
            onClick={() => setCurrentScreen('home')}
            className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
          >
            ホーム画面へ
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex justify-around">
          <button className="flex flex-col items-center space-y-1 text-purple-600">
            <HomeIcon size={24} className="text-purple-600" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <FileTextIcon size={24} className="text-gray-400" />
            <span className="text-xs">Request</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <UserIcon size={24} className="text-gray-400" />
            <span className="text-xs">Profile</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <SettingsIcon size={24} className="text-gray-400" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen shadow-2xl">
      {currentScreen === 'welcome' && renderWelcomeScreen()}
      {currentScreen === 'signin' && renderSignInScreen()}
      {currentScreen === 'onboarding' && renderOnboardingScreen()}
      {currentScreen === 'signup' && renderSignUpScreen()}

      {currentScreen === 'signup-name' && (
        <SignupName
          value={nameData}
          onChange={setNameData}
          onNext={() => {
            setRoleCandidate('user');
            setCurrentScreen('signup-birth');
          }}
          onSelectCoach={() => {
            setRoleCandidate('coach');
            setCurrentScreen('coach-signup');
          }}
          disabled={
            !DEV_BYPASS &&
            !(nameData.kanji[0] && nameData.kanji[1] && nameData.kana[0] && nameData.kana[1])
          }
          devBypass={DEV_BYPASS}
        />
      )}

      {currentScreen === 'signup-birth' && (
        <SignupBirth
          value={birthData}
          onChange={setBirthData}
          onNext={() => setCurrentScreen('signup-gender')}
          devBypass={DEV_BYPASS}
        />
      )}
      {currentScreen === 'signup-gender' && (
        <SignupGender
          value={genderData}
          onChange={setGenderData}
          onNext={() => setCurrentScreen('signup-mail')}
          devBypass={DEV_BYPASS}
        />
      )}
      {currentScreen === 'signup-mail' && (
        <SignupMail
          value={mailData}
          onChange={setMailData}
          onNext={() => {
            setRole('user');
            setCurrentScreen('home');
          }}
          devBypass={DEV_BYPASS}
        />
      )}

{currentScreen === 'home' && (
  <HomeScreen onNavigate={handleNavigate} onOpenReview={handleOpenReview} />
)}
{currentScreen === 'coach-home' && <CoachHome onNavigate={handleNavigate} />}
{currentScreen === 'request' && <RequestScreen onNavigate={handleNavigate} />}

{currentScreen === 'request-club' && (
  <RequestClubScreen
    onNavigate={handleNavigate}
    onSaveDraft={({ club }) => setRequestDraft((prev) => ({ ...prev, club }))}
  />
)}

{currentScreen === 'request-problem' && (
  <RequestProblemScreen
    onNavigate={handleNavigate}
    onSaveDraft={({ problems, note }) =>
      setRequestDraft((prev) => ({ ...prev, problems, note }))
    }
  />
)}

{currentScreen === 'request-confirm' && (
  <RequestConfirmScreen
    videoThumb={requestDraft.videoThumb}
    club={requestDraft.club}
    problems={requestDraft.problems}
    note={requestDraft.note}
    onNavigate={handleNavigate}
  />
)}

{currentScreen === 'request-done' && (
  <RequestDoneScreen onNavigate={handleNavigate} />
)}


      {currentScreen === 'request-detail' && (
        <RequestDetail
          requestId={requestDetailId}
          onBack={() => setCurrentScreen('coach-home')}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'mypage' && <MyPageScreen onNavigate={handleNavigate} />}
      {currentScreen === 'settings' && <SettingsScreen onNavigate={handleNavigate} />}
      {currentScreen === 'settings-notifications' && <NotificationsScreen onNavigate={handleNavigate} />}
      {currentScreen === 'settings-plan' && <PlanScreen onNavigate={handleNavigate} />}
      {currentScreen === 'settings-favorites' && <FavoritesScreen onNavigate={handleNavigate} />}
      {currentScreen === 'settings-upload' && <UploadSettingsScreen onNavigate={handleNavigate} />}
      {currentScreen === 'settings-storage' && <StorageScreen onNavigate={handleNavigate} />}
      {currentScreen === 'settings-help' && <HelpScreen onNavigate={handleNavigate} />}
      {currentScreen === 'settings-terms' && <TermsScreen onNavigate={handleNavigate} />}
      {currentScreen === 'settings-privacy' && <PrivacyScreen onNavigate={handleNavigate} />}
      {currentScreen === 'settings-appinfo' && <AppInfoScreen onNavigate={handleNavigate} />}
      {currentScreen === 'settings-rate' && <RateScreen onNavigate={handleNavigate} />}



      {currentScreen === 'coach-signup' && (
        <CoachSignupMain
          initialName={nameData}
          onBack={() => setCurrentScreen('signup-name')}
          onDone={() => setCurrentScreen('coach-signup-done')}
        />
      )}

      {currentScreen === 'coach-signup-done' && (
        <CoachSignupDone
          onHome={() => {
            setRole('coach');
            setCurrentScreen('coach-home');
          }}
          onProfile={() => {
            setRole('coach');
            setCurrentScreen('mypage');
          }}
        />
      )}

      {currentScreen === 'review-player' && selectedReview && (
        <ReviewPlayerScreen review={selectedReview} onNavigate={handleNavigate} />
      )}
      {currentScreen === 'review-detail' && selectedReview && (
        <ReviewDetailScreen review={selectedReview} onNavigate={handleNavigate} />
      )}
      {currentScreen === 'review-timeline' && selectedReview && (
        <ReviewTimelineScreen review={selectedReview} onNavigate={handleNavigate} />
      )}

      {currentScreen === 'coach-jobs' && (
        <CoachJobsScreen onOpenCoachReview={(id) => { setCoachReviewRequestId(id); setCurrentScreen('coach-review'); }} onBack={() => setCurrentScreen('coach-home')} />
      )}
      {currentScreen === 'coach-review' && (
        <CoachReviewScreen
          requestId={coachReviewRequestId}
          onBack={() => setCurrentScreen('coach-jobs')}
          onSubmitted={() => setCurrentScreen('coach-jobs')}
        />
      )}

      {currentScreen === 'video-detail' && (
        <VideoDetail videoId={currentVideoId} onNavigate={handleNavigate} />
      )}
      {currentScreen === 'coach-advice-new' && (
        <AdviceNew videoId={currentVideoId} onNavigate={handleNavigate} />
      )}

      {currentScreen === 'api-test' && <ApiTest />}

      {currentScreen === 'main' && renderMainScreen()}
    </div>
  );
}