import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { useUser } from '@/context/UserContext';

type UserResults = Database['public']['Tables']['user_results']['Row'];

export interface InventorySlot {
    slot: number;
    itemId: string;
    count: number;
}

export const useResults = () => {
    const { user } = useUser();
    const supabase = createClientComponentClient<Database>();

    const [results, setResults] = useState<UserResults | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadFromCache = useCallback(() => {
        const cached = storage.get<UserResults>(STORAGE_KEYS.RESULTS_CACHE);
        if (cached) {
            setResults(cached);
            setIsLoading(false);
        }
    }, []);

    const fetchResults = useCallback(async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('user_results')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
                console.error('Error fetching results:', error);
                return;
            }

            if (data) {
                setResults(data);
                storage.set(STORAGE_KEYS.RESULTS_CACHE, data);
            } else {
                // Initialize if not exists
                const newResults: UserResults = {
                    user_id: user.id,
                    inventory: [],
                    knowledge: [],
                    unlocked_achievements: [],
                    selected_base_id: null,
                    selected_character_id: null,
                    updated_at: new Date().toISOString()
                };
                // We don't necessarily need to insert immediately, but we can set local state
                setResults(newResults);
            }
        } catch (error) {
            console.error('Unexpected error fetching results:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user, supabase]);

    const saveResults = async (updates: Partial<UserResults>) => {
        if (!user || !results) return;

        // Optimistic update
        const newResults = { ...results, ...updates, updated_at: new Date().toISOString() };
        setResults(newResults);
        storage.set(STORAGE_KEYS.RESULTS_CACHE, newResults);

        try {
            const { error } = await supabase
                .from('user_results')
                .upsert(newResults)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error saving results:', error);
                // Revert on error (optional, or just let next fetch fix it)
            }
        } catch (error) {
            console.error('Unexpected error saving results:', error);
        }
    };

    const updateInventory = (slots: InventorySlot[]) => {
        saveResults({ inventory: slots });
    };

    const updateKnowledge = (slots: InventorySlot[]) => {
        saveResults({ knowledge: slots });
    };

    const unlockAchievement = (achievementId: string) => {
        const current = (results?.unlocked_achievements as string[]) || [];
        if (!current.includes(achievementId)) {
            saveResults({ unlocked_achievements: [...current, achievementId] });
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
        isLoading,
        loadFromCache,
        fetchResults,
        updateInventory,
        updateKnowledge,
        unlockAchievement,
        setBase,
        setCharacter
    };
};
