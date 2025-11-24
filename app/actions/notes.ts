'use server'

import { createClient } from '@/utils/supabase/server'
import { UserNote, CustomList } from '@/types/supabase'
import { revalidatePath } from 'next/cache'

export type ActionResponse<T = any> = {
    success: boolean
    data?: T
    error?: string
}

export async function fetchNotesAction(): Promise<ActionResponse<{ notes: UserNote[], lists: CustomList[] }>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const [notesResult, listsResult] = await Promise.all([
            supabase.from('user_notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
            supabase.from('custom_lists').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        ])

        if (notesResult.error) throw notesResult.error
        if (listsResult.error) throw listsResult.error

        return {
            success: true,
            data: {
                notes: notesResult.data as UserNote[],
                lists: listsResult.data as CustomList[]
            }
        }
    } catch (error: any) {
        console.error('Error fetching notes:', error)
        return { success: false, error: error.message }
    }
}

export async function addNoteAction(noteData: Partial<UserNote>): Promise<ActionResponse<UserNote>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('user_notes')
            .insert({
                ...noteData,
                user_id: user.id,
                is_completed: false
            })
            .select()
            .single()

        if (error) throw error

        revalidatePath('/goals')
        return { success: true, data: data as UserNote }
    } catch (error: any) {
        console.error('Error adding note:', error)
        return { success: false, error: error.message }
    }
}

export async function updateNoteAction(id: string, updates: Partial<UserNote>): Promise<ActionResponse<UserNote>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('user_notes')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) throw error

        revalidatePath('/goals')
        return { success: true, data: data as UserNote }
    } catch (error: any) {
        console.error('Error updating note:', error)
        return { success: false, error: error.message }
    }
}

export async function deleteNoteAction(id: string): Promise<ActionResponse<void>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { error } = await supabase
            .from('user_notes')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) throw error

        revalidatePath('/goals')
        return { success: true }
    } catch (error: any) {
        console.error('Error deleting note:', error)
        return { success: false, error: error.message }
    }
}

export async function addListAction(listData: Partial<CustomList>): Promise<ActionResponse<CustomList>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('custom_lists')
            .insert({
                ...listData,
                user_id: user.id
            })
            .select()
            .single()

        if (error) throw error

        revalidatePath('/goals')
        return { success: true, data: data as CustomList }
    } catch (error: any) {
        console.error('Error adding list:', error)
        return { success: false, error: error.message }
    }
}

export async function updateListAction(id: string, updates: Partial<CustomList>): Promise<ActionResponse<CustomList>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('custom_lists')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) throw error

        revalidatePath('/goals')
        return { success: true, data: data as CustomList }
    } catch (error: any) {
        console.error('Error updating list:', error)
        return { success: false, error: error.message }
    }
}

export async function deleteListAction(id: string): Promise<ActionResponse<void>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { error } = await supabase
            .from('custom_lists')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) throw error

        revalidatePath('/goals')
        return { success: true }
    } catch (error: any) {
        console.error('Error deleting list:', error)
        return { success: false, error: error.message }
    }
}
