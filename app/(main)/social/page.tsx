'use client';

import { useUser } from '@/context/UserContext';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { useLevelCheck } from '@/hooks/useLevelCheck';

export default function SocialPage() {
    const { user, session, logout } = useUser();
    const router = useRouter();
    const { t } = useLanguage();
    const supabase = createClient();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const handleLinkIdentity = async (provider: 'google' | 'apple') => {
        // Check if running in Telegram WebApp
        const isTelegram = typeof window !== 'undefined' && !!(window as any).Telegram?.WebApp?.initData;

        if (isTelegram && provider === 'google') {
            alert(t('profile.google_telegram_error') || 'Google linking is not supported in Telegram. Please link Email first, open app in browser, and link Google there.');
            return;
        }

        try {
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            const { data, error } = await supabase.auth.linkIdentity({
                provider,
                options: {
                    redirectTo: `${origin}/auth/callback`,
                },
            });
            if (error) throw error;
            if (data?.url) {
                // Redirect to provider for linking
                window.location.href = data.url;
            }
        } catch (error: any) {
            console.error('Error linking identity:', error);
            alert(`Error linking account: ${error.message || error}`);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="px-6 pt-12 pb-6">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('profile.title')}</h1>
            </div>

            {/* Profile Card */}
            <div className="px-6 mb-8">
                <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center text-center border border-gray-100">
                    <div className="w-24 h-24 bg-white rounded-full mb-4 flex items-center justify-center text-4xl shadow-sm border border-gray-100">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            '👤'
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {user?.first_name || user?.username || 'User'}
                    </h2>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600">
                        {t('profile.level')} {user?.level || 0}
                    </div>
                </div>
            </div>

            {/* Settings List */}
            <div className="flex-1 px-6 space-y-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pl-2">Account</h3>

                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        {user?.username && (
                            <div className="flex justify-between items-center px-4 py-4 border-b border-gray-50 last:border-0">
                                <span className="text-gray-600 font-medium">{t('profile.username')}</span>
                                <span className="text-gray-900 font-semibold">@{user.username}</span>
                            </div>
                        )}
                        {user?.telegram_id && (
                            <div className="flex justify-between items-center px-4 py-4 border-b border-gray-50 last:border-0">
                                <span className="text-gray-600 font-medium">{t('profile.telegram_id')}</span>
                                <span className="text-gray-900 font-semibold">{user.telegram_id}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center px-4 py-4">
                            <span className="text-gray-600 font-medium">{t('profile.reinvest')}</span>
                            <span className="text-green-600 font-bold">{user?.reinvest_setup}%</span>
                        </div>
                    </div>
                </div>

                {/* Referral Section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pl-2">Рефералы</h3>
                    <button
                        onClick={() => router.push('/referral')}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl px-4 py-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="font-semibold">Пригласить друзей</span>
                        </div>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pl-2">{t('profile.linked_accounts')}</h3>
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        {/* Google */}
                        <div className="flex justify-between items-center px-4 py-4 border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-3">
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="text-gray-900 font-medium">Google</span>
                            </div>
                            {session?.user?.identities?.some((id: any) => id.provider === 'google') ? (
                                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    {t('profile.linked')}
                                </span>
                            ) : (
                                <button
                                    onClick={() => handleLinkIdentity('google')}
                                    className="text-blue-600 text-sm font-medium hover:text-blue-700"
                                >
                                    {t('profile.link_account')}
                                </button>
                            )}
                        </div>

                        {/* Apple */}
                        <div className="flex justify-between items-center px-4 py-4 border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-3">
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                <span className="text-gray-900 font-medium">Apple</span>
                            </div>
                            {session?.user?.identities?.some((id: any) => id.provider === 'apple') ? (
                                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    {t('profile.linked')}
                                </span>
                            ) : (
                                <button
                                    onClick={() => handleLinkIdentity('apple')}
                                    className="text-blue-600 text-sm font-medium hover:text-blue-700"
                                >
                                    {t('profile.link_account')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pl-2">{t('profile.language')}</h3>
                    <div className="bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
                        <LanguageSwitcher />
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full rounded-xl bg-red-50 px-4 py-4 text-base font-semibold text-red-600 hover:bg-red-100 transition-colors border border-red-100"
                >
                    {t('auth.logout')}
                </button>
            </div>
        </div>
    );
}
