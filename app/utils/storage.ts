// 安全なlocalStorage操作のためのユーティリティ関数

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        console.warn(`localStorage.getItem(${key}) failed:`, error);
        return null;
      }
    }
    return null;
  },

  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        console.warn(`localStorage.setItem(${key}, ${value}) failed:`, error);
      }
    }
  },

  removeItem: (key: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.warn(`localStorage.removeItem(${key}) failed:`, error);
      }
    }
  },

  clear: (): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.clear();
      } catch (error) {
        console.warn('localStorage.clear() failed:', error);
      }
    }
  },

  // オブジェクトの安全な保存
  setObject: (key: string, value: any): void => {
    try {
      const jsonValue = JSON.stringify(value);
      safeLocalStorage.setItem(key, jsonValue);
    } catch (error) {
      console.warn(`localStorage.setObject(${key}) failed:`, error);
    }
  },

  // オブジェクトの安全な取得
  getObject: <T>(key: string, defaultValue: T): T => {
    try {
      const item = safeLocalStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`localStorage.getObject(${key}) failed:`, error);
      return defaultValue;
    }
  }
};
