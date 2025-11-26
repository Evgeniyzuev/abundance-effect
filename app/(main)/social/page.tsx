'use client';

import { useUser } from '@/context/UserContext';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';

export default function SocialPage() {
    const { user, logout } = useUser();
    const router = useRouter();
    const { t } = useLanguage();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <div className="flex flex-col h-full bg-white pb-20">
            {/* Header */}
            <div className="px-6 pt-12 pb-6">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('profile.title')}</h1>
            </div>

            {/* Profile Card */}
            <div className="px-6 mb-8">
                <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center text-center border border-gray-100">
                    <div className="w-24 h-24 bg-white rounded-full mb-4 flex items-center justify-center text-4xl shadow-sm border border-gray-100">
                        👤
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {user?.first_name || user?.username || 'User'}
                    </h2>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600">
                        {t('profile.level')} {user?.level ?? 1}
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
