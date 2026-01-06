'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { getPublicUserProfileAction } from '@/app/actions/profile';
import { UserProfile, DbUser } from '@/types';
import { ChevronLeft, MessageCircle, Instagram, Globe, Shield, Calendar, Share2, User as UserIcon } from 'lucide-react';
import Image from 'next/image';

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { t } = useLanguage();

    const [data, setData] = useState<{ user: any; profile: UserProfile | null } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        const id = params.id as string;
        if (!id) return;

        setLoading(true);
        const result = await getPublicUserProfileAction(id);
        if (result.success && result.data) {
            setData(result.data);
        } else {
            setError(result.error || 'User not found');
        }
        setLoading(false);
    }, [params.id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white">
                <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white p-6 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                    <Shield size={40} />
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Профиль не найден</h1>
                <p className="text-gray-500 mb-6">{error || 'Пользователь не существует или скрыл свои данные.'}</p>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-black text-white rounded-2xl font-bold shadow-lg"
                >
                    Вернуться назад
                </button>
            </div>
        );
    }

    const { user, profile } = data;

    return (
        <div className="flex flex-col min-h-full bg-gray-50 pb-20">
            {/* Header */}
            <div className="px-6 pt-safe pb-4 bg-white border-b border-gray-100 sticky top-0 z-20">
                <div className="flex items-center justify-between h-14">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} className="text-gray-900" />
                    </button>
                    <h2 className="font-bold text-gray-900">Профиль</h2>
                    <button className="p-2 -mr-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* Profile Info */}
            <div className="bg-white px-6 pt-8 pb-10 border-b border-gray-100 mb-6">
                <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full border-4 border-gray-50 shadow-xl overflow-hidden bg-gray-100 flex items-center justify-center text-4xl">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            '👤'
                        )}
                    </div>

                    <h1 className="mt-4 text-2xl font-black text-gray-900 tracking-tight text-center">
                        {`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username}
                    </h1>

                    {user?.username && (
                        <p className="text-gray-400 font-medium text-sm">@{user.username}</p>
                    )}

                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20">
                            LEVEL {user.level || 0}
                        </div>
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-gray-500 text-xs font-bold">
                            <Calendar size={12} className="mr-1.5" />
                            C {new Date(user.created_at).toLocaleDateString()}
                        </div>
                    </div>

                    {profile?.bio && (
                        <p className="mt-6 text-center text-sm text-gray-600 max-w-xs leading-relaxed italic">
                            «{profile.bio}»
                        </p>
                    )}

                    {/* Socials */}
                    <div className="mt-8 grid grid-cols-3 gap-8">
                        {profile?.social_links?.telegram && (
                            <a href={`https://t.me/${profile.social_links.telegram}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 group">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
                                    <MessageCircle size={22} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TG</span>
                            </a>
                        )}
                        {profile?.social_links?.instagram && (
                            <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 group">
                                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all shadow-sm">
                                    <Instagram size={22} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">IG</span>
                            </a>
                        )}
                        {profile?.social_links?.website && (
                            <a href={profile.social_links.website.startsWith('http') ? profile.social_links.website : `https://${profile.social_links.website}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 group">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-500 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                                    <Globe size={22} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">WEB</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Photo Gallery */}
            {profile?.photos && profile.photos.length > 0 && (
                <div className="px-6 mb-8">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Галерея</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {profile.photos.map((photo, idx) => (
                            <div key={idx} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm border border-white">
                                <img src={photo} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Achievement / RPG Stats (Placeholder design) */}
            <div className="px-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Достижения</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 border border-gray-50">
                                <UserIcon size={24} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
