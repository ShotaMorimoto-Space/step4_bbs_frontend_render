import { api, authUtils } from '../utils/api';
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';

// 認証関連の型定義
export interface LoginRequest {
  username: string; // 実際にはemail
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: 'user' | 'coach';
  user_id?: string;
  user_email?: string;
  user_role?: 'user' | 'coach';
}

export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
  gender?: string;
  birthday?: string;
}

export interface CoachRegisterRequest {
  coachname: string;
  email: string;
  password: string;
  usertype?: string;
  birthday?: string;
  sex?: string;
  SNS_handle_instagram?: string;
  SNS_handle_X?: string;
  SNS_handle_youtube?: string;
  SNS_handle_facebook?: string;
  SNS_handle_tiktok?: string;
  line_user_id?: string;
  profile_picture_url?: string;
  bio?: string;
  hourly_rate?: number;
  location_id?: string;
  golf_exp?: number;
  certification?: string;
  setting_1?: string;
  setting_2?: string;
  setting_3?: string;
  lesson_rank?: string;
}

export interface UserProfile {
  user_id: string;
  usertype: string;
  username: string;
  email: string;
  gender?: string;
  birthday?: string;
  profile_picture_url?: string;
  bio?: string;
  golf_score_ave?: number;
  golf_exp?: number;
  zip_code?: string;
  state?: string;
  address1?: string;
  address2?: string;
  sport_exp?: string;
  industry?: string;
  job_title?: string;
  position?: string;
  created_at: string;
  updated_at: string;
}

export interface CoachProfile {
  coach_id: string;
  usertype: string;
  coachname: string;
  email: string;
  profile_picture_url?: string;
  bio?: string;
  birthday?: string;
  sex?: string;
  SNS_handle_instagram?: string;
  SNS_handle_X?: string;
  SNS_handle_youtube?: string;
  SNS_handle_facebook?: string;
  SNS_handle_tiktok?: string;
  line_user_id?: string;
  hourly_rate?: number;
  location_id?: string;
  golf_exp?: number;
  certification?: string;
  setting_1?: string;
  setting_2?: string;
  setting_3?: string;
  lesson_rank?: string;
  created_at: string;
  updated_at: string;
}

export interface MeResponse {
  role: 'user' | 'coach';
  profile: UserProfile | CoachProfile;
}

// 認証APIサービス
export class AuthService {
  // ログイン
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('ログイン送信データ:', JSON.stringify({
        username: credentials.username,
        endpoint: API_ENDPOINTS.AUTH.LOGIN,
        fullUrl: `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`
      }, null, 2));

      // OAuth2PasswordRequestFormの標準形式でFormDataを作成
      const formData = new FormData();
      formData.append('username', credentials.username);  // emailをusernameフィールドに設定
      formData.append('password', credentials.password);

      console.log('FormData送信:', JSON.stringify({
        username: credentials.username,
        password: '***',
        formDataEntries: Array.from(formData.entries())
      }, null, 2));

      // プロキシ経由でログインを試行
      console.log('=== プロキシ経由でログインを試行開始 ===');
      console.log('プロキシURL:', '/api/auth/login');
      console.log('リクエストメソッド:', 'POST');
      console.log('FormData内容:', Array.from(formData.entries()));
      
      const proxyResponse = await fetch('/api/auth/login', {
        method: 'POST',
        body: formData
      });
      
      console.log('プロキシレスポンス受信:', {
        status: proxyResponse.status,
        statusText: proxyResponse.statusText,
        ok: proxyResponse.ok,
        headers: Object.fromEntries(proxyResponse.headers.entries())
      });

      if (!proxyResponse.ok) {
        const errorText = await proxyResponse.text();
        console.error('プロキシレスポンスエラー:', {
          status: proxyResponse.status,
          statusText: proxyResponse.statusText,
          body: errorText
        });
        
        // エラーの詳細を解析
        try {
          const errorData = JSON.parse(errorText);
          console.log('プロキシエラーデータ詳細:', errorData);
          
          if (errorData.details) {
            throw new Error(`Backend Error: ${errorData.error}\nDetails: ${errorData.details}\nRaw: ${errorData.rawResponse || 'N/A'}`);
          }
        } catch (parseError) {
          console.log('エラーデータの解析に失敗:', parseError);
        }
        
        throw new Error(`HTTP ${proxyResponse.status}: ${proxyResponse.statusText}`);
      }

      const proxyData = await proxyResponse.json();
      console.log('プロキシレスポンス成功:', proxyData);

      // トークンを保存
      if (proxyData.access_token) {
        authUtils.setToken(proxyData.access_token);
      }

      return proxyData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // ユーザー登録
  static async registerUser(userData: UserRegisterRequest): Promise<UserProfile> {
    try {
      const response = await api.post<UserProfile>(
        API_ENDPOINTS.AUTH.REGISTER_USER,
        userData
      );

      return response.data;
    } catch (error) {
      console.error('User registration failed:', error);
      throw error;
    }
  }

  // コーチ登録
  static async registerCoach(coachData: CoachRegisterRequest): Promise<CoachProfile> {
    try {
      const response = await api.post<CoachProfile>(
        API_ENDPOINTS.AUTH.REGISTER_COACH,
        coachData
      );

      return response.data;
    } catch (error) {
      console.error('Coach registration failed:', error);
      throw error;
    }
  }

  // 現在のユーザー情報を取得
  static async getMe(): Promise<MeResponse> {
    try {
      const response = await api.get<MeResponse>(API_ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error) {
      console.error('Failed to get user info:', error);
      throw error;
    }
  }

  // ログアウト
  static async logout(): Promise<void> {
    try {
      // トークンをクリア
      authUtils.logout();
      
      // 必要に応じてサーバーサイドのログアウト処理も実行
      // await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
      // エラーが発生してもローカルの認証状態はクリアする
      authUtils.logout();
    }
  }

  // 認証状態の確認
  static isAuthenticated(): boolean {
    return authUtils.isAuthenticated();
  }

  // トークンの取得
  static getToken(): string | null {
    return authUtils.getToken();
  }

  // トークンの有効性チェック
  static isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiry;
    } catch {
      return false;
    }
  }

  // ユーザー役割の取得
  static async getUserRole(): Promise<'user' | 'coach' | null> {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }

      const me = await this.getMe();
      return me.role;
    } catch (error) {
      console.error('Failed to get user role:', error);
      return null;
    }
  }
}

// LINE連携関連の型とサービス
export interface LineLoginRequest {
  id_token?: string;
  line_user_id?: string;
}

export interface LineLoginResponse {
  access_token: string;
  token_type: string;
  role: string;
  line_user_id: string;
  user_id: string;
}

export class LineService {
  // LINEログイン
  static async login(lineData: LineLoginRequest): Promise<LineLoginResponse> {
    try {
      const response = await api.post<LineLoginResponse>(
        API_ENDPOINTS.LINE.LOGIN,
        lineData
      );

      // トークンを保存
      if (response.data.access_token) {
        authUtils.setToken(response.data.access_token);
      }

      return response.data;
    } catch (error) {
      console.error('LINE login failed:', error);
      throw error;
    }
  }

  // LINE開発用エコー
  static async devEcho(text: string): Promise<{ echo: string }> {
    try {
      const response = await api.post<{ echo: string }>(
        API_ENDPOINTS.LINE.DEV_ECHO,
        { text }
      );
      return response.data;
    } catch (error) {
      console.error('LINE dev echo failed:', error);
      throw error;
    }
  }
}

// 認証フック（React用）
export const useAuth = () => {
  return {
    isAuthenticated: AuthService.isAuthenticated,
    login: AuthService.login,
    logout: AuthService.logout,
    registerUser: AuthService.registerUser,
    registerCoach: AuthService.registerCoach,
    getMe: AuthService.getMe,
    getUserRole: AuthService.getUserRole,
    isTokenValid: AuthService.isTokenValid,
  };
};
