'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export default function LoginPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (provider: string) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider as any,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Error logging in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight">
                        Welcome to Abundance Effect
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Sign in to start your journey
                    </p>
                </div>
                <div className="mt-8 space-y-4">
                    <button
                        onClick={() => handleLogin('google')}
                        disabled={loading}
                        className="group relative flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-50"
                    >
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
}
