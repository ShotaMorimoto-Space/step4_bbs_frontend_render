import { api } from '../utils/api';
import { HEALTH_BASE_URL } from '../config/api';

// ヘルスチェック関連の型
export interface HealthResponse {
  message: string;
}

export interface ApiStatus {
  backend: boolean;
  message: string;
  timestamp: string;
}

// ヘルスチェックサービス
export class HealthService {
  // バックエンドのヘルスチェック
  static async checkBackendHealth(): Promise<ApiStatus> {
    try {
      // ヘルスチェック用の専用ベースURLを使用
      const response = await fetch(`${HEALTH_BASE_URL}/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        backend: true,
        message: data.message || 'Backend is healthy',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Backend health check failed:', error);
      
      return {
        backend: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // ルートエンドポイントのチェック
  static async checkRootEndpoint(): Promise<ApiStatus> {
    try {
      // ヘルスチェック用の専用ベースURLを使用
      const response = await fetch(`${HEALTH_BASE_URL}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        backend: true,
        message: data.message || 'Backend is running',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Root endpoint check failed:', error);
      
      return {
        backend: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 全体的なAPI状態のチェック
  static async checkOverallHealth(): Promise<{
    backend: ApiStatus;
    overall: boolean;
    timestamp: string;
  }> {
    const backend = await this.checkBackendHealth();
    const overall = backend.backend;
    
    return {
      backend,
      overall,
      timestamp: new Date().toISOString(),
    };
  }
}
