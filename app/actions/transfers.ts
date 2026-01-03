'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Contact {
    id: string
    username: string | null
    first_name: string | null
    last_name: string | null
    avatar_url: string | null
    level: number
    type: 'lead' | 'team'
}

export async function getTransferContacts() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Unauthorized' }
    }

    // Get current user's lead
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('referrer_id')
        .eq('id', user.id)
        .single()

    if (userError || !userData) {
        return { success: false, error: 'User not found' }
    }

    const contacts: Contact[] = []

    if (userData.referrer_id) {
        const { data: leadData, error: leadError } = await supabase
            .from('users')
            .select('id, username, first_name, last_name, avatar_url, level')
            .eq('id', userData.referrer_id)
            .single()

        if (!leadError && leadData) {
            contacts.push({
                ...leadData,
                type: 'lead'
            })
        }
    }

    return { success: true, data: contacts }
}

export async function sendP2PTransfer(toUserId: string, amount: number, comment?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Unauthorized' }
    }

    if (amount <= 0) {
        return { success: false, error: 'Invalid amount' }
    }

    const { error } = await supabase.rpc('execute_p2p_transfer', {
        p_sender_id: user.id,
        p_receiver_id: toUserId,
        p_amount: amount,
        p_comment: comment
    })

    if (error) {
        console.error('Transfer error:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/wallet')
    return { success: true }
}
