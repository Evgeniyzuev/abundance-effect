'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Handle Telegram Widget callback
        const handleTelegramAuth = async (user: any) => {
            try {
                const response = await fetch('/api/auth/telegram-widget', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user),
                });

                const result = await response.json();

                if (result.success && result.password) {
                    const { error } = await supabase.auth.signInWithPassword({
                        email: `telegram_${user.id}@abundance-effect.app`,
                        password: result.password,
                    });

                    if (!error) {
                        router.push('/');
                    }
                }
            } catch (error) {
                console.error('Telegram widget error:', error);
            }
        };

        // Expose function globally for Telegram Widget
        (window as any).handleTelegramAuth = handleTelegramAuth;

        return () => {
            delete (window as any).handleTelegramAuth;
        };
    }, [router, supabase]);

    const handleOAuthLogin = async (provider: 'google') => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
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

    const handleTelegramMiniApp = () => {
        // Check if we're in Telegram WebApp
        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
            const webApp = (window as any).Telegram.WebApp;
            webApp.ready();

            const tgUser = webApp.initDataUnsafe?.user;

            if (tgUser) {
                router.push('/');
                return;
            }
        }

        // Open bot in new tab
        window.open('https://t.me/AbundanceEffectBot', '_blank');
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Welcome to Abundance Effect
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Sign in to start your journey
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Google Button */}
                    <button
                        onClick={() => handleOAuthLogin('google')}
                        disabled={loading}
                        className="group relative flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-lg font-semibold text-black transition-all hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="h-6 w-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    {/* Telegram Widget */}
                    <div className="flex justify-center items-center min-h-[56px] rounded-full bg-white px-6 py-2">
                        <script
                            async
                            src="https://telegram.org/js/telegram-widget.js?22"
                            data-telegram-login="AbundanceEffectBot"
                            data-size="large"
                            data-onauth="handleTelegramAuth(user)"
                            data-request-access="write"
                        />
                    </div>

                    {/* Telegram Mini App Button */}
                    <button
                        onClick={handleTelegramMiniApp}
                        className="group relative flex w-full items-center justify-center gap-3 rounded-full bg-[#24A1DE] px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-[#1F8BBF]"
                    >
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" fill="currentColor" />
                        </svg>
                        <span>Telegram Mini App</span>
                    </button>

                    {/* Apple Button (optional) */}
                    <button
                        disabled
                        className="group relative flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-lg font-semibold text-black opacity-50 cursor-not-allowed"
                    >
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                        </svg>
                        <span>Continue with Apple</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
