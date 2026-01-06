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
