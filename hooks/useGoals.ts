import { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { UserWish, RecommendedWish } from '@/types/supabase';
import { logger } from '@/utils/logger';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import {
    fetchWishesAction,
    addWishAction,
    updateWishAction,
    deleteWishAction
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
            const CACHE_AGE = 60 * 60 * 1000;
            if (Date.now() - cached.timestamp < CACHE_AGE) {
                setUserWishes(cached.userWishes);
                setRecommendedWishes(cached.recommendedWishes);
                return true;
            }
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
        setIsLoading(true);

        try {
            const result = await addWishAction(wishData);

            if (result.success) {
                await fetchWishes();
                return true;
            } else {
                logger.error('Error adding wish:', result.error);
                alert('Failed to add wish: ' + result.error);
                return false;
            }
        } catch (e) {
            logger.error('Error adding wish', e);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateWish = async (id: string, updates: Partial<UserWish>) => {
        if (!user) return false;
        setIsLoading(true);

        try {
            const result = await updateWishAction(id, updates);

            if (result.success) {
                await fetchWishes();
                return true;
            } else {
                logger.error('Error updating wish:', result.error);
                alert('Failed to update wish: ' + result.error);
                return false;
            }
        } catch (e) {
            logger.error('Error updating wish', e);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteWish = async (id: string) => {
        if (!user) return false;

        try {
            const result = await deleteWishAction(id);

            if (result.success) {
                await fetchWishes();
                return true;
            } else {
                logger.error('Error deleting wish:', result.error);
                alert('Failed to delete wish: ' + result.error);
                return false;
            }
        } catch (e) {
            logger.error('Error deleting wish', e);
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
        deleteWish
    };
}
