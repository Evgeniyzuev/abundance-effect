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
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-ios-primary">{t('profile.title')}</h1>

            {/* Profile Info */}
            <div className="ios-card overflow-hidden">
                <div className="px-6 py-8 flex flex-col items-center border-b border-gray-100">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-3xl">
                        👤
                    </div>
                    <h2 className="text-xl font-bold text-ios-primary">
                        {user?.first_name || user?.username || 'User'}
                    </h2>
                    <p className="text-ios-secondary text-sm">{t('profile.level')} {user?.level ?? 1}</p>
                </div>

                <div className="p-0">
                    {user?.username && (
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-50 last:border-0">
                            <span className="text-ios-secondary">{t('profile.username')}</span>
                            <span className="text-ios-primary font-medium">@{user.username}</span>
                        </div>
                    )}
                    {user?.telegram_id && (
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-50 last:border-0">
                            <span className="text-ios-secondary">{t('profile.telegram_id')}</span>
                            <span className="text-ios-primary font-medium">{user.telegram_id}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center px-6 py-4">
                        <span className="text-ios-secondary">{t('profile.reinvest')}</span>
                        <span className="text-green-600 font-medium">{user?.reinvest_setup}%</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <LanguageSwitcher />
            </div>

            <button
                onClick={handleLogout}
                className="w-full rounded-xl bg-red-50 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
                {t('auth.logout')}
            </button>
        </div>
    );
}
