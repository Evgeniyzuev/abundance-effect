'use server';

import { createClient } from '@/utils/supabase/server';
import { Challenge, ChallengeParticipant } from '@/types/supabase';
import { logger } from '@/utils/logger';
import { CHALLENGE_VERIFICATIONS } from '@/utils/challengeVerifications';

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

// Update challenge participation status with verification script execution
export async function updateParticipationAction(
    challengeId: string,
    status: ChallengeParticipant['status'],
    progressData?: any
) {
    try {
        logger.info('updateParticipationAction called:', { challengeId, status });

        const supabase = await createClient();

        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Get challenge details to check verification logic
        const { data: challenge, error: challengeError } = await supabase
            .from('challenges')
            .select('*')
            .eq('id', challengeId)
            .single();

        if (challengeError || !challenge) {
            return { success: false, error: 'Challenge not found' };
        }

        // Get user's current participation
        const { data: participation, error: participationError } = await supabase
            .from('challenge_participants')
            .select('*')
            .eq('challenge_id', challengeId)
            .eq('user_id', user.user.id)
            .single();

        if (participationError || !participation) {
            return { success: false, error: 'Participation not found' };
        }

        // Execute verification if available
        const verificationKey = challenge.verification_logic as string;
        if (status === 'completed' && verificationKey && typeof verificationKey === 'string') {
            logger.info('Executing verification for challenge:', challenge.id);

            // Execute verification
            const isVerified = await executeVerification(verificationKey, {
                userId: user.user.id,
                challengeData: challenge,
                supabase,
                progressData: progressData || participation.progress_data
            });

            logger.info('Verification result:', isVerified);

            if (!isVerified) {
                return { success: false, error: 'Verification failed. Challenge requirements not met.' };
            }
        }

        const updateData: any = {
            status: status,
            progress_data: progressData || participation.progress_data || {}
        };

        if (status === 'completed') {
            updateData.completed_at = new Date().toISOString();
            // Award rewards to user
            await awardChallengeRewards(user.user.id, challenge);
        }

        const { data: updatedParticipation, error: updateError } = await supabase
            .from('challenge_participants')
            .update(updateData)
            .eq('id', participation.id)
            .select()
            .single();

        if (updateError) {
            logger.error('Error updating participation:', updateError);
            return { success: false, error: updateError.message };
        }

        return { success: true, data: updatedParticipation };
    } catch (error) {
        logger.error('Error in updateParticipationAction:', error);
        return { success: false, error: 'Internal server error' };
    }
}



// Execute verification using predefined handlers
async function executeVerification(verificationKey: string, context: {
    userId: string;
    challengeData: any;
    supabase: any;
    progressData?: any;
}) {
    try {
        logger.info('executeVerification called:', {
            verificationKey,
            userId: context.userId,
            challengeId: context.challengeData?.id
        });

        const verification = CHALLENGE_VERIFICATIONS[verificationKey];
        if (!verification) {
            logger.error('Unknown verification key:', verificationKey);
            return false;
        }

        logger.info('Running verification:', verification.description);

        const result = await verification.verify(
            context.userId,
            context.challengeData,
            context.supabase,
            context.progressData
        );

        logger.info('Verification result:', result);
        return result;
    } catch (error) {
        logger.error('Error executing verification:', error);
        logger.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
        return false;
    }
}

// Award challenge rewards to user
async function awardChallengeRewards(userId: string, challenge: any) {
    try {
        const supabase = await createClient();

        // Get current user balance
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('wallet_balance, aicore_balance')
            .eq('id', userId)
            .single();

        if (userError || !user) {
            logger.error('Error fetching user for rewards:', userError);
            return;
        }

        let coreRewardAmount = 0;
        let newWalletBalance = user.wallet_balance || 0;
        let newAiCoreBalance = user.aicore_balance || 0;

        // Parse core reward - expected format like "1$" (core tokens) or "1$+?" (guaranteed + random core)
        const rewardCore = challenge.reward_core;
        if (typeof rewardCore === 'string') {
            // Parse simple string format "1$" or "1$+?"
            const coreMatch = rewardCore.match(/^(\d+)\$/) || rewardCore.match(/^(\d+)\$\+\?/);
            if (coreMatch) {
                coreRewardAmount = parseInt(coreMatch[1], 10);
                const isRandom = rewardCore.includes('+?');

                // "1$" recipient - core tokens go to aicore_balance
                // Random portion splits between wallets
                if (isRandom) {
                    // Split: guaranteed goes to aicore, random split
                    newAiCoreBalance += Math.floor(coreRewardAmount * 0.7); // guaranteed core tokens
                    newWalletBalance += coreRewardAmount - Math.floor(coreRewardAmount * 0.7); // random fiat bonus
                } else {
                    // "1$" = guaranteed core tokens -> aicore_balance
                    newAiCoreBalance += coreRewardAmount;
                }
            }
        }

        // Update user balances and return updated user data
        let updatedUser = null;
        if (coreRewardAmount > 0) {
            const { data: userUpdateData, error: updateError } = await supabase
                .from('users')
                .update({
                    wallet_balance: newWalletBalance,
                    aicore_balance: newAiCoreBalance
                })
                .eq('id', userId)
                .select('wallet_balance, aicore_balance, level')
                .single();

            if (updateError) {
                logger.error('Error updating user balances:', updateError);
            } else {
                updatedUser = userUpdateData;
            }
        }

        // Handle item rewards
        const itemRewards = challenge.reward_items as any[];
        if (itemRewards && itemRewards.length > 0) {
            // Get current user inventory
            const { data: userResults, error: resultsError } = await supabase
                .from('user_results')
                .select('inventory')
                .eq('user_id', userId)
                .single();

            let currentInventory = userResults?.inventory || [];

            // Add items to inventory
            for (const item of itemRewards) {
                const existingItemIndex = currentInventory.findIndex(
                    (inv: any) => inv.itemId === item.id && inv.slot === item.slot
                );

                if (existingItemIndex >= 0) {
                    // Update existing item count
                    currentInventory[existingItemIndex].count += item.count || 1;
                } else {
                    // Add new item
                    currentInventory.push({
                        slot: item.slot,
                        itemId: item.id,
                        count: item.count || 1
                    });
                }
            }

            // Update or insert user results
            if (userResults) {
                await supabase
                    .from('user_results')
                    .update({ inventory: currentInventory })
                    .eq('user_id', userId);
            } else {
                await supabase
                    .from('user_results')
                    .insert({
                        user_id: userId,
                        inventory: currentInventory
                    });
            }
        }

        // Log the reward transaction
        if (coreRewardAmount > 0 || (itemRewards && itemRewards.length > 0)) {
            logger.info('Challenge rewards awarded:', {
                userId,
                challengeId: challenge.id,
                coreReward: coreRewardAmount,
                itemRewards: itemRewards?.length || 0
            });
        }
    } catch (error) {
        logger.error('Error awarding challenge rewards:', error);
    }
}

// Delete challenge function (for testing/admin purposes)
export async function deleteChallengeAction(challengeId: string) {
    try {
        const supabase = await createClient();

        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Get challenge to check ownership
        const { data: challenge, error: challengeError } = await supabase
            .from('challenges')
            .select('owner_id, type')
            .eq('id', challengeId)
            .single();

        if (challengeError || !challenge) {
            return { success: false, error: 'Challenge not found' };
        }

        // Only allow owner or system challenges to be deleted by admins
        if (challenge.owner_id !== user.user.id && challenge.type !== 'system') {
            return { success: false, error: 'Not authorized to delete this challenge' };
        }

        // Delete participations first (cascade will handle this, but let's be explicit)
        await supabase
            .from('challenge_participants')
            .delete()
            .eq('challenge_id', challengeId);

        // Delete the challenge
        const { error: deleteError } = await supabase
            .from('challenges')
            .delete()
            .eq('id', challengeId);

        if (deleteError) {
            logger.error('Error deleting challenge:', deleteError);
            return { success: false, error: deleteError.message };
        }

        return { success: true };
    } catch (error) {
        logger.error('Error in deleteChallengeAction:', error);
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
