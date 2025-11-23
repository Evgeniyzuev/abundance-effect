export const STORAGE_KEYS = {
    LANGUAGE: 'app-language',
    THEME: 'app-theme',
    USER_SETTINGS: 'app-user-settings',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

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
};
