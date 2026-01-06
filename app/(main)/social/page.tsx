'use client';

import { useUser } from '@/context/UserContext';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import NotificationBell from '@/components/NotificationBell';
import Image from 'next/image';
import Link from 'next/link';
import { User as UserIcon, Settings, LogOut, ChevronRight, Share2, Instagram, Globe, MessageCircle, Edit2, Shield, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserProfileAction } from '@/app/actions/profile';
import { UserProfile } from '@/types';
import EditProfileModal from '@/components/profile/EditProfileModal';
import ContactsTab from '@/components/social/ContactsTab';

export default function SocialPage() {
    const { user, session, logout } = useUser();
    const router = useRouter();
    const { t } = useLanguage();
    const supabase = createClient();

    const [activeTab, setActiveTab] = useState<'profile' | 'contacts'>('profile');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const loadProfile = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        const result = await getUserProfileAction(user.id);
        if (result.success && result.data) {
            setProfile(result.data);
        }
        setLoading(false);
    }, [user?.id]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const handleLinkIdentity = async (provider: 'google' | 'apple') => {
        const isTelegram = typeof window !== 'undefined' && !!(window as any).Telegram?.WebApp?.initData;

        if (isTelegram && provider === 'google') {
            alert(t('profile.google_telegram_error') || 'Google linking is not supported in Telegram.');
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
                window.location.href = data.url;
            }
        } catch (error: any) {
            console.error('Error linking identity:', error);
            alert(`Error linking account: ${error.message || error}`);
        }
    };

    return (
        <div className="flex flex-col min-h-full bg-white">
            {/* Top Navigation Tabs */}
            <div className="fixed top-0 left-0 right-0 z-[60] bg-white border-b border-gray-100 pt-safe">
                <div className="flex justify-center items-center h-14">
                    <div className="bg-gray-100 p-1 rounded-2xl flex space-x-1 w-64">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 ${activeTab === 'profile' ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-900"
                                }`}
                        >
                            {t('social.profile')}
                        </button>
                        <button
                            onClick={() => setActiveTab('contacts')}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 ${activeTab === 'contacts' ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-900"
                                }`}
                        >
                            {t('social.contacts')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 mt-14 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {activeTab === 'profile' ? (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gray-50 min-h-full pb-24"
                        >
                            {/* Profile Header */}
                            <div className="relative pt-8 pb-10 px-6 bg-white border-b border-gray-100 mb-6">
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <div className="w-28 h-28 rounded-full border-4 border-gray-50 shadow-xl overflow-hidden bg-gray-100 flex items-center justify-center text-4xl">
                                            {user?.avatar_url ? (
                                                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                '👤'
                                            )}
                                        </div>
                                        <button
                                            onClick={() => setIsEditModalOpen(true)}
                                            className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </div>

                                    <h1 className="mt-4 text-2xl font-black text-gray-900 tracking-tight">
                                        {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username : 'User'}
                                    </h1>

                                    {user?.username && (
                                        <p className="text-gray-400 font-medium text-sm">@{user.username}</p>
                                    )}

                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">
                                            {t('profile.level')} {user?.level || 0}
                                        </span>
                                        <NotificationBell />
                                    </div>

                                    {profile?.bio && (
                                        <p className="mt-4 text-center text-sm text-gray-600 max-w-xs leading-relaxed">
                                            {profile.bio}
                                        </p>
                                    )}

                                    {/* Social Buttons */}
                                    <div className="mt-6 flex gap-4">
                                        {profile?.social_links?.telegram && (
                                            <a href={`https://t.me/${profile.social_links.telegram}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors">
                                                <MessageCircle size={20} />
                                            </a>
                                        )}
                                        {profile?.social_links?.instagram && (
                                            <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center hover:bg-pink-100 transition-colors">
                                                <Instagram size={20} />
                                            </a>
                                        )}
                                        {profile?.social_links?.website && (
                                            <a href={profile.social_links.website.startsWith('http') ? profile.social_links.website : `https://${profile.social_links.website}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                                <Globe size={20} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* My Team Section */}
                            <div className="px-4 mb-6">
                                <button
                                    onClick={() => router.push('/referral')}
                                    className="w-full group bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-5 shadow-xl shadow-blue-500/10 flex items-center justify-between active:scale-[0.98] transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                            <UserIcon size={24} className="text-white" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-lg leading-tight">{t('social.my_team_title')}</h3>
                                            <p className="text-white/60 text-xs">{t('social.my_team_desc')}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={24} className="text-white/40 group-hover:text-white transition-colors" />
                                </button>
                            </div>

                            {/* Photo Gallery */}
                            {profile?.photos && profile.photos.length > 0 && (
                                <div className="px-6 mb-8">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        Галерея <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                    </h3>
                                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
                                        {profile.photos.map((photo, idx) => (
                                            <div key={idx} className="flex-shrink-0 w-40 aspect-[3/4] rounded-2xl overflow-hidden shadow-sm border border-white">
                                                <img src={photo} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Account Details */}
                            <div className="px-4 space-y-6">
                                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                                    <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-3 font-bold text-gray-900">
                                            <Shield className="text-blue-500" size={20} />
                                            {t('social.profile')}
                                        </div>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <div className="flex items-center justify-between px-3 py-3 rounded-2xl hover:bg-gray-50 transition-colors">
                                            <span className="text-sm font-medium text-gray-500">{t('profile.telegram_id')}</span>
                                            <span className="text-sm font-bold text-gray-900">{user?.telegram_id || '—'}</span>
                                        </div>
                                        <div className="flex items-center justify-between px-3 py-3 rounded-2xl hover:bg-gray-50 transition-colors">
                                            <span className="text-sm font-medium text-gray-500">{t('profile.reinvest')}</span>
                                            <span className="text-sm font-bold text-green-600">{user?.reinvest_setup}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                                    <div className="p-5 border-b border-gray-50">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('profile.linked_accounts')}</h3>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <button
                                            onClick={() => handleLinkIdentity('google')}
                                            className="w-full flex items-center justify-between px-3 py-4 rounded-2xl hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                </svg>
                                                <span className="font-bold text-gray-900">Google</span>
                                            </div>
                                            {session?.user?.identities?.some((id: any) => id.provider === 'google') ? (
                                                <span className="text-green-500 font-bold text-xs uppercase tracking-widest">{t('profile.linked')}</span>
                                            ) : (
                                                <span className="text-blue-500 font-bold text-xs uppercase tracking-widest">{t('profile.link_account')}</span>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm p-2">
                                    <LanguageSwitcher />
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full py-5 text-center font-black text-red-500 uppercase tracking-[0.2em] text-sm hover:bg-red-50 rounded-3xl transition-colors"
                                >
                                    {t('auth.logout')}
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="contacts"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white min-h-full"
                        >
                            <ContactsTab userId={user?.id || ''} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modal */}
            {user && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    user={user}
                    profile={profile}
                    onSuccess={loadProfile}
                />
            )}
        </div>
    );
}
