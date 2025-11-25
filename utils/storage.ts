export const STORAGE_KEYS = {
    LANGUAGE: 'app-language',
    THEME: 'app-theme',
    USER_SETTINGS: 'app-user-settings',
    USER_AUTH_CACHE: 'app-user-auth-cache',
    TELEGRAM_INIT_DATA: 'app-telegram-init-data',
    WISHES_CACHE: 'app-wishes-cache',
    NOTES_CACHE: 'app-notes-cache',
    CUSTOM_LISTS_CACHE: 'app-custom-lists-cache',
    TASKS_CACHE: 'app-tasks-cache',
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

    // Wish image helpers
    saveWishImage: (id: string, base64: string): void => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(`wish_image_${id}`, base64);
        } catch (error) {
            console.warn('Error saving wish image to localStorage:', error);
        }
    },

    getWishImage: (id: string): string | null => {
        if (typeof window === 'undefined') return null;
        try {
            return window.localStorage.getItem(`wish_image_${id}`);
        } catch (error) {
            console.warn('Error reading wish image from localStorage:', error);
            return null;
        }
    },

    removeWishImage: (id: string): void => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.removeItem(`wish_image_${id}`);
        } catch (error) {
            console.warn('Error removing wish image from localStorage:', error);
        }
    },

    // Task image helpers
    saveTaskImage: (id: string, base64: string): void => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(`task_image_${id}`, base64);
        } catch (error) {
            console.warn('Error saving task image to localStorage:', error);
        }
    },

    getTaskImage: (id: string): string | null => {
        if (typeof window === 'undefined') return null;
        try {
            return window.localStorage.getItem(`task_image_${id}`);
        } catch (error) {
            console.warn('Error reading task image from localStorage:', error);
            return null;
        }
    },

    removeTaskImage: (id: string): void => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.removeItem(`task_image_${id}`);
        } catch (error) {
            console.warn('Error removing task image from localStorage:', error);
        }
    }
};
