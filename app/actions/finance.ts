'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type ActionResponse<T = any> = {
    success: boolean
    data?: T
    error?: string
}

export async function getUserBalances(userId: string): Promise<ActionResponse<{ walletBalance: number, coreBalance: number, reinvest: number }>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('users')
            .select('wallet_balance, aicore_balance, reinvest_setup')
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
            .select('wallet_balance, aicore_balance')
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
