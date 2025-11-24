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

        if (error) {
            logger.error('Error getting session:', error);

            // Try to refresh session
            logger.info('Attempting to refresh session after error...');
            const { data: { session: newSession }, error: refreshError } = await supabaseClient.auth.refreshSession();

            if (refreshError || !newSession) {
                logger.error('Failed to refresh session:', refreshError);
                return false;
            }

            logger.info('Session refreshed successfully after error');
            return true;
        }

        if (!session) {
            logger.warn('No active session found');
            return false;
        }

        // Check if session is about to expire (within 5 minutes)
        const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;
        const FIVE_MINUTES = 5 * 60 * 1000;

        logger.info('Session status:', {
            expiresAt: new Date(expiresAt).toISOString(),
            timeUntilExpiry: Math.round(timeUntilExpiry / 1000) + 's',
            needsRefresh: timeUntilExpiry < FIVE_MINUTES
        });

        // If session expires in less than 5 minutes, refresh it
        if (timeUntilExpiry < FIVE_MINUTES) {
            logger.info('Session expiring soon, refreshing...');
            const { data: { session: newSession }, error: refreshError } = await supabaseClient.auth.refreshSession();

            if (refreshError || !newSession) {
                logger.error('Failed to refresh session:', refreshError);
                return false;
            }

            logger.info('Session refreshed successfully');
            return true;
        }

        return true;
    } catch (err) {
        logger.error('Unexpected error in ensureValidSession:', err);
        return false;
    }
}

/**
 * Wrapper for database operations that ensures valid session before execution
 * @param supabaseClient - The Supabase client instance
 * @param operation - The async operation to perform
 * @param onSessionExpired - Optional callback when session is invalid
 * @returns Result of the operation or null if session is invalid
 */
export async function withValidSession<T>(
    supabaseClient: SupabaseClient,
    operation: () => Promise<T>,
    onSessionExpired?: () => void
): Promise<T | null> {
    // First attempt: Ensure session is valid before starting
    const isValid = await ensureValidSession(supabaseClient);

    if (!isValid) {
        logger.error('Session validation failed, operation aborted');
        onSessionExpired?.();
        return null;
    }

    try {
        return await operation();
    } catch (err: any) {
        logger.warn('Operation failed, attempting retry with fresh session...', err);

        // If operation fails, try to force refresh session and retry once
        const { data: { session }, error: refreshError } = await supabaseClient.auth.refreshSession();

        if (refreshError || !session) {
            logger.error('Failed to refresh session during retry:', refreshError);
            onSessionExpired?.();
            return null;
        }

        try {
            logger.info('Retrying operation with fresh session...');
            return await operation();
        } catch (retryErr) {
            logger.error('Retry failed:', retryErr);
            throw retryErr;
        }
    }
}
