'use server'

import { createClient } from '@/utils/supabase/server'
import { AvatarSettings } from '@/types'
import { revalidatePath } from 'next/cache'

export type ActionResponse<T = any> = {
    success: boolean
    data?: T
    error?: string
}

/**
 * Fetch avatar settings for the current user
 */
export async function getAvatarSettingsAction(): Promise<ActionResponse<AvatarSettings>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('avatar_settings')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (error) {
            // If not found, it might be the first time. 
            // The trigger should have created it if there was a balance increase,
            // but for a new user we might need to return default or empty.
            if (error.code === 'PGRST116') {
                return { success: true, data: null as any }
            }
            throw error
        }

        return { success: true, data: data as AvatarSettings }
    } catch (error: any) {
        console.error('Error fetching avatar settings:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Update avatar settings (base type, style, photo)
 */
export async function updateAvatarSettingsAction(settings: Partial<AvatarSettings>): Promise<ActionResponse<AvatarSettings>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('avatar_settings')
            .upsert({
                ...settings,
                user_id: user.id,
                updated_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) throw error

        revalidatePath('/ai')
        return { success: true, data: data as AvatarSettings }
    } catch (error: any) {
        console.error('Error updating avatar settings:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Spend virtual avatar wallet (for generation etc.)
 */
export async function spendAvatarWalletAction(amount: number): Promise<ActionResponse<boolean>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase.rpc('spend_avatar_wallet', {
            p_user_id: user.id,
            p_amount: amount
        })

        if (error) throw error

        if (!data) {
            return { success: false, error: 'Insufficient virtual funds' }
        }

        revalidatePath('/ai')
        return { success: true, data: true }
    } catch (error: any) {
        console.error('Error spending avatar wallet:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Generate Vision Image (Stub for now)
 */
export async function generateVisionImageAction(wishId?: string, customDescription?: string): Promise<ActionResponse<{ imageUrl: string }>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        // 1. Check virtual balance (Cost: 1000 Virtual USD)
        const COST = 1000;
        const spendResult = await spendAvatarWalletAction(COST);
        if (!spendResult.success) {
            return { success: false, error: spendResult.error }
        }

        // 2. Fetch required data (Avatar settings + Wish)
        // [WIP: Integration with Nano Banana or Replicate]

        // Mocking delay and result
        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            success: true,
            data: {
                imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea206f9c45?w=500&q=80'
            }
        }
    } catch (error: any) {
        console.error('Error generating vision:', error)
        return { success: false, error: error.message }
    }
}
