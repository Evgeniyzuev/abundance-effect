import { useState, useCallback, useEffect, useRef } from 'react';
import { storage, StorageKey } from '@/utils/storage';
import { logger } from '@/utils/logger';

interface SyncDataOptions<T> {
    key: StorageKey;
    fetcher: () => Promise<{ success: boolean; data?: T; error?: any }>;
    initialValue: T;
    onFetchSuccess?: (data: T) => void;
}

export function useSyncData<T>({ key, fetcher, initialValue, onFetchSuccess }: SyncDataOptions<T>) {
    const [data, setData] = useState<T>(initialValue);
    const [isInitialized, setIsInitialized] = useState(false);
    const hasLoadedFromCache = useRef(false);

    // 1. Load from cache immediately (synchronous if possible, or in effect)
    const loadFromCache = useCallback(() => {
        if (hasLoadedFromCache.current) return;

        const cached = storage.get<any>(key);
        if (cached) {
            // Handle both raw data and { data, timestamp } format
            const value = cached.data || cached;
            // If the cache structure matches T (roughly), use it
            // Note: This assumes the cache structure is stable.
            // For complex objects, we might need a specific selector, but for now we assume direct mapping.
            setData(value);
            hasLoadedFromCache.current = true;
            return true;
        }
        return false;
    }, [key]);

    // 2. Fetch from server (Background Sync)
    const refresh = useCallback(async () => {
        try {
            const result = await fetcher();
            if (result.success && result.data) {
                setData(result.data);
                // Save to cache with timestamp
                storage.set(key, {
                    data: result.data,
                    timestamp: Date.now()
                });
                if (onFetchSuccess) onFetchSuccess(result.data);
            } else {
                logger.error(`Error fetching ${key}:`, result.error);
            }
            return result;
        } catch (error) {
            logger.error(`Exception fetching ${key}:`, error);
            return { success: false, error };
        }
    }, [fetcher, key, onFetchSuccess]);

    // Initial load effect
    useEffect(() => {
        if (!isInitialized) {
            loadFromCache();
            refresh();
            setIsInitialized(true);
        }
    }, [isInitialized, loadFromCache, refresh]);

    return {
        data,
        setData,
        refresh
    };
}
