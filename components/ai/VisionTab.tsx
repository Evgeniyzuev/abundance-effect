'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Camera, Image as ImageIcon, Wallet, Atom, Plus, Check, X, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { useWalletBalancesNoCache } from '@/hooks/useWalletBalancesNoCache';
import { useVisionSettings } from '@/hooks/useVisionSettings';
import { useGoals } from '@/hooks/useGoals';
import { useState, useEffect, useCallback } from 'react';
import { generateVisionImageAction, getAvatarVisionsAction } from '@/app/actions/vision';
import { AvatarVision } from '@/types';

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

const BASIC_MODELS = [
    { id: 'flux', name: 'Flux Schnell', description: 'Fast, High Quality', icon: '⚡' },
    { id: 'zimage', name: 'Z-Image Turbo', description: 'Ultra Fast', icon: '🚀' },
    { id: 'turbo', name: 'SDXL Turbo', description: 'Classic Fast', icon: '🖼️' }
];

const PRO_MODELS = [
    { id: 'nanobanana', name: 'NanoBanana', description: 'Premium AI', icon: '🍌' },
    { id: 'seedream-pro', name: 'Seedream 4.5 Pro', description: 'Pro Artistic', icon: '✨' },
    { id: 'kontext', name: 'FLUX.1 Kontext', description: 'Semantic Master', icon: '🧠' }
];

export default function VisionTab() {
    const { t } = useLanguage();
    const { user } = useUser();
    const { userWishes, fetchWishes } = useGoals();
    const { coreBalance, walletBalance, refreshBalances } = useWalletBalancesNoCache(user?.id || null);
    const { settings, loading: settingsLoading, updateSettings, refreshSettings } = useVisionSettings(user?.id || null);

    const [visions, setVisions] = useState<AvatarVision[]>([]);
    const [visionsLoading, setVisionsLoading] = useState(true);
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isWishModalOpen, setIsWishModalOpen] = useState(false);
    const [selectedWishId, setSelectedWishId] = useState<string | null>(null);
    const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
    const [lastGeneratedImage, setLastGeneratedImage] = useState<string | null>(null);

    const loadVisions = useCallback(async () => {
        if (!user?.id) return;
        setVisionsLoading(true);
        const result = await getAvatarVisionsAction();
        if (result.success && result.data) {
            setVisions(result.data);
        }
        setVisionsLoading(false);
    }, [user?.id]);

    useEffect(() => {
        if (user?.id) {
            fetchWishes();
            loadVisions();
        }
    }, [user?.id, fetchWishes, loadVisions]);

    // Avatar Economics (100x)
    const avatarCore = coreBalance * 100;
    const avatarWallet = settings?.avatar_wallet ?? (walletBalance * 100);

    const handleSaveSettings = async (updates: any) => {
        await updateSettings(updates);
    };

    const getWishCost = useCallback((wishId: string | null) => {
        if (!wishId) return 10;
        const wish = userWishes.find(w => w.id === wishId);
        if (!wish?.estimated_cost) return 10;
        // Clean string from symbols like $ or ,
        const cleanStr = wish.estimated_cost.replace(/[^0-9.]/g, '');
        const cost = parseFloat(cleanStr);
        return isNaN(cost) || cost <= 0 ? 10 : Math.max(10, Math.ceil(cost));
    }, [userWishes]);

    const handleGenerate = async () => {
        if (isGenerating) return;

        const currentCost = getWishCost(selectedWishId);
        if (avatarWallet < currentCost) {
            alert(`Недостаточно средств. Требуется $${currentCost.toLocaleString()} FW`);
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateVisionImageAction(
                selectedWishId || undefined,
                undefined,
                selectedModelId || undefined
            );
            if (result.success && result.data) {
                setLastGeneratedImage(result.data.image_url);
                setIsWishModalOpen(false);
                setSelectedWishId(null);
                setSelectedModelId(null);
                // Refresh data
                refreshSettings();
                refreshBalances();
                loadVisions();
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
            <div className="p-6 space-y-8 pb-24 max-h-screen overflow-y-auto">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Настройка Образа</h2>
                    <p className="text-sm text-gray-500">Настройте свой аватар и выберите нейросеть для генерации</p>
                </div>

                {/* Base Type Selection */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 px-2 text-sm uppercase tracking-wider text-gray-400">Кто вы?</h3>
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
                </div>

                {/* Style Selection */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 px-2 text-sm uppercase tracking-wider text-gray-400">Визуальный Стиль</h3>
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

                {/* Model Selection */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 px-2 text-sm uppercase tracking-wider text-gray-400">Модель Генерации</h3>

                    <div className="space-y-6">
                        {/* Basic Models */}
                        <div className="space-y-2">
                            <h4 className="px-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Базовые (до $500 FW)</h4>
                            <div className="space-y-2">
                                {BASIC_MODELS.map(model => (
                                    <button
                                        key={model.id}
                                        onClick={() => handleSaveSettings({ preferred_image_model: model.id })}
                                        className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between text-left
                                            ${settings?.preferred_image_model === model.id ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' : 'border-gray-100 bg-white'}`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xl">{model.icon}</span>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{model.name}</div>
                                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{model.description}</div>
                                            </div>
                                        </div>
                                        {settings?.preferred_image_model === model.id && <Check size={16} className="text-blue-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pro Models */}
                        <div className="space-y-2">
                            <h4 className="px-2 text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">PRO (от $500 FW)</h4>
                            <div className="space-y-2">
                                {PRO_MODELS.map(model => (
                                    <button
                                        key={model.id}
                                        onClick={() => handleSaveSettings({ preferred_image_model: model.id })}
                                        className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between text-left
                                            ${settings?.preferred_image_model === model.id ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-100' : 'border-gray-100 bg-white'}`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xl">{model.icon}</span>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{model.name}</div>
                                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{model.description}</div>
                                            </div>
                                        </div>
                                        {settings?.preferred_image_model === model.id && <Check size={16} className="text-purple-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsOnboarding(false)}
                    disabled={!settings?.base_type || !settings?.preferred_image_model}
                    className="w-full py-4 bg-blue-600 text-white rounded-3xl font-bold shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                    Сохранить и начать
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

            {/* Gallery Section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Галерея Будущего</h3>
                    <button className="text-blue-600 text-xs font-bold">Показать все</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {visionsLoading ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-square bg-gray-50 rounded-2xl animate-pulse" />
                        ))
                    ) : visions.length > 0 ? (
                        visions.map((vision) => (
                            <motion.div
                                key={vision.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group"
                            >
                                <img src={vision.image_url} alt={vision.prompt} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-[10px] text-white font-medium truncate">{vision.prompt}</p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <>
                            <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 text-gray-300">
                                <ImageIcon size={32} />
                            </div>
                            <button
                                onClick={() => setIsWishModalOpen(true)}
                                className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                            >
                                <Plus size={32} className="group-hover:text-blue-500" />
                                <span className="text-[10px] mt-2 font-bold group-hover:text-blue-600">Создать</span>
                            </button>
                        </>
                    )}
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

                            <div className="max-h-[50vh] overflow-y-auto space-y-6 mb-8 pr-2 custom-scrollbar">
                                {userWishes.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400">
                                        <p>Сначала добавьте желания</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <h4 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Выберите цель</h4>
                                            <div className="space-y-2">
                                                {userWishes.map(wish => (
                                                    <button
                                                        key={wish.id}
                                                        onClick={() => {
                                                            setSelectedWishId(wish.id);
                                                            // Logic for auto-selecting model if tier changes
                                                            const cost = getWishCost(wish.id);
                                                            const isPro = cost >= 500;
                                                            const currentIsPro = PRO_MODELS.some(m => m.id === selectedModelId);
                                                            const currentIsBasic = BASIC_MODELS.some(m => m.id === selectedModelId);

                                                            if (isPro && !currentIsPro) setSelectedModelId(PRO_MODELS[0].id);
                                                            if (!isPro && !currentIsBasic) setSelectedModelId(BASIC_MODELS[0].id);
                                                        }}
                                                        className={`w-full flex items-center p-4 rounded-3xl border-2 transition-all group
                                                            ${selectedWishId === wish.id ? 'border-blue-600 bg-blue-50' : 'border-gray-50 bg-gray-50/50 hover:border-blue-200'}`}
                                                    >
                                                        <div className="w-12 h-12 bg-white rounded-2xl mr-4 flex-shrink-0 flex items-center justify-center text-xl overflow-hidden shadow-sm">
                                                            {wish.image_url ? (
                                                                <img src={wish.image_url} alt="" className="w-full h-full object-cover" />
                                                            ) : '🎁'}
                                                        </div>
                                                        <div className="flex-1 text-left min-w-0">
                                                            <div className="font-bold text-gray-700 truncate">{wish.title}</div>
                                                            <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">${wish.estimated_cost || '0'}</div>
                                                        </div>
                                                        {selectedWishId === wish.id && <Check size={20} className="text-blue-600" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {selectedWishId && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="space-y-3 pt-2"
                                            >
                                                <h4 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    {getWishCost(selectedWishId) >= 500 ? '🔥 Доступные PRO Модели' : '✨ Доступные Модели'}
                                                </h4>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {(getWishCost(selectedWishId) >= 500 ? PRO_MODELS : BASIC_MODELS).map(model => (
                                                        <button
                                                            key={model.id}
                                                            onClick={() => setSelectedModelId(model.id)}
                                                            className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between text-left
                                                                ${selectedModelId === model.id
                                                                    ? (getWishCost(selectedWishId) >= 500 ? 'border-purple-500 bg-purple-50' : 'border-blue-500 bg-blue-50')
                                                                    : 'border-gray-100 bg-white'}`}
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <span className="text-xl">{model.icon}</span>
                                                                <div>
                                                                    <div className="text-sm font-bold text-gray-900">{model.name}</div>
                                                                    <div className="text-[10px] text-gray-500 uppercase font-black">{model.description}</div>
                                                                </div>
                                                            </div>
                                                            {selectedModelId === model.id && <Check size={16} className={getWishCost(selectedWishId) >= 500 ? 'text-purple-600' : 'text-blue-600'} />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2 text-xs font-bold">
                                    <span className="text-gray-400 uppercase tracking-widest">Стоимость генерации:</span>
                                    <span className="text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                                        ${getWishCost(selectedWishId).toLocaleString()} FW
                                    </span>
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={!selectedWishId || isGenerating || avatarWallet < getWishCost(selectedWishId)}
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
                                {selectedWishId && avatarWallet < getWishCost(selectedWishId) && !isGenerating && (
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
