import { useState, useEffect, useCallback } from 'react';
import { UserResults, GameItem } from '@/types/supabase';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { useUser } from '@/context/UserContext';
import { fetchResultsAction, updateResultsAction, fetchGameItemsAction } from '@/app/actions/results';

export interface InventorySlot {
    slot: number;
    itemId: string;
    count: number;
}

export const useResults = () => {
    const { user } = useUser();

    const [results, setResults] = useState<UserResults | null>(null);
    const [gameItems, setGameItems] = useState<GameItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadFromCache = useCallback(() => {
        const cachedResults = storage.get<UserResults>(STORAGE_KEYS.RESULTS_CACHE);
        if (cachedResults) {
            setResults(cachedResults);
        }

        const cachedItems = storage.get<GameItem[]>(STORAGE_KEYS.GAME_ITEMS_CACHE);
        if (cachedItems) {
            setGameItems(cachedItems);
        }

        if (cachedResults || cachedItems) {
            setIsLoading(false);
        }
    }, []);

    const fetchResults = useCallback(async () => {
        // Fetch game items (public data, doesn't need user)
        try {
            const itemsResult = await fetchGameItemsAction();
            if (itemsResult.success && itemsResult.data) {
                setGameItems(itemsResult.data);
                storage.set(STORAGE_KEYS.GAME_ITEMS_CACHE, itemsResult.data);
            }
        } catch (error) {
            console.error('Error fetching game items:', error);
        }

        if (!user) return;

        try {
            const result = await fetchResultsAction();

            if (result.success && result.data) {
                setResults(result.data);
                storage.set(STORAGE_KEYS.RESULTS_CACHE, result.data);
            }
        } catch (error) {
            console.error('Unexpected error fetching results:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const saveResults = async (updates: Partial<UserResults>) => {
        if (!user || !results) return;

        // Optimistic update
        const newResults = { ...results, ...updates, updated_at: new Date().toISOString() };
        setResults(newResults);
        storage.set(STORAGE_KEYS.RESULTS_CACHE, newResults);

        try {
            const result = await updateResultsAction(updates);

            if (!result.success) {
                console.error('Error saving results:', result.error);
                // Revert on error (optional, or just let next fetch fix it)
            }
        } catch (error) {
            console.error('Unexpected error saving results:', error);
        }
    };

    const updateInventory = (slots: InventorySlot[]) => {
        saveResults({ inventory: slots as any });
    };

    const updateKnowledge = (slots: InventorySlot[]) => {
        saveResults({ knowledge: slots as any });
    };

    const updateStash = (stash: any[]) => {
        saveResults({ stash: stash as any });
    };

    const unlockAchievement = (achievementId: string) => {
        const current = (results?.unlocked_achievements as string[]) || [];
        if (!current.includes(achievementId)) {
            saveResults({ unlocked_achievements: [...current, achievementId] as any });
        }
    };

    const setBase = (baseId: string) => {
        saveResults({ selected_base_id: baseId });
    };

    const setCharacter = (characterId: string) => {
        saveResults({ selected_character_id: characterId });
    };

    return {
        results,
        gameItems,
        isLoading,
        loadFromCache,
        fetchResults,
        updateInventory,
        updateKnowledge,
        updateStash,
        unlockAchievement,
        setBase,
        setCharacter
    };
};

