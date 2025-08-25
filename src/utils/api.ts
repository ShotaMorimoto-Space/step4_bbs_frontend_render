import { API_BASE_URL, API_CONFIG, HTTP_METHODS, CONTENT_TYPES, HTTP_STATUS } from '../config/api';

// API通信の基本設定
interface ApiRequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

// APIレスポンスの基本型
interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

// APIエラーの型
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public responseData?: any,
    message?: string
  ) {
    super(message || `API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

// 認証トークンの管理
class TokenManager {
  private static readonly TOKEN_KEY = 'sb:auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'sb:refresh_token';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiry;
    } catch {
      return true; // Invalid token, consider expired
    }
  }
}

// リトライ機能付きのfetch関数
async function fetchWithRetry(
  url: string,
  config: RequestInit,
  retries: number = API_CONFIG.MAX_RETRIES
): Promise<Response> {
  try {
    const response = await fetch(url, config);
    
    // 成功した場合や、リトライ対象でないエラーの場合はそのまま返す
    if (response.ok || response.status >= 500) {
      return response;
    }
    
    // 4xxエラーの場合はリトライしない
    if (response.status >= 400 && response.status < 500) {
      return response;
    }
    
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  } catch (error) {
    if (retries > 0) {
      // リトライ前の待機
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      return fetchWithRetry(url, config, retries - 1);
    }
    throw error;
  }
}

// タイムアウト機能付きのfetch
async function fetchWithTimeout(
  url: string,
  config: RequestInit,
  timeout: number = API_CONFIG.TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetchWithRetry(url, {
      ...config,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, 'Request Timeout', null, 'リクエストがタイムアウトしました');
    }
    throw error;
  }
}

// 共通のAPI通信関数
export async function apiRequest<T = any>(
  endpoint: string,
  config: ApiRequestConfig = {}
): Promise<ApiResponse<T>> {
  const {
    method = HTTP_METHODS.GET,
    headers = {},
    body,
    timeout = API_CONFIG.TIMEOUT,
  } = config;

  // 完全なURLを構築
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  // ヘッダーの設定
  const requestHeaders: Record<string, string> = {
    'Content-Type': CONTENT_TYPES.JSON,
    ...headers,
  };

  // 認証トークンの追加
  const token = TokenManager.getToken();
  if (token && !TokenManager.isTokenExpired(token)) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  // リクエスト設定
  const requestConfig: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'include', // CORS対応
  };

  // ボディの設定
  if (body) {
    if (body instanceof FormData) {
      // FormDataの場合はContent-Typeを削除（ブラウザが自動設定）
      delete requestHeaders['Content-Type'];
      requestConfig.body = body;
    } else if (typeof body === 'string') {
      requestConfig.body = body;
    } else {
      requestConfig.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetchWithTimeout(url, requestConfig, timeout);
    
    // レスポンスの処理
    let responseData: T;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else if (contentType && contentType.includes('text/')) {
      responseData = await response.text() as T;
    } else {
      responseData = await response.blob() as T;
    }

    // エラーレスポンスの処理
    if (!response.ok) {
      throw new ApiError(
        response.status,
        response.statusText,
        responseData,
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // ネットワークエラーなどの処理
    const errorMessage = error instanceof Error ? error.message : 'ネットワークエラーが発生しました';
    throw new ApiError(
      0,
      'Network Error',
      null,
      errorMessage
    );
  }
}

// 便利なHTTPメソッド関数
export const api = {
  get: <T = any>(endpoint: string, config?: Omit<ApiRequestConfig, 'method'>) =>
    apiRequest<T>(endpoint, { ...config, method: HTTP_METHODS.GET }),

  post: <T = any>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...config, method: HTTP_METHODS.POST, body }),

  put: <T = any>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...config, method: HTTP_METHODS.PUT, body }),

  patch: <T = any>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...config, method: HTTP_METHODS.PATCH, body }),

  delete: <T = any>(endpoint: string, config?: Omit<ApiRequestConfig, 'method'>) =>
    apiRequest<T>(endpoint, { ...config, method: HTTP_METHODS.DELETE }),

  // FormData用のPOST
  postForm: <T = any>(endpoint: string, formData: FormData, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { 
      ...config, 
      method: HTTP_METHODS.POST, 
      body: formData,
      headers: { ...config?.headers } // Content-Typeは自動設定される
    }),
};

// 認証関連のユーティリティ
export const authUtils = {
  // ログイン状態の確認
  isAuthenticated: (): boolean => {
    const token = TokenManager.getToken();
    return token !== null && !TokenManager.isTokenExpired(token);
  },

  // トークンの取得
  getToken: (): string | null => TokenManager.getToken(),

  // トークンの設定
  setToken: (token: string): void => TokenManager.setToken(token),

  // トークンのクリア
  clearToken: (): void => TokenManager.clearTokens(),

  // ログアウト
  logout: (): void => {
    TokenManager.clearTokens();
    // 必要に応じて他の認証状態もクリア
    localStorage.removeItem('sb:auth');
    localStorage.removeItem('sb:roleCandidate');
  },
};

// エラーハンドリングのユーティリティ
export const errorUtils = {
  // エラーメッセージの取得
  getErrorMessage: (error: unknown): string => {
    if (error instanceof ApiError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return '予期しないエラーが発生しました';
  },

  // エラーの分類
  categorizeError: (error: unknown): 'network' | 'auth' | 'validation' | 'server' | 'unknown' => {
    if (error instanceof ApiError) {
      if (error.status === 0) return 'network';
      if (error.status === 401 || error.status === 403) return 'auth';
      if (error.status >= 400 && error.status < 500) return 'validation';
      if (error.status >= 500) return 'server';
    }
    return 'unknown';
  },
};
