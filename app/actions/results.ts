'use server'

import { createClient } from '@/utils/supabase/server'
import { UserResults } from '@/types/supabase'
import { revalidatePath } from 'next/cache'

export type ActionResponse<T = any> = {
    success: boolean
    data?: T
    error?: string
}

export async function fetchResultsAction(): Promise<ActionResponse<UserResults>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('user_results')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            throw error
        }

        if (!data) {
            // Return empty results if not found
            return {
                success: true,
                data: {
                    user_id: user.id,
                    inventory: [],
                    knowledge: [],
                    unlocked_achievements: [],
                    selected_base_id: null,
                    selected_character_id: null,
                    updated_at: new Date().toISOString()
                } as UserResults
            }
        }

        return { success: true, data: data as UserResults }
    } catch (error: any) {
        console.error('Error fetching results:', error)
        return { success: false, error: error.message }
    }
}

export async function updateResultsAction(updates: Partial<UserResults>): Promise<ActionResponse<UserResults>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('user_results')
            .upsert({
                ...updates,
                user_id: user.id,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) throw error

        revalidatePath('/goals')
        return { success: true, data: data as UserResults }
    } catch (error: any) {
        console.error('Error updating results:', error)
        return { success: false, error: error.message }
    }
}
