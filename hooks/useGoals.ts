import { useState, useCallback } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useUser } from '@/context/UserContext';
import { UserWish, RecommendedWish } from '@/types/supabase';
import { withValidSession } from '@/utils/supabase/sessionManager';
import { logger } from '@/utils/logger';
import { storage, STORAGE_KEYS } from '@/utils/storage';

interface WishesCache {
    userWishes: UserWish[];
    recommendedWishes: RecommendedWish[];
    timestamp: number;
}

export function useGoals() {
    const { user } = useUser();
    const supabase = useSupabase();
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

        // Don't set global loading here to avoid flickering if we have cache
        // But we could add a separate 'isRefreshing' state if needed

        const result = await withValidSession(
            supabase,
            async () => {
                const [wishesResult, recommendedResult] = await Promise.all([
                    supabase.from('user_wishes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
                    supabase.from('recommended_wishes').select('*').order('created_at', { ascending: false })
                ]);

                return {
                    wishes: wishesResult.data,
                    wishesError: wishesResult.error,
                    recommended: recommendedResult.data,
                    recError: recommendedResult.error
                };
            },
            () => logger.warn('Session expired during fetch')
        );

        if (result && result.wishes && result.recommended) {
            const { wishes, recommended } = result;

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
        }
    }, [user, supabase, saveToCache]);

    const addWish = async (wishData: Partial<UserWish>, isRecommended: boolean = false) => {
        if (!user) return false;
        setIsLoading(true);

        try {
            const result = await withValidSession(
                supabase,
                async () => {
                    return await supabase.from('user_wishes').insert({
                        ...wishData,
                        user_id: user.id,
                        is_completed: false
                    }).select().single();
                },
                () => alert('Session expired. Please refresh.')
            );

            if (result && !result.error) {
                await fetchWishes();
                return true;
            }
            return false;
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
            const result = await withValidSession(
                supabase,
                async () => {
                    return await supabase.from('user_wishes').update(updates).eq('id', id);
                },
                () => alert('Session expired. Please refresh.')
            );

            if (result && !result.error) {
                await fetchWishes();
                return true;
            }
            return false;
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
            const result = await withValidSession(
                supabase,
                async () => {
                    return await supabase.from('user_wishes').delete().eq('id', id);
                },
                () => alert('Session expired. Please refresh.')
            );

            if (result && !result.error) {
                // Optimistic update could go here, but fetching is safer for sync
                await fetchWishes();
                return true;
            }
            return false;
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
