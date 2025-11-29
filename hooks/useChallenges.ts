import { useState, useCallback, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Challenge, ChallengeParticipant } from '@/types/supabase';
import { logger } from '@/utils/logger';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { useLanguage } from '@/context/LanguageContext';
import {
    fetchChallengesAction,
    joinChallengeAction,
    updateParticipationAction,
    checkAutoChallengesAction,
    createChallengeAction,
    checkUserWishesAction,
    testVerificationScriptAction
} from '@/app/actions/challenges';

interface ChallengesCache {
    challenges: Challenge[];
    userParticipations: ChallengeParticipant[];
    timestamp: number;
}

interface ChallengeWithParticipation extends Challenge {
    userParticipation?: ChallengeParticipant;
}

export function useChallenges() {
    const { user } = useUser();
    const { language } = useLanguage();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [userParticipations, setUserParticipations] = useState<ChallengeParticipant[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load from cache
    const loadFromCache = useCallback(() => {
        const cached = storage.get<ChallengesCache>(STORAGE_KEYS.CHALLENGES_CACHE);
        if (cached) {
            // Check if cache is not too old (1 hour)
            const MAX_CACHE_AGE = 60 * 60 * 1000; // 1 hour
            if (Date.now() - cached.timestamp < MAX_CACHE_AGE) {
                setChallenges(cached.challenges);
                setUserParticipations(cached.userParticipations);
                return true;
            }
        }
        return false;
    }, []);

    // Save to cache
    const saveToCache = useCallback((challenges: Challenge[], participations: ChallengeParticipant[]) => {
        storage.set(STORAGE_KEYS.CHALLENGES_CACHE, {
            challenges,
            userParticipations: participations,
            timestamp: Date.now()
        });
    }, []);

    // Fetch challenges from server
    const fetchChallenges = useCallback(async () => {
        if (!user) return;

        const result = await fetchChallengesAction();

        if (result.success && result.data) {
            const { challenges: fetchedChallenges, userParticipations: fetchedParticipations } = result.data;
            setChallenges(fetchedChallenges);
            setUserParticipations(fetchedParticipations);
            saveToCache(fetchedChallenges, fetchedParticipations);
        } else {
            logger.error('Error fetching challenges:', result.error);
        }
    }, [user, saveToCache]);

    // Check for auto-completable challenges
    const checkAutoChallenges = useCallback(async () => {
        if (!user) return;

        const result = await checkAutoChallengesAction();

        if (result.success && result.data) {
            const { completedChallenges } = result.data;

            if (completedChallenges.length > 0) {
                // Refresh challenges to get updated status
                await fetchChallenges();

                // Show notification for completed challenges
                completedChallenges.forEach(challengeId => {
                    logger.info('Auto-completed challenge:', challengeId);
                });
            }
        } else {
            logger.error('Error checking auto challenges:', result.error);
        }
    }, [user, fetchChallenges]);

    // Join a challenge
    const joinChallenge = async (challengeId: string) => {
        if (!user) return false;

        // Optimistic update
        const challenge = challenges.find(c => c.id === challengeId);
        if (!challenge) return false;

        const previousChallenges = [...challenges];
        const previousParticipations = [...userParticipations];

        // Add temporary participation
        const tempParticipation: ChallengeParticipant = {
            id: `temp-${Date.now()}`,
            challenge_id: challengeId,
            user_id: user.id,
            joined_at: new Date().toISOString(),
            status: 'active',
            progress_data: {},
            completed_at: null,
            rewards_claimed: {},
            verification_data: {}
        };

        setUserParticipations(prev => [...prev, tempParticipation]);
        setChallenges(prev => prev.map(c =>
            c.id === challengeId
                ? { ...c, current_participants: c.current_participants + 1 }
                : c
        ));

        try {
            const result = await joinChallengeAction(challengeId);

            if (result.success) {
                // Refresh to get real data
                await fetchChallenges();
                return true;
            } else {
                // Revert optimistic updates
                setUserParticipations(previousParticipations);
                setChallenges(previousChallenges);
                logger.error('Error joining challenge:', result.error);
                alert('Failed to join challenge: ' + result.error);
                return false;
            }
        } catch (error) {
            // Revert optimistic updates
            setUserParticipations(previousParticipations);
            setChallenges(previousChallenges);
            logger.error('Error joining challenge:', error);
            return false;
        }
    };

    // Update participation status
    const updateParticipation = async (challengeId: string, status: ChallengeParticipant['status'], progressData?: any) => {
        if (!user) return false;

        const previousParticipations = [...userParticipations];

        // Optimistic update
        setUserParticipations(prev => prev.map(p =>
            p.challenge_id === challengeId && p.user_id === user.id
                ? {
                    ...p,
                    status,
                    completed_at: status === 'completed' ? new Date().toISOString() : p.completed_at,
                    progress_data: progressData || p.progress_data
                }
                : p
        ));

        try {
            const result = await updateParticipationAction(challengeId, status, progressData);

            if (result.success) {
                // Refresh to sync with server
                await fetchChallenges();
                return true;
            } else {
                // Revert
                setUserParticipations(previousParticipations);
                logger.error('Error updating participation:', result.error);
                alert('Failed to update participation: ' + result.error);
                return false;
            }
        } catch (error) {
            // Revert
            setUserParticipations(previousParticipations);
            logger.error('Error updating participation:', error);
            return false;
        }
    };

    // Create a new challenge
    const createChallenge = async (challengeData: {
        title: Record<string, string>;
        description: Record<string, string>;
        type: Challenge['type'];
        category?: string;
        reward_core: number;
        reward_items?: any[];
        max_participants?: number;
        deadline?: string;
        verification_type: Challenge['verification_type'];
        verification_logic?: any;
        image_url?: string;
    }) => {
        if (!user) return false;

        try {
            const result = await createChallengeAction(challengeData);

            if (result.success) {
                // Refresh challenges to include new one
                await fetchChallenges();
                return true;
            } else {
                logger.error('Error creating challenge:', result.error);
                alert('Failed to create challenge: ' + result.error);
                return false;
            }
        } catch (error) {
            logger.error('Error creating challenge:', error);
            return false;
        }
    };

    // Get challenges with participation status
    const getChallengesWithParticipation = useCallback((): ChallengeWithParticipation[] => {
        return challenges.map(challenge => {
            const participation = userParticipations.find(p =>
                p.challenge_id === challenge.id && p.user_id === user?.id
            );

            return {
                ...challenge,
                userParticipation: participation
            };
        });
    }, [challenges, userParticipations, user?.id]);

    // Check user's wishes directly
    const checkUserWishes = useCallback(async () => {
        if (!user) return { success: false, error: 'Not authenticated' };
        
        return await checkUserWishesAction();
    }, [user]);

    // Test verification script for a challenge
    const testVerificationScript = useCallback(async (challengeId: string) => {
        if (!user) return { success: false, error: 'Not authenticated' };
        
        return await testVerificationScriptAction(challengeId);
    }, [user]);

    // Initialize on mount and user change
    useEffect(() => {
        if (!user) return;

        // Load from cache first
        loadFromCache();

        // Then fetch fresh data
        fetchChallenges();

        // Check for auto-completable challenges every 5 minutes
        const autoCheckInterval = setInterval(checkAutoChallenges, 5 * 60 * 1000);

        return () => clearInterval(autoCheckInterval);
    }, [user, loadFromCache, fetchChallenges, checkAutoChallenges]);

    return {
        challenges,
        userParticipations,
        challengesWithParticipation: getChallengesWithParticipation(),
        isLoading,
        loadFromCache,
        fetchChallenges,
        joinChallenge,
        updateParticipation,
        createChallenge,
        checkAutoChallenges,
        checkUserWishes,
        testVerificationScript
    };
}
