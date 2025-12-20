'use client';

import { useUser } from '@/context/UserContext';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { DbUser } from '@/types';

export default function ReferralPage() {
    const { user } = useUser();
    const supabase = createClient();
    const [referrals, setReferrals] = useState<DbUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState<'telegram' | 'web' | null>(null);

    // Generate referral links
    const telegramLink = `https://t.me/AbundanceEffectBot/Abundance?startapp=${user?.id}`;
    const webLink = `https://abundance-effect.vercel.app/?ref=${user?.id}`;

    useEffect(() => {
        if (!user?.id) return;

        const fetchReferrals = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('referrer_id', user.id)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setReferrals(data);
            }
            setLoading(false);
        };

        fetchReferrals();
    }, [user?.id]);

    const copyToClipboard = async (text: string, type: 'telegram' | 'web') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareLink = async (link: string) => {
        const webApp = (typeof window !== 'undefined' && (window as any).Telegram?.WebApp);
        const shareText = 'Присоединяйся к Abundance Effect! 🎯 Развивайся вместе со мной в приложении для достижения целей и финансового благополучия.';

        if (webApp) {
            // В Telegram Mini App используем Telegram share URL
            try {
                // Всегда используемTelegram share URL для consistency
                const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareText)}`;
                webApp.openLink(shareUrl);
            } catch (err) {
                console.error('Telegram share failed:', err);
                copyToClipboard(link, link.includes('t.me') ? 'telegram' : 'web');
            }
        } else if (navigator.share) {
            // На мобильных устройствах используем Web Share API
            try {
                await navigator.share({
                    title: 'Abundance Effect',
                    text: shareText,
                    url: link,
                });
            } catch (err) {
                console.error('Share failed:', err);
                copyToClipboard(link, link.includes('t.me') ? 'telegram' : 'web');
            }
        } else {
            // Fallback - копирование в буфер
            copyToClipboard(link, link.includes('t.me') ? 'telegram' : 'web');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white pb-20">
            {/* Header */}
            <div className="px-6 pt-safe pb-6">
                <div className="pt-4">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Рефералы</h1>
                    <p className="mt-2 text-base text-gray-600">
                        Приглашайте друзей и получайте награды
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="px-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                        <div className="text-2xl font-bold text-blue-900">{referrals.length}</div>
                        <div className="text-sm text-blue-700 mt-1">Всего рефералов</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
                        <div className="text-2xl font-bold text-green-900">
                            {referrals.filter(r => {
                                const createdDate = new Date(r.created_at);
                                const daysSince = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
                                return daysSince <= 30;
                            }).length}
                        </div>
                        <div className="text-sm text-green-700 mt-1">Активные (30 дней)</div>
                    </div>
                </div>
            </div>

            {/* Referral Links */}
            <div className="px-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ваши реферальные ссылки</h2>

                {/* Telegram Link */}
                <div className="mb-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" fill="#24A1DE" />
                            </svg>
                            <span className="font-medium text-gray-900">Telegram Mini App</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 mb-3 border border-gray-200">
                        <p className="text-sm text-gray-600 break-all font-mono">{telegramLink}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => copyToClipboard(telegramLink, 'telegram')}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                        >
                            {copied === 'telegram' ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Скопировано!
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Копировать
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => shareLink(telegramLink)}
                            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Поделиться
                        </button>
                    </div>
                </div>

                {/* Web Link */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            <span className="font-medium text-gray-900">Веб-ссылка</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 mb-3 border border-gray-200">
                        <p className="text-sm text-gray-600 break-all font-mono">{webLink}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => copyToClipboard(webLink, 'web')}
                            className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition-colors"
                        >
                            {copied === 'web' ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Скопировано!
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Копировать
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => shareLink(webLink)}
                            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Поделиться
                        </button>
                    </div>
                </div>
            </div>

            {/* Referrals List */}
            <div className="flex-1 px-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ваши рефералы</h2>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">Загрузка...</div>
                ) : referrals.length === 0 ? (
                    <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
                        <div className="text-5xl mb-4">👥</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Пока нет рефералов</h3>
                        <p className="text-gray-600">
                            Поделитесь своей ссылкой, чтобы пригласить друзей!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {referrals.map((referral) => (
                            <div key={referral.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-xl">
                                        {referral.avatar_url ? (
                                            <img src={referral.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            '👤'
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">
                                            {referral.first_name || referral.username || 'Пользователь'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Присоединился {new Date(referral.created_at).toLocaleDateString('ru-RU')}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-medium text-blue-700">
                                            Уровень {referral.level || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
