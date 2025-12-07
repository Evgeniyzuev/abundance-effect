import { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { UserWish, RecommendedWish } from '@/types/supabase';
import { logger } from '@/utils/logger';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import {
    fetchWishesAction,
    addWishAction,
    updateWishAction,
    deleteWishAction,
    completeWishAction
} from '@/app/actions/goals';

interface WishesCache {
    userWishes: UserWish[];
    recommendedWishes: RecommendedWish[];
    timestamp: number;
}

export function useGoals() {
    const { user } = useUser();
    const [userWishes, setUserWishes] = useState<UserWish[]>([]);
    const [recommendedWishes, setRecommendedWishes] = useState<RecommendedWish[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadFromCache = useCallback(() => {
        const cached = storage.get<WishesCache>(STORAGE_KEYS.WISHES_CACHE);
        if (cached) {
            // Always load from cache first for instant display, regardless of age
            setUserWishes(cached.userWishes);
            setRecommendedWishes(cached.recommendedWishes);
            return true;
        }
        return false;
    }, []);

    const saveToCache = useCallback((uWishes: UserWish[], rWishes: RecommendedWish[]) => {
        storage.set(STORAGE_KEYS.WISHES_CACHE, {
            userWishes: uWishes,
            recommendedWishes: rWishes,
            timestamp: Date.now()
        });
    }, []);

    const fetchWishes = useCallback(async () => {
        if (!user) return;

        const result = await fetchWishesAction();

        if (result.success && result.data) {
            const { wishes, recommended } = result.data;

            // Filter recommended
            const userRecommendedIds = new Set(wishes.map((w: UserWish) => w.recommended_source_id).filter(Boolean));
            const userWishTitles = new Set(wishes.map((w: UserWish) => w.title.toLowerCase()));

            const filteredRecommended = recommended.filter((r: RecommendedWish) => {
                const hasById = userRecommendedIds.has(r.id);
                const hasByTitle = userWishTitles.has(r.title.toLowerCase());
                return !hasById && !hasByTitle;
            });

            setUserWishes(wishes);
            setRecommendedWishes(filteredRecommended);
            saveToCache(wishes, filteredRecommended);
        } else {
            logger.error('Error fetching wishes:', result.error);
        }
    }, [user, saveToCache]);

    const addWish = async (wishData: Partial<UserWish>, isRecommended: boolean = false) => {
        if (!user) return false;

        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const newWish: UserWish = {
            id: tempId,
            user_id: user.id,
            title: wishData.title || '',
            description: wishData.description || null,
            image_url: wishData.image_url || null,
            estimated_cost: wishData.estimated_cost || null,
            difficulty_level: wishData.difficulty_level || 1,
            is_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            recommended_source_id: wishData.recommended_source_id || null,
            ...wishData
        } as UserWish;

        const previousUserWishes = [...userWishes];
        const previousRecommendedWishes = [...recommendedWishes];

        setUserWishes(prev => [newWish, ...prev]);

        if (isRecommended && wishData.recommended_source_id) {
            setRecommendedWishes(prev => prev.filter(w => w.id !== wishData.recommended_source_id));
        }

        try {
            const result = await addWishAction(wishData);

            if (result.success) {
                // Fetch to get the real ID and sync
                await fetchWishes();
                return true;
            } else {
                // Revert
                setUserWishes(previousUserWishes);
                setRecommendedWishes(previousRecommendedWishes);
                logger.error('Error adding wish:', result.error);
                alert('Failed to add wish: ' + result.error);
                return false;
            }
        } catch (e) {
            // Revert
            setUserWishes(previousUserWishes);
            setRecommendedWishes(previousRecommendedWishes);
            logger.error('Error adding wish', e);
            return false;
        }
    };

    const updateWish = async (id: string, updates: Partial<UserWish>) => {
        if (!user) return false;

        const previousUserWishes = [...userWishes];

        // Optimistic update
        setUserWishes(prev => prev.map(w => w.id === id ? { ...w, ...updates, updated_at: new Date().toISOString() } : w));

        try {
            const result = await updateWishAction(id, updates);

            if (result.success) {
                // Silently sync in background
                fetchWishes();
                return true;
            } else {
                // Revert
                setUserWishes(previousUserWishes);
                logger.error('Error updating wish:', result.error);
                alert('Failed to update wish: ' + result.error);
                return false;
            }
        } catch (e) {
            // Revert
            setUserWishes(previousUserWishes);
            logger.error('Error updating wish', e);
            return false;
        }
    };

    const deleteWish = async (id: string) => {
        if (!user) return false;

        const previousUserWishes = [...userWishes];

        // Optimistic update
        setUserWishes(prev => prev.filter(w => w.id !== id));

        try {
            const result = await deleteWishAction(id);

            if (result.success) {
                // Silently sync in background
                fetchWishes();
                return true;
            } else {
                // Revert
                setUserWishes(previousUserWishes);
                logger.error('Error deleting wish:', result.error);
                alert('Failed to delete wish: ' + result.error);
                return false;
            }
        } catch (e) {
            // Revert
            setUserWishes(previousUserWishes);
            logger.error('Error deleting wish', e);
            return false;
        }
    };

    const completeWish = async (id: string) => {
        if (!user) return false;

        const previousUserWishes = [...userWishes];

        // Optimistic update
        setUserWishes(prev => prev.map(w => w.id === id ? { ...w, is_completed: true, updated_at: new Date().toISOString() } : w));

        try {
            const result = await completeWishAction(id);

            if (result.success) {
                // Silently sync in background
                fetchWishes();
                return true;
            } else {
                // Revert
                setUserWishes(previousUserWishes);
                logger.error('Error completing wish:', result.error);
                alert('Failed to complete wish: ' + result.error);
                return false;
            }
        } catch (e) {
            // Revert
            setUserWishes(previousUserWishes);
            logger.error('Error completing wish', e);
            return false;
        }
    };

    return {
        userWishes,
        recommendedWishes,
        isLoading,
        loadFromCache,
        fetchWishes,
        addWish,
        updateWish,
        deleteWish,
        completeWish
    };
}
