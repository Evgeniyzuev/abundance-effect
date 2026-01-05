'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createInvoice(data: {
    amount: number
    title: string
    description?: string
    itemId?: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Unauthorized' }
    }

    const { data: invoice, error } = await supabase
        .from('invoices')
        .insert({
            seller_id: user.id,
            amount: data.amount,
            title: data.title,
            description: data.description,
            payload: data.itemId ? { itemId: data.itemId } : {}
        })
        .select()
        .single()

    if (error) {
        console.error('Create invoice error:', error)
        return { success: false, error: error.message }
    }

    return { success: true, data: invoice }
}

export async function getInvoice(id: string) {
    const supabase = await createClient()

    // We can fetch by ID without auth because policies allow it
    const { data: invoice, error } = await supabase
        .from('invoices')
        .select(`
            *,
            seller:users!seller_id (
                id,
                username,
                first_name,
                last_name,
                avatar_url
            )
        `)
        .eq('id', id)
        .single()

    if (error) {
        return { success: false, error: 'Invoice not found' }
    }

    return { success: true, data: invoice }
}

export async function payInvoiceInternal(invoiceId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Please login to pay' }
    }

    const { error } = await supabase.rpc('complete_invoice_payment', {
        p_invoice_id: invoiceId,
        p_buyer_id: user.id
    })

    if (error) {
        console.error('Payment error:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/wallet')
    revalidatePath(`/pay/${invoiceId}`)

    return { success: true }
}
