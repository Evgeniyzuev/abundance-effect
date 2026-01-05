'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Camera, Image as ImageIcon, Wallet, Atom, Plus, Check, X, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { useWalletBalancesNoCache } from '@/hooks/useWalletBalancesNoCache';
import { useVisionSettings } from '@/hooks/useVisionSettings';
import { useGoals } from '@/hooks/useGoals';
import { useState, useEffect } from 'react';
import { generateVisionImageAction } from '@/app/actions/vision';

const AVATAR_STYLES = [
    { id: 'realistic', name: 'Realism', emoji: '📸' },
    { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🌃' },
    { id: 'pixar', name: '3D Pixar', emoji: '🎬' },
    { id: 'anime', name: 'Anime', emoji: '🎨' }
];

const BASE_TYPES = [
    { id: 'man', label: 'Мужчина', icon: '👨' },
    { id: 'woman', label: 'Женщина', icon: '👩' },
    { id: 'boy', label: 'Юноша', icon: '👦' },
    { id: 'girl', label: 'Девушка', icon: '👧' }
];

export default function VisionTab() {
    const { t } = useLanguage();
    const { user } = useUser();
    const { userWishes, fetchWishes } = useGoals();
    const { coreBalance, walletBalance, refreshBalances } = useWalletBalancesNoCache(user?.id || null);
    const { settings, loading: settingsLoading, updateSettings, refreshSettings } = useVisionSettings(user?.id || null);

    const [isOnboarding, setIsOnboarding] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isWishModalOpen, setIsWishModalOpen] = useState(false);
    const [selectedWishId, setSelectedWishId] = useState<string | null>(null);
    const [lastGeneratedImage, setLastGeneratedImage] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id) fetchWishes();
    }, [user?.id, fetchWishes]);

    // Avatar Economics (100x)
    const avatarCore = coreBalance * 100;
    const avatarWallet = settings?.avatar_wallet ?? (walletBalance * 100);

    const handleSaveSettings = async (updates: any) => {
        await updateSettings(updates);
    };

    const handleGenerate = async () => {
        if (isGenerating) return;

        setIsGenerating(true);
        try {
            const result = await generateVisionImageAction(selectedWishId || undefined);
            if (result.success && result.data) {
                setLastGeneratedImage(result.data.imageUrl);
                setIsWishModalOpen(false);
                setSelectedWishId(null);
                // Refresh data to show updated wallet
                refreshSettings();
                refreshBalances();
            } else {
                alert(result.error || 'Ошибка генерации');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    if (settingsLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
        );
    }

    // Onboarding View
    if (!settings?.base_type || isOnboarding) {
        return (
            <div className="p-6 space-y-8 pb-24">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Создай свой Образ</h2>
                    <p className="text-sm text-gray-500">Выберите тип аватара и стиль для визуализации вашего будущего</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {BASE_TYPES.map(type => (
                        <button
                            key={type.id}
                            onClick={() => handleSaveSettings({ base_type: type.id })}
                            className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center space-y-2
                                ${settings?.base_type === type.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-white'}`}
                        >
                            <span className="text-3xl">{type.icon}</span>
                            <span className="text-sm font-bold">{type.label}</span>
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 px-2">Визуальный Стиль</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {AVATAR_STYLES.map(style => (
                            <button
                                key={style.id}
                                onClick={() => handleSaveSettings({ style: style.id })}
                                className={`p-4 rounded-2xl border transition-all flex items-center justify-between
                                    ${settings?.style === style.id ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' : 'border-gray-100 bg-white'}`}
                            >
                                <span className="text-sm font-medium">{style.emoji} {style.name}</span>
                                {settings?.style === style.id && <Check size={14} className="text-blue-600" />}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => setIsOnboarding(false)}
                    disabled={!settings?.base_type}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                    Готово
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6 pt-4 px-4 pb-24">
            {/* Avatar Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100"
            >
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-xl overflow-hidden ring-4 ring-white">
                            {user?.avatar_url ? (
                                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User size={48} />
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full shadow-lg border-2 border-white text-white">
                            <Camera size={14} />
                        </button>
                    </div>

                    <div>
                        <div className="flex items-center justify-center space-x-2">
                            <h2 className="text-xl font-bold text-gray-900">
                                {user?.username || 'Sims'}
                            </h2>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-tighter">
                                {settings.style}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            {t('ai.vision_subtitle') || 'Ваш Образ Будущего'}
                        </p>
                    </div>

                    {/* Avatar Balances (100x) */}
                    <div className="grid grid-cols-2 gap-4 w-full pt-2">
                        <div className="bg-blue-50/50 rounded-2xl p-4 text-left border border-blue-100/50">
                            <div className="flex items-center space-x-1 text-blue-600 mb-1">
                                <Atom size={14} />
                                <span className="text-[10px] font-extrabold uppercase tracking-widest">Future Core</span>
                            </div>
                            <div className="text-xl font-black text-gray-900 tracking-tight">
                                ${Math.floor(avatarCore).toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-orange-50/50 rounded-2xl p-4 text-left border border-orange-100/50">
                            <div className="flex items-center space-x-1 text-orange-600 mb-1">
                                <Wallet size={14} />
                                <span className="text-[10px] font-extrabold uppercase tracking-widest">Future Wallet</span>
                            </div>
                            <div className="text-xl font-black text-gray-900 tracking-tight">
                                ${Math.floor(avatarWallet).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Actions / Generator */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => setIsWishModalOpen(true)}
                    className="flex flex-col items-center justify-center p-5 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all group"
                >
                    <div className="p-3 bg-gray-50 rounded-2xl mb-2 group-hover:bg-blue-50 transition-colors">
                        <ImageIcon size={28} className="text-gray-400 group-hover:text-blue-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">Визуализировать</span>
                </button>
                <button
                    onClick={() => setIsOnboarding(true)}
                    className="flex flex-col items-center justify-center p-5 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 hover:text-purple-600 hover:border-purple-200 transition-all group"
                >
                    <div className="p-3 bg-gray-50 rounded-2xl mb-2 group-hover:bg-purple-50 transition-colors">
                        <Sparkles size={28} className="text-gray-400 group-hover:text-purple-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">Настроить стиль</span>
                </button>
            </div>

            {/* Gallery Placeholder */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Галерея Будущего</h3>
                    <button className="text-blue-600 text-xs font-bold">Показать все</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {lastGeneratedImage && (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-md">
                            <img src={lastGeneratedImage} alt="Future Vision" className="w-full h-full object-cover" />
                        </motion.div>
                    )}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 text-gray-300">
                            <ImageIcon size={32} />
                        </div>
                    ))}
                    <button className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400 hover:bg-blue-50 hover:border-blue-200 transition-all group">
                        <Plus size={32} className="group-hover:text-blue-500" />
                        <span className="text-[10px] mt-2 font-bold group-hover:text-blue-600">Создать</span>
                    </button>
                </div>
            </div>

            {/* Wish Selection Modal */}
            <AnimatePresence>
                {isWishModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsWishModalOpen(false)}
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 relative z-10 shadow-2xl pb-safe-offset"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Что визуализируем?</h3>
                                <button onClick={() => setIsWishModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="max-h-[50vh] overflow-y-auto space-y-3 mb-8 pr-2 custom-scrollbar">
                                {userWishes.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400">
                                        <p>Сначала добавьте желания</p>
                                    </div>
                                ) : (
                                    userWishes.map(wish => (
                                        <button
                                            key={wish.id}
                                            onClick={() => setSelectedWishId(wish.id)}
                                            className={`w-full flex items-center p-4 rounded-3xl border-2 transition-all group
                                                ${selectedWishId === wish.id ? 'border-blue-600 bg-blue-50' : 'border-gray-50 bg-gray-50/50 hover:border-blue-200'}`}
                                        >
                                            <div className="w-12 h-12 bg-white rounded-2xl mr-4 flex-shrink-0 flex items-center justify-center text-xl overflow-hidden shadow-sm">
                                                {wish.image_url ? (
                                                    <img src={wish.image_url} alt="" className="w-full h-full object-cover" />
                                                ) : '🎁'}
                                            </div>
                                            <div className="text-left font-bold text-gray-700 flex-1 truncate">
                                                {wish.title}
                                            </div>
                                            {selectedWishId === wish.id && <Check size={20} className="text-blue-600" />}
                                        </button>
                                    ))
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2 text-xs font-bold">
                                    <span className="text-gray-400 uppercase tracking-widest">Стоимость генерации:</span>
                                    <span className="text-orange-600 bg-orange-50 px-3 py-1 rounded-full">$1,000 FW</span>
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={!selectedWishId || isGenerating || avatarWallet < 1000}
                                    className={`w-full py-5 rounded-3xl font-bold shadow-xl transition-all flex items-center justify-center space-x-2
                                        ${isGenerating ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 text-white shadow-blue-200 hover:scale-[1.02]'}`}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 size={24} className="animate-spin" />
                                            <span>Создаем ваш образ...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={24} />
                                            <span>Сгенерировать Будущее</span>
                                        </>
                                    )}
                                </button>
                                {avatarWallet < 1000 && !isGenerating && (
                                    <p className="text-center text-[10px] text-red-500 font-bold uppercase">Недостаточно Future Wallet. Пополните основной кошелек!</p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
