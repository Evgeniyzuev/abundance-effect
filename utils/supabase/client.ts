import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | undefined

export function createClient(): SupabaseClient {
    // Always return the same instance
    if (client) {
        return client
    }

    client = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
                flowType: 'pkce' as any,
            }
        }
    )

    return client
}

// Export for direct access if needed
export function getClient(): SupabaseClient | undefined {
    return client
}

// Re-export createClient as getOrCreateClient for clarity
export function getOrCreateClient(): SupabaseClient {
    return createClient()
}
