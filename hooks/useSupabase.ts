import { useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';

/**
 * Custom hook to access the global Supabase client instance
 * Ensures only one client is created and reused across all components
 */
export function useSupabase() {
    return useMemo(() => createClient(), []);
}
