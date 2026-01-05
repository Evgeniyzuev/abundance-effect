'use client';

import { motion } from 'framer-motion';
import { Sparkles, User, Camera, Image as ImageIcon, Wallet, Atom, Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { useWalletBalancesNoCache } from '@/hooks/useWalletBalancesNoCache';

export default function VisionTab() {
    const { t } = useLanguage();
    const { user } = useUser();
    const { coreBalance, walletBalance } = useWalletBalancesNoCache(user?.id || null);

    // Avatar Economics (100x)
    const avatarCore = coreBalance * 100;
    const avatarWallet = walletBalance * 100; // In real implementation, this will be a separate DB field

    return (
        <div className="flex flex-col space-y-6 pt-4 px-4 pb-20">
            {/* Avatar Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
            >
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg overflow-hidden">
                            {user?.avatar_url ? (
                                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User size={48} />
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-blue-600">
                            <Camera size={16} />
                        </button>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {user?.username || 'Sims'}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {t('ai.vision_subtitle') || 'Ваш Образ Будущего'}
                        </p>
                    </div>

                    {/* Avatar Balances (100x) */}
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="bg-blue-50 rounded-2xl p-3 text-left">
                            <div className="flex items-center space-x-1 text-blue-600 mb-1">
                                <Atom size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Future Core</span>
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                                ${avatarCore.toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-orange-50 rounded-2xl p-3 text-left">
                            <div className="flex items-center space-x-1 text-orange-600 mb-1">
                                <Wallet size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Future Wallet</span>
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                                ${avatarWallet.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Actions / Generator */}
            <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                    <ImageIcon size={24} className="mb-2" />
                    <span className="text-xs font-medium">Визуализировать желание</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                    <Sparkles size={24} className="mb-2" />
                    <span className="text-xs font-medium">Настроить стиль</span>
                </button>
            </div>

            {/* Gallery Placeholder */}
            <div>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="font-bold text-gray-900">Галерея Будущего</h3>
                    <button className="text-blue-600 text-xs font-medium">Показать все</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-50 text-gray-300">
                            <ImageIcon size={32} />
                        </div>
                    ))}
                    <button className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition-all">
                        <Plus size={24} />
                        <span className="text-[10px] mt-1 font-medium">Создать</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
