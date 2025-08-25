// API設定ファイル
export const API_CONFIG = {
  // Azureのデプロイ済みバックエンドに接続
  BASE_URL: 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net',
  
  // API バージョン
  API_VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1',
  
  // タイムアウト設定
  TIMEOUT: 30000, // 30秒
  
  // リトライ設定
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1秒
};

// 完全なAPIベースURL（APIバージョンを含む）
export const API_BASE_URL = `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}`;

// ヘルスチェック用のベースURL（APIバージョンを含まない）
export const HEALTH_BASE_URL = API_CONFIG.BASE_URL;

// 各エンドポイントの定義
export const API_ENDPOINTS = {
  // 認証
  AUTH: {
    LOGIN: '/auth/token',
    REGISTER_USER: '/auth/register/user',
    REGISTER_COACH: '/auth/register/coach',
    ME: '/auth/me',
  },
  
  // ユーザー
  USER: {
    PROFILE: '/user/profile',
    MY_VIDEOS: '/my-videos',
    MY_RESERVATIONS: '/my-reservations',
    CREATE_RESERVATION: '/create-reservation',
  },
  
  // コーチ
  COACH: {
    PROFILE: '/coach/profile',
    SAVE_ADVICES: '/coach/save-advices',
    GET_ADVICES: '/coach/get-advices',
    CREATE_SECTION_GROUP: '/coach/create-section-group',
    ADD_SECTION: '/coach/add-section',
    ADD_COACH_COMMENT: '/coach/add-coach-comment',
    UPDATE_SECTION: '/coach/update-section',
    GET_SECTION: '/coach/section',
    GET_SECTIONS: '/coach/sections',
    DELETE_SECTION: '/coach/section',
    ANALYZE_SECTION: '/coach/analyze-section',
    ADD_OVERALL_FEEDBACK: '/coach/add-overall-feedback',
    GET_OVERALL_FEEDBACK: '/coach/overall-feedback',
  },
  
  // 動画
  VIDEO: {
    GET_VIDEO: '/video',
    GET_VIDEO_WITH_SECTIONS: '/video/with-sections',
    GET_FEEDBACK_SUMMARY: '/video/feedback-summary',
    GET_ALL_VIDEOS: '/videos',
    SEARCH_VIDEOS: '/videos/search',
    CREATE_SESSION: '/video/session',
    GET_SESSIONS: '/video/sessions',
    GET_SESSION: '/session',
    UPDATE_SESSION: '/session',
    DELETE_SESSION: '/session',
  },
  
  // アップロード
  UPLOAD: {
    UPLOAD_VIDEO: '/upload/upload-video',
    UPLOAD_THUMBNAIL: '/upload/upload-thumbnail',
    UPLOAD_STATUS: '/upload/upload-status',
    DELETE_VIDEO: '/upload/video',
    CLEAR_ALL_DATA: '/upload/clear-all-data',
    PROXY_FILE: '/upload/proxy-file',
    MEDIA_URL: '/upload/media-url',
    MEDIA_URL_SIMPLE: '/upload/media-url-simple',
    CAPTURE_VIDEO_FRAME: '/upload/capture-video-frame',
    UPLOAD_MARKUP_IMAGE: '/upload/upload-markup-image',
  },
  
  // 音声文字起こし
  TRANSCRIPTION: {
    TRANSCRIBE_AUDIO: '/transcription/transcribe-audio',
  },
  
  // LINE連携
  LINE: {
    WEBHOOK: '/line/webhook',
    LOGIN: '/line/login',
    DEV_ECHO: '/line/dev/echo',
  },
  
  // ロケーション
  LOCATION: {
    LIST: '/locations',
    GET: '/locations',
    CREATE: '/locations',
    UPDATE: '/locations',
  },
  
  // その他
  MEDIA_URL: '/media-url',
  PROXY_FILE: '/proxy-file',
  UPLOAD_SECTION_IMAGE: '/upload-section-image',
  UPLOAD_MARKUP_IMAGE_MAIN: '/upload-markup-image',
};

// HTTPメソッドの定義
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

// コンテンツタイプ
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  TEXT: 'text/plain',
} as const;

// レスポンスステータス
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
