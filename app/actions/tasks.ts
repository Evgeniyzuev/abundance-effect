'use server'

import { createClient } from '@/utils/supabase/server'
import { PersonalTask } from '@/types/supabase'
import { revalidatePath } from 'next/cache'

export type ActionResponse<T = unknown> = {
    success: boolean
    data?: T
    error?: string
}

export async function fetchTasksAction(): Promise<ActionResponse<PersonalTask[]>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('personal_tasks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) throw error

        return {
            success: true,
            data: data as PersonalTask[]
        }
    } catch (error: unknown) {
        console.error('Error fetching tasks:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function addTaskAction(taskData: Partial<PersonalTask>): Promise<ActionResponse<PersonalTask>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('personal_tasks')
            .insert({
                ...taskData,
                user_id: user.id,
                status: 'active'
            })
            .select()
            .single()

        if (error) throw error

        revalidatePath('/goals')
        return { success: true, data: data as PersonalTask }
    } catch (error: unknown) {
        console.error('Error adding task:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function updateTaskAction(id: string, updates: Partial<PersonalTask>): Promise<ActionResponse<PersonalTask>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('personal_tasks')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id) // Security check
            .select()
            .single()

        if (error) throw error

        revalidatePath('/goals')
        return { success: true, data: data as PersonalTask }
    } catch (error: unknown) {
        console.error('Error updating task:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function deleteTaskAction(id: string): Promise<ActionResponse<void>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { error } = await supabase
            .from('personal_tasks')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id) // Security check

        if (error) throw error

        revalidatePath('/goals')
        return { success: true }
    } catch (error: unknown) {
        console.error('Error deleting task:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function completeTaskAction(id: string): Promise<ActionResponse<PersonalTask>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        // Fetch the task first
        const { data: task, error: fetchError } = await supabase
            .from('personal_tasks')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (fetchError || !task) {
            throw new Error('Task not found')
        }

        const now = new Date().toISOString()
        const updates: Partial<PersonalTask> = {
            last_completed_at: now
        }

        if (task.type === 'one_time') {
            updates.status = 'completed'
            updates.progress_percentage = 100
        } else if (task.type === 'streak' && task.streak_goal) {
            const newCurrent = (task.streak_current || 0) + 1
            updates.streak_current = newCurrent
            updates.progress_percentage = Math.round((newCurrent / task.streak_goal) * 100)

            if (newCurrent >= task.streak_goal) {
                updates.status = 'completed'
            }
        } else if (task.type === 'daily') {
            const newCurrent = (task.streak_current || 0) + 1
            updates.streak_current = newCurrent
        }

        const { data, error } = await supabase
            .from('personal_tasks')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) throw error

        revalidatePath('/goals')
        return { success: true, data: data as PersonalTask }
    } catch (error: unknown) {
        console.error('Error completing task:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function markDayCompletedAction(id: string, date: string): Promise<ActionResponse<PersonalTask>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        // Fetch the task first
        const { data: task, error: fetchError } = await supabase
            .from('personal_tasks')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (fetchError || !task) {
            throw new Error('Task not found')
        }

        // Get current completions array
        const completions = (task.daily_completions as string[]) || []

        // Check if date already marked
        if (completions.includes(date)) {
            return { success: true, data: task as PersonalTask }
        }

        // Add new date
        const newCompletions = [...completions, date]
        const newCurrent = newCompletions.length

        const updates: Partial<PersonalTask> = {
            daily_completions: newCompletions as string[],
            streak_current: newCurrent,
            last_completed_at: new Date().toISOString()
        }

        // For streak tasks, update progress and check if goal reached
        if (task.type === 'streak' && task.streak_goal) {
            updates.progress_percentage = Math.round((newCurrent / task.streak_goal) * 100)

            if (newCurrent >= task.streak_goal) {
                updates.status = 'completed'
            }
        }

        const { data, error } = await supabase
            .from('personal_tasks')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) throw error

        revalidatePath('/goals')
        return { success: true, data: data as PersonalTask }
    } catch (error: unknown) {
        console.error('Error marking day completed:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

