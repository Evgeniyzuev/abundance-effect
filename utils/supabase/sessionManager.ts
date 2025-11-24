import { SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';

/**
 * Ensures the Supabase client has a valid session
 * Refreshes the session if expired or about to expire
 * @param supabaseClient - The Supabase client instance
 * @returns true if session is valid, false otherwise
 */
export async function ensureValidSession(supabaseClient: SupabaseClient): Promise<boolean> {
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();

        if (error || !session) {
            // Try to refresh session
            const { data: { session: newSession }, error: refreshError } = await supabaseClient.auth.refreshSession();

            if (refreshError || !newSession) {
                return false;
            }
            return true;
        }

        // Check if session is about to expire (within 5 minutes)
        const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;
        const FIVE_MINUTES = 5 * 60 * 1000;

        // If session expires in less than 5 minutes, refresh it
        if (timeUntilExpiry < FIVE_MINUTES) {
            const { data: { session: newSession }, error: refreshError } = await supabaseClient.auth.refreshSession();

            if (refreshError || !newSession) {
                return false;
            }
            return true;
        }

        return true;
    } catch (err) {
        logger.error('Unexpected error in ensureValidSession:', err);
        return false;
    }
}
