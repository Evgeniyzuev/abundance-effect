'use server';

import { createClient } from '@/utils/supabase/server';
import { logger } from '@/utils/logger';

export async function submitAppReviewAction(reviewData: {
    tested_functions: string;
    errors_found?: string;
    suggestions?: string;
    ai_thoughts?: string;
    personal_usage_needs?: string;
    rating?: number;
}) {
    const supabase = await createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('app_reviews')
            .insert({
                user_id: user.id,
                ...reviewData
            })
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        logger.error('Error submitting app review:', error);
        return { success: false, error: error.message };
    }
}

export async function getAppReviewsAction() {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('app_reviews')
            .select(`
                *,
                user_profiles:user_id (
                    display_name,
                    avatar_url
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        logger.error('Error fetching app reviews:', error);
        return { success: false, error: error.message };
    }
}
