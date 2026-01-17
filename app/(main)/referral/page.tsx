'use client';

import { useUser } from '@/context/UserContext';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { DbUser } from '@/types';
import { fetchHierarchyAction, broadcastToTeamAction } from '@/app/actions/hierarchy';
import { Megaphone, Shield, User as UserIcon, Users, ChevronRight, Send, AlertCircle, Copy, Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type HierarchyData = {
    lead: DbUser | null;
    team: DbUser[];
};

export default function ReferralPage() {
    const { user } = useUser();
    const router = useRouter();
    const [hierarchy, setHierarchy] = useState<HierarchyData>({ lead: null, team: [] });
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState<'telegram' | 'web' | null>(null);

    // Broadcast state
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [broadcastStatus, setBroadcastStatus] = useState<{ success?: boolean, error?: string } | null>(null);

    // Generate referral links
    const telegramLink = `https://t.me/AbundanceEffectBot/Abundance?startapp=${user?.id}`;
    const webLink = `https://abundance-effect.vercel.app/?ref=${user?.id}`;

    const loadData = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        const result = await fetchHierarchyAction();
        if (result.success && result.data) {
            setHierarchy(result.data);
        }
        setLoading(false);
    }, [user?.id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

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
            try {
                const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareText)}`;
                webApp.openTelegramLink(shareUrl);
            } catch (err) {
                console.error('Telegram share failed:', err);
                copyToClipboard(link, link.includes('t.me') ? 'telegram' : 'web');
            }
        } else if (navigator.share) {
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
            copyToClipboard(link, link.includes('t.me') ? 'telegram' : 'web');
        }
    };

    const handleBroadcast = async () => {
        if (!broadcastMessage.trim()) return;
        setIsBroadcasting(true);
        setBroadcastStatus(null);

        const result = await broadcastToTeamAction(broadcastMessage);

        if (result.success) {
            setBroadcastStatus({ success: true });
            setBroadcastMessage('');
            setTimeout(() => setBroadcastStatus(null), 3000);
        } else {
            setBroadcastStatus({ error: result.error });
        }
        setIsBroadcasting(false);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 pb-20 overflow-y-auto">
            {/* Header */}
            <div className="px-6 pt-safe pb-4 bg-white border-b border-gray-100">
                <div className="pt-4">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Иерархия</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Ваше место в системе Abundance
                    </p>
                </div>
            </div>

            {/* Stage 1: My Lead */}
            <div className="px-4 mt-6">
                <h2 className="px-2 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Мой Лид</h2>
                <div
                    onClick={() => hierarchy.lead && router.push(`/profile/${hierarchy.lead.id}`)}
                    className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 ${hierarchy.lead ? 'cursor-pointer active:scale-[0.98] transition-all' : ''}`}
                >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md relative group overflow-hidden">
                        {hierarchy.lead?.avatar_url ? (
                            <img src={hierarchy.lead.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <Shield size={24} />
                        )}
                        {!hierarchy.lead && (
                            <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
                                <Shield size={24} className="text-blue-600" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-lg">
                                {hierarchy.lead ? (hierarchy.lead.first_name || hierarchy.lead.username || 'Пользователь') : 'Abundance AI'}
                            </span>
                            {hierarchy.lead && (
                                <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border border-blue-100">
                                    Lvl {hierarchy.lead.level}
                                </span>
                            )}
                            {!hierarchy.lead && (
                                <span className="bg-amber-50 text-amber-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border border-amber-100">
                                    System
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {hierarchy.lead ? 'Ваш прямой наставник и лидер' : 'Вы находитесь на вершине иерархии'}
                        </p>
                    </div>
                    {hierarchy.lead && (
                        <div className="text-gray-300">
                            <ChevronRight size={20} />
                        </div>
                    )}
                </div>
            </div>

            {/* Stage 2: Broadcast (If team exists) */}
            {hierarchy.team.length > 0 && (
                <div className="px-4 mt-8">
                    <div className="flex items-center justify-between px-2 mb-3">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Голос Лидера</h2>
                        <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold border border-green-100">
                            {hierarchy.team.length} слушателей
                        </span>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="relative">
                            <textarea
                                value={broadcastMessage}
                                onChange={(e) => setBroadcastMessage(e.target.value)}
                                placeholder="Отправьте сообщение всей вашей команде..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none h-24"
                            />
                            <button
                                onClick={handleBroadcast}
                                disabled={!broadcastMessage.trim() || isBroadcasting}
                                className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 disabled:bg-gray-200 transition-all"
                            >
                                {isBroadcasting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Send size={18} />
                                )}
                            </button>
                        </div>

                        <AnimatePresence>
                            {broadcastStatus && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`mt-3 p-2 rounded-lg text-xs flex items-center gap-2 ${broadcastStatus.success ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                                        }`}
                                >
                                    {broadcastStatus.success ? <Check size={14} /> : <AlertCircle size={14} />}
                                    {broadcastStatus.success ? 'Сообщение доставлено команде!' : broadcastStatus.error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Stage 3: Referral Links */}
            <div className="px-4 mt-8">
                <h2 className="px-2 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Рост команды</h2>
                <div className="grid grid-cols-1 gap-3">
                    {/* Telegram Card */}
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Users size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 leading-tight">Пригласить в Telegram</h3>
                                <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Mini App Link</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => shareLink(telegramLink)}
                                className="flex-[2] bg-blue-600 text-white h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                            >
                                <Share2 size={18} />
                                Поделиться
                            </button>
                            <button
                                onClick={() => copyToClipboard(telegramLink, 'telegram')}
                                className="flex-1 bg-gray-100 text-gray-600 h-11 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                            >
                                {copied === 'telegram' ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Web Card (Smaller) */}
                    <button
                        onClick={() => copyToClipboard(webLink, 'web')}
                        className="bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm flex items-center justify-between group active:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                <AlertCircle size={16} />
                            </div>
                            <span className="text-sm font-medium text-gray-600">Обычная веб-ссылка</span>
                        </div>
                        <div className="text-gray-300">
                            {copied === 'web' ? <Check size={16} className="text-green-500" /> : <ChevronRight size={16} />}
                        </div>
                    </button>
                </div>
            </div>

            {/* Stage 4: Team List */}
            <div className="px-4 mt-8 pb-10">
                <div className="flex items-center justify-between px-2 mb-3">
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Моя Команда</h2>
                    {hierarchy.team.length > 0 && (
                        <span className="text-[10px] font-bold text-gray-400">{hierarchy.team.length} чел.</span>
                    )}
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-gray-200/50 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : hierarchy.team.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users size={32} className="text-gray-200" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1 text-lg">Команда пуста</h3>
                        <p className="text-sm text-gray-400 px-4">
                            Станьте лидером, пригласив первых участников по вашей ссылке.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {hierarchy.team.map((member) => (
                            <div
                                key={member.id}
                                onClick={() => router.push(`/profile/${member.id}`)}
                                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all"
                            >
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex-shrink-0 overflow-hidden border border-gray-50">
                                    {member.avatar_url ? (
                                        <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <UserIcon size={20} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-gray-900">
                                        {member.first_name || member.username || 'Пользователь'}
                                    </div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                                        В команде с {new Date(member.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-600">
                                        LVL {member.level || 0}
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
