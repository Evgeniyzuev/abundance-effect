'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { ensureValidSession } from '@/utils/supabase/sessionManager'
import { storage, STORAGE_KEYS, TelegramInitDataCache } from '@/utils/storage'

export type ActionResponse<T = any> = {
    success: boolean
    data?: T
    error?: string
}

/**
 * Attempts to re-authenticate using cached Telegram data
 * Returns true if re-authentication was successful
 */
async function tryReAuthenticate(supabase: any): Promise<boolean> {
    try {
        // Check if we have cached Telegram init data
        const cachedTgData = storage.get<TelegramInitDataCache>(STORAGE_KEYS.TELEGRAM_INIT_DATA);
        if (!cachedTgData) {
            console.log('No cached Telegram data for re-authentication');
            return false;
        }

        // Check cache age (same logic as in UserContext)
        const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
        if (Date.now() - cachedTgData.cached_at > MAX_CACHE_AGE) {
            console.log('Telegram cache data expired');
            return false;
        }

        const tgUser = cachedTgData.user;
        const startParam = storage.get<string>(STORAGE_KEYS.REFERRAL_CODE);

        console.log('Attempting re-authentication with cached Telegram data for user:', tgUser.id);

        // Try to re-authenticate via the API
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/telegram-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                telegramUser: tgUser,
                initData: cachedTgData.initData,
                referrerId: startParam || null,
            }),
        });

        const result = await response.json();

        if (result.success && result.password) {
            const { error } = await supabase.auth.signInWithPassword({
                email: `telegram_${tgUser.id}@abundance-effect.app`,
                password: result.password,
            });

            if (error) {
                console.error('Error re-authenticating:', error);
                return false;
            }

            console.log('Successfully re-authenticated user');
            return true;
        }

        return false;
    } catch (error) {
        console.error('Exception during re-authentication:', error);
        return false;
    }
}

/**
 * Ensures valid authentication, trying to re-authenticate if needed
 * Returns the user object if authenticated, null otherwise
 */
async function ensureAuthenticatedUser(supabase: any): Promise<any> {
    // First try to get current user
    let { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!userError && user) {
        return user;
    }

    // Session might be expired, try to refresh
    const sessionValid = await ensureValidSession(supabase);
    if (sessionValid) {
        const { data: { user: refreshedUser } } = await supabase.auth.getUser();
        if (refreshedUser) {
            return refreshedUser;
        }
    }

    // If still not authenticated, try telegram re-auth
    console.log('Attempting re-authentication due to unauthorized access');
    const reAuthSuccess = await tryReAuthenticate(supabase);

    if (reAuthSuccess) {
        // After re-auth, check user again
        const { data: { user: reAuthedUser } } = await supabase.auth.getUser();
        if (reAuthedUser) {
            return reAuthedUser;
        }
    }

    return null;
}

export async function getUserBalances(userId: string): Promise<ActionResponse<{ walletBalance: number, coreBalance: number, reinvest: number }>> {
    try {
        const supabase = await createClient()
        const user = await ensureAuthenticatedUser(supabase)

        if (!user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('users')
            .select('wallet_balance, aicore_balance, reinvest_setup, level')
            .eq('id', userId)
            .single()

        if (error) throw error

        return {
            success: true,
            data: {
                walletBalance: data.wallet_balance || 0,
                coreBalance: data.aicore_balance || 0,
                reinvest: data.reinvest_setup || 100
            }
        }
    } catch (error: any) {
        console.error('Error fetching balances:', error)
        return { success: false, error: error.message }
    }
}

export async function topUpWalletBalance(amount: number, userId: string): Promise<ActionResponse<{ newBalance: number }>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }



        const { data, error } = await supabase.rpc('top_up_wallet', {
            p_user_id: userId,
            p_amount: amount
        })

        if (error) throw error

        revalidatePath('/wallet')
        return { success: true, data: { newBalance: data } }
    } catch (error: any) {
        console.error('Error topping up wallet:', error)
        return { success: false, error: error.message }
    }
}

export async function transferToCore(amount: number, userId: string): Promise<ActionResponse<{ newWalletBalance: number, newCoreBalance: number }>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        // Get current balances
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('wallet_balance, aicore_balance')
            .eq('id', userId)
            .single()

        if (fetchError) throw fetchError

        if (userData.wallet_balance < amount) {
            return { success: false, error: 'Insufficient wallet balance' }
        }

        // Update balances
        const { data, error } = await supabase
            .from('users')
            .update({
                wallet_balance: userData.wallet_balance - amount,
                aicore_balance: userData.aicore_balance + amount
            })
            .eq('id', userId)
            .select('wallet_balance, aicore_balance, level')
            .single()

        if (error) throw error

        // Log the transfer
        await supabase.from('core_operations').insert({
            user_id: userId,
            amount: amount,
            type: 'transfer'
        })

        // Log the wallet operation
        await supabase.from('wallet_operations').insert({
            user_id: userId,
            amount: -amount, // Negative for outgoing transfer
            type: 'transfer',
            description: 'Transfer to core'
        })

        revalidatePath('/wallet')
        return {
            success: true,
            data: {
                newWalletBalance: data.wallet_balance,
                newCoreBalance: data.aicore_balance
            }
        }
    } catch (error: any) {
        console.error('Error transferring to core:', error)
        return { success: false, error: error.message }
    }
}

export async function debitWalletBalance(amount: number, userId: string): Promise<ActionResponse<{ newBalance: number }>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('wallet_balance')
            .eq('id', userId)
            .single()

        if (fetchError) throw fetchError

        if (userData.wallet_balance < amount) {
            return { success: false, error: 'Insufficient balance' }
        }

        const { data, error } = await supabase
            .from('users')
            .update({ wallet_balance: userData.wallet_balance - amount })
            .eq('id', userId)
            .select('wallet_balance')
            .single()

        if (error) throw error

        // Log the wallet operation
        const { error: logError } = await supabase
            .from('wallet_operations')
            .insert({
                user_id: userId,
                amount: -amount, // Negative for outgoing transaction
                type: 'debit',
                description: 'Wallet debit'
            })

        if (logError) {
            console.error('Error logging debit operation:', logError)
        }

        revalidatePath('/wallet')
        return { success: true, data: { newBalance: data.wallet_balance } }
    } catch (error: any) {
        console.error('Error debiting wallet:', error)
        return { success: false, error: error.message }
    }
}

export async function createPendingDeposit(params: {
    userId: string
    amountUsd: number
    senderAddress: string
    expectedTonValue: number
    sessionId: string
}): Promise<ActionResponse<{ depositId: number }>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        // Check for duplicate session
        const { data: existing } = await supabase
            .from('pending_deposits')
            .select('id')
            .eq('session_id', params.sessionId)
            .single()

        if (existing) {
            return { success: false, error: 'Deposit already initiated' }
        }

        const { data, error } = await supabase
            .from('pending_deposits')
            .insert({
                user_id: params.userId,
                session_id: params.sessionId,
                amount_usd: params.amountUsd,
                sender_address: params.senderAddress,
                expected_ton_value: params.expectedTonValue
            })
            .select('id')
            .single()

        if (error) throw error

        return { success: true, data: { depositId: data.id } }
    } catch (error: any) {
        console.error('Error creating pending deposit:', error)
        return { success: false, error: error.message }
    }
}

export async function updateUserReinvest(userId: string, reinvestPercentage: number): Promise<ActionResponse<void>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { error } = await supabase
            .from('users')
            .update({ reinvest_setup: reinvestPercentage })
            .eq('id', userId)

        if (error) throw error

        revalidatePath('/wallet')
        return { success: true }
    } catch (error: any) {
        console.error('Error updating reinvest:', error)
        return { success: false, error: error.message }
    }
}

export async function getWalletOperations(userId: string): Promise<ActionResponse<any[]>> {
    try {
        const supabase = await createClient()
        const user = await ensureAuthenticatedUser(supabase)

        if (!user) {
            return { success: false, error: 'Unauthorized' }
        }

        // Only allow users to fetch their own history (security check)
        if (user.id !== userId) {
            console.warn(`User ${user.id} tried to access operations for ${userId}`);
            return { success: false, error: 'Access denied' }
        }

        const { data, error } = await supabase
            .from('wallet_operations')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) throw error

        return { success: true, data: data || [] }
    } catch (error: any) {
        console.error('Error fetching wallet operations:', error)
        return { success: false, error: error.message }
    }
}

export async function getCoreOperations(userId: string): Promise<ActionResponse<any[]>> {
    try {
        const supabase = await createClient()
        const user = await ensureAuthenticatedUser(supabase)

        if (!user) {
            return { success: false, error: 'Unauthorized' }
        }

        if (user.id !== userId) {
            return { success: false, error: 'Access denied' }
        }

        const { data, error } = await supabase
            .from('core_operations')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) throw error

        return { success: true, data: data || [] }
    } catch (error: any) {
        console.error('Error fetching core operations:', error)
        return { success: false, error: error.message }
    }
}

