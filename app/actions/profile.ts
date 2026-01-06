'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { UserProfile } from '@/types';

/**
 * Fetches a user profile by ID.
 * Returns null if the profile doesn't exist yet.
 */
export async function getUserProfileAction(userId: string) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
            console.error('Error fetching user profile:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data: data as UserProfile | null };
    } catch (error: any) {
        console.error('Unexpected error fetching user profile:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetches public info for any user (from users and user_profiles tables).
 */
export async function getPublicUserProfileAction(userId: string) {
    const supabase = await createClient();

    try {
        // Fetch base user info
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, first_name, last_name, username, avatar_url, level, created_at')
            .eq('id', userId)
            .single();

        if (userError) throw userError;

        // Fetch profile info
        const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        // profileError is okay if it's "not found"
        const profile = profileError ? null : profileData;

        return {
            success: true,
            data: {
                user: userData,
                profile: profile as UserProfile | null
            }
        };
    } catch (error: any) {
        console.error('Error fetching public user profile:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Updates or creates a user profile.
 */
export async function updateUserProfileAction(data: Partial<UserProfile>) {
    const supabase = await createClient();

    // Get current user session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const profileData = {
            ...data,
            user_id: user.id,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('user_profiles')
            .upsert(profileData, { onConflict: 'user_id' });

        if (error) {
            console.error('Error updating user profile:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/social');
        return { success: true };
    } catch (error: any) {
        console.error('Unexpected error updating user profile:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Updates basic user info in the 'users' table (names, avatar_url).
 */
export async function updateBasicInfoAction(data: { first_name?: string; last_name?: string; avatar_url?: string }) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const { error } = await supabase
            .from('users')
            .update(data)
            .eq('id', user.id);

        if (error) {
            console.error('Error updating basic info:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/social');
        return { success: true };
    } catch (error: any) {
        console.error('Unexpected error updating basic info:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Searches for users by username or name.
 */
export async function searchUsersAction(query: string) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, first_name, last_name, username, avatar_url, level')
            .or(`username.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
            .limit(10);

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error searching users:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetches manual contacts for the current user.
 */
export async function getContactsAction() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
        const { data, error } = await supabase
            .from('user_contacts')
            .select(`
                contact_id,
                users:contact_id (
                    id, first_name, last_name, username, avatar_url, level
                )
            `)
            .eq('owner_id', user.id);

        if (error) throw error;

        // Flatten the relationship result
        const contacts = data.map((item: any) => item.users);
        return { success: true, data: contacts };
    } catch (error: any) {
        console.error('Error fetching contacts:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Adds a contact to the current user's list.
 */
export async function addContactAction(contactId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    if (user.id === contactId) return { success: false, error: 'Cannot add yourself' };

    try {
        const { error } = await supabase
            .from('user_contacts')
            .insert({ owner_id: user.id, contact_id: contactId });

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error('Error adding contact:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Removes a contact from the current user's list.
 */
export async function removeContactAction(contactId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
        const { error } = await supabase
            .from('user_contacts')
            .delete()
            .eq('owner_id', user.id)
            .eq('contact_id', contactId);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error('Error removing contact:', error);
        return { success: false, error: error.message };
    }
}
