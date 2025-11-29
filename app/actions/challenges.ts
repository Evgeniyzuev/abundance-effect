'use server';

import { createClient } from '@/utils/supabase/server';
import { Challenge, ChallengeParticipant } from '@/types/supabase';
import { logger } from '@/utils/logger';

// Fetch available challenges for user
export async function fetchChallengesAction() {
    try {
        const supabase = await createClient();

        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Get all active challenges
        const { data: challenges, error: challengesError } = await supabase
            .from('challenges')
            .select('*')
            .eq('is_active', true)
            .order('priority', { ascending: false })
            .order('created_at', { ascending: false });

        if (challengesError) {
            logger.error('Error fetching challenges:', challengesError);
            return { success: false, error: challengesError.message };
        }

        // Get user's participations
        const { data: participations, error: participationsError } = await supabase
            .from('challenge_participants')
            .select('*')
            .eq('user_id', user.user.id);

        if (participationsError) {
            logger.error('Error fetching participations:', participationsError);
            return { success: false, error: participationsError.message };
        }

        return {
            success: true,
            data: {
                challenges: challenges || [],
                userParticipations: participations || []
            }
        };
    } catch (error) {
        logger.error('Error in fetchChallengesAction:', error);
        return { success: false, error: 'Internal server error' };
    }
}

// Join a challenge
export async function joinChallengeAction(challengeId: string) {
    try {
        const supabase = await createClient();

        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Check if challenge exists and is available
        const { data: challenge, error: challengeError } = await supabase
            .from('challenges')
            .select('*')
            .eq('id', challengeId)
            .eq('is_active', true)
            .single();

        if (challengeError || !challenge) {
            return { success: false, error: 'Challenge not found or inactive' };
        }

        // Check if user already participates
        const { data: existingParticipation } = await supabase
            .from('challenge_participants')
            .select('id')
            .eq('challenge_id', challengeId)
            .eq('user_id', user.user.id)
            .single();

        if (existingParticipation) {
            return { success: false, error: 'Already participating in this challenge' };
        }

        // Check if challenge is full
        if (challenge.max_participants > 0 && challenge.current_participants >= challenge.max_participants) {
            return { success: false, error: 'Challenge is full' };
        }

        // Insert participation
        const { data: participation, error: participationError } = await supabase
            .from('challenge_participants')
            .insert({
                challenge_id: challengeId,
                user_id: user.user.id,
                status: 'active'
            })
            .select()
            .single();

        if (participationError) {
            logger.error('Error joining challenge:', participationError);
            return { success: false, error: participationError.message };
        }

        // Increment participant count
        await supabase
            .from('challenges')
            .update({ current_participants: challenge.current_participants + 1 })
            .eq('id', challengeId);

        return { success: true, data: participation };
    } catch (error) {
        logger.error('Error in joinChallengeAction:', error);
        return { success: false, error: 'Internal server error' };
    }
}

// Update challenge participation status
export async function updateParticipationAction(
    challengeId: string,
    status: ChallengeParticipant['status'],
    progressData?: any
) {
    try {
        const supabase = await createClient();

        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
            return { success: false, error: 'Not authenticated' };
        }

        const updateData: any = {
            status: status,
            progress_data: progressData || {}
        };

        if (status === 'completed') {
            updateData.completed_at = new Date().toISOString();
            // Trigger reward logic here
        }

        const { data: participation, error: participationError } = await supabase
            .from('challenge_participants')
            .update(updateData)
            .eq('challenge_id', challengeId)
            .eq('user_id', user.user.id)
            .select()
            .single();

        if (participationError) {
            logger.error('Error updating participation:', participationError);
            return { success: false, error: participationError.message };
        }

        return { success: true, data: participation };
    } catch (error) {
        logger.error('Error in updateParticipationAction:', error);
        return { success: false, error: 'Internal server error' };
    }
}

// Check and auto-complete system challenges
export async function checkAutoChallengesAction() {
    try {
        const supabase = await createClient();

        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Get user's active participations, then fetch their challenges separately
        const { data: participations, error: participationsError } = await supabase
            .from('challenge_participants')
            .select('id, challenge_id, status')
            .eq('user_id', user.user.id)
            .eq('status', 'active');

        if (participationsError) {
            logger.error('Error fetching participations for auto-check:', participationsError);
            return { success: false, error: participationsError.message };
        }

        const completedChallenges: string[] = [];

        for (const participation of participations || []) {
            // Get challenge details for verification
            const { data: challenge, error: challengeError } = await supabase
                .from('challenges')
                .select('verification_type, verification_logic, type, owner_name')
                .eq('id', participation.challenge_id)
                .eq('verification_type', 'auto')
                .eq('owner_name', 'System')
                .single();

            if (challengeError || !challenge) continue;

            const verificationLogic = challenge.verification_logic as any;

            if (!verificationLogic?.action || !verificationLogic?.table) {
                continue;
            }

            // Check if user meets challenge criteria
            const { data, error: checkError } = await (supabase as any)
                .from(verificationLogic.table)
                .select('id')
                .eq(verificationLogic.user_id_field, user.user.id);

            const count = data ? data.length : 0;

            if (!checkError && count && count > 0) {
                // Mark as completed
                await updateParticipationAction(participation.challenge_id, 'completed');
                completedChallenges.push(participation.challenge_id);
            }
        }

        return { success: true, data: { completedChallenges } };
    } catch (error) {
        logger.error('Error in checkAutoChallengesAction:', error);
        return { success: false, error: 'Internal server error' };
    }
}

// Create a new user challenge
export async function createChallengeAction(challengeData: {
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
}) {
    try {
        const supabase = await createClient();

        const { data: authUser } = await supabase.auth.getUser();
        if (!authUser.user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Get user details from our users table
        const { data: dbUser, error: userError } = await supabase
            .from('users')
            .select('first_name, username')
            .eq('id', authUser.user.id)
            .single();

        if (userError) {
            logger.error('Error fetching user:', userError);
            return { success: false, error: 'User not found' };
        }

        const ownerName = dbUser?.first_name || dbUser?.username || 'User';

        const { data: challenge, error: challengeError } = await supabase
            .from('challenges')
            .insert({
                ...challengeData,
                owner_id: authUser.user.id,
                owner_name: ownerName,
                type: 'user_created',
                is_active: true,
                current_participants: 0
            })
            .select()
            .single();

        if (challengeError) {
            logger.error('Error creating challenge:', challengeError);
            return { success: false, error: challengeError.message };
        }

        return { success: true, data: challenge };
    } catch (error) {
        logger.error('Error in createChallengeAction:', error);
        return { success: false, error: 'Internal server error' };
    }
}
