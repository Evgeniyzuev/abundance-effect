export const STORAGE_KEYS = {
    LANGUAGE: 'app-language',
    THEME: 'app-theme',
    USER_SETTINGS: 'app-user-settings',
    USER_AUTH_CACHE: 'app-user-auth-cache',
    TELEGRAM_INIT_DATA: 'app-telegram-init-data',
    WISHES_CACHE: 'app-wishes-cache',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// Cached user authentication data interface
export interface CachedUserAuth {
    id: string;
    telegram_id: number | null;
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    cached_at: number; // timestamp
}

// Telegram init data cache
export interface TelegramInitDataCache {
    initData: string;
    user: any;
    cached_at: number;
}

export const storage = {
    get: <T>(key: StorageKey, defaultValue: T | null = null): T | null => {
        if (typeof window === 'undefined') return defaultValue;
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : defaultValue;
        } catch (error) {
            console.warn(`Error reading ${key} from localStorage:`, error);
            return defaultValue;
        }
    },

    set: <T>(key: StorageKey, value: T): void => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Error writing ${key} to localStorage:`, error);
        }
    },

    remove: (key: StorageKey): void => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.warn(`Error removing ${key} from localStorage:`, error);
        }
    },

    // Helper: Clear all auth-related cache
    clearAuthCache: (): void => {
        storage.remove(STORAGE_KEYS.USER_AUTH_CACHE);
        storage.remove(STORAGE_KEYS.TELEGRAM_INIT_DATA);
    },
};
