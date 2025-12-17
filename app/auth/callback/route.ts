import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'
    const ref = searchParams.get('ref')

    let error: any;

    if (code) {
        const supabase = await createClient()
        const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code)
        error = exchangeError;
        if (!error && data.user) {
            // If there's a referral code, update both metadata and public.users table
            if (ref) {
                // Update auth metadata
                const { error: updateError } = await supabase.auth.updateUser({
                    data: { referrer_id: ref }
                })
                if (updateError) {
                    console.error('Error updating referrer_id in metadata:', updateError)
                }

                // Update public.users table directly (only if referrer_id is not already set)
                const { error: dbError } = await supabase
                    .from('users')
                    .update({ referrer_id: ref })
                    .eq('id', data.user.id)
                    .is('referrer_id', null)

                if (dbError) {
                    console.error('Error updating referrer_id in public.users:', dbError)
                }
            }

            // Check user's aicore_balance to determine redirect destination
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('aicore_balance')
                .eq('id', data.user.id)
                .single()

            let redirectUrl = next; // Default redirect

            if (!userError && userData) {
                // If user has no core (aicore_balance = 0), redirect to core-creation
                if (userData.aicore_balance === 0) {
                    redirectUrl = '/core-creation';
                } else {
                    // If user already has core, redirect to challenges
                    redirectUrl = '/challenges';
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${redirectUrl}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${redirectUrl}`)
            } else {
                return NextResponse.redirect(`${origin}${redirectUrl}`)
            }
        }
    }

    // return the user to an error page with instructions
    const errorMessage = error?.message || 'Authentication failed';
    const errorUrl = `${origin}/auth/auth-code-error?error=server_error&error_code=unexpected_failure&error_description=${encodeURIComponent(errorMessage)}`;
    return NextResponse.redirect(errorUrl)
}
