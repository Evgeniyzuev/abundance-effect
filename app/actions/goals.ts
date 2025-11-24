'use server'

import { createClient } from '@/utils/supabase/server'
import { UserWish, RecommendedWish } from '@/types/supabase'
import { revalidatePath } from 'next/cache'

export type ActionResponse<T = any> = {
    success: boolean
    data?: T
    error?: string
}

export async function fetchWishesAction(): Promise<ActionResponse<{ wishes: UserWish[], recommended: RecommendedWish[] }>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const [wishesResult, recommendedResult] = await Promise.all([
            supabase.from('user_wishes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
            supabase.from('recommended_wishes').select('*').order('created_at', { ascending: false })
        ])

        if (wishesResult.error) throw wishesResult.error
        if (recommendedResult.error) throw recommendedResult.error

        return {
            success: true,
            data: {
                wishes: wishesResult.data as UserWish[],
                recommended: recommendedResult.data as RecommendedWish[]
            }
        }
    } catch (error: any) {
        console.error('Error fetching wishes:', error)
        return { success: false, error: error.message }
    }
}

export async function addWishAction(wishData: Partial<UserWish>): Promise<ActionResponse<UserWish>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('user_wishes')
            .insert({
                ...wishData,
                user_id: user.id,
                is_completed: false
            })
            .select()
            .single()

        if (error) throw error

        revalidatePath('/goals')
        return { success: true, data: data as UserWish }
    } catch (error: any) {
        console.error('Error adding wish:', error)
        return { success: false, error: error.message }
    }
}

export async function updateWishAction(id: string, updates: Partial<UserWish>): Promise<ActionResponse<UserWish>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('user_wishes')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id) // Security check
            .select()
            .single()

        if (error) throw error

        revalidatePath('/goals')
        return { success: true, data: data as UserWish }
    } catch (error: any) {
        console.error('Error updating wish:', error)
        return { success: false, error: error.message }
    }
}

export async function deleteWishAction(id: string): Promise<ActionResponse<void>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { error } = await supabase
            .from('user_wishes')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id) // Security check

        if (error) throw error

        revalidatePath('/goals')
        return { success: true }
    } catch (error: any) {
        console.error('Error deleting wish:', error)
        return { success: false, error: error.message }
    }
}
