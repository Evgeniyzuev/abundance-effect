'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, TreePine, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/utils/supabase/client';

export default function CoreCreationPage() {
    const { user, refreshUser } = useUser();
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);

    // Removed auto-redirect logic - page only closes via button

    // Auto-create core asynchronously when user has aicore_balance = 0
    useEffect(() => {
        const createCoreAsync = async () => {
            if (!user || user.aicore_balance > 0 || isCreating) return;

            setIsCreating(true);

            try {
                const supabase = createClient();

                // Set initial core balance to 1
                const { error } = await supabase
                    .from('users')
                    .update({ aicore_balance: 1 })
                    .eq('id', user.id);

                if (error) throw error;

                // Refresh user data
                await refreshUser();

            } catch (error) {
                console.error('Error creating core:', error);
                setIsCreating(false);
            }
        };

        createCoreAsync();
    }, [user, refreshUser, isCreating]);

    const handleClosePage = () => {
        // Just redirect to challenges - core creation happens asynchronously
        router.push('/challenges');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden -z-10">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            {/* Header */}
            <header className="relative py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-6xl font-bold mb-6"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300">
                            AI Core
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl  max-w-3xl mx-auto leading-relaxed"
                    >
                        Ваш личный вклад в систему Abundance Effect
                    </motion.p>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 pb-20">
                {/* Core Benefits */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Гарантированный доход</h3>
                        <p className=" leading-relaxed">
                            0.0633% в день — пожизненно и гарантированно
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <TreePine className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Бесконечный рост</h3>
                        <p className=" leading-relaxed">
                            26% в год минимум, 2x за 3 года, 10x за 10 лет, 1000x за 30 лет
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Неотчуждаемо</h3>
                        <p className=" leading-relaxed">
                            Нельзя потерять, потратить, передать или украсть
                        </p>
                    </motion.div>
                </div>

                {/* How it works */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 mb-16"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center">Как это работает</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-white font-bold">1</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold mb-2">Abundance AI</h4>
                                    <p className="">
                                        Управляет ресурсами системы, исполняя желания пользователей
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-white font-bold">2</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold mb-2">Ваш вклад</h4>
                                    <p className="">
                                        AI Core — это ваш личный вклад в систему изобилия
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-white font-bold">3</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold mb-2">Распределение дохода</h4>
                                    <p className="">
                                        Доходы распределяются пропорционально личному вкладу
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-white font-bold">4</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold mb-2">Рост через реинвестирование</h4>
                                    <p className="">
                                        Автоматический рост даже без ваших действий
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Core Visualization */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="relative w-48 h-48 mx-auto mb-8">
                        {/* Static Core Visualization */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shadow-2xl flex items-center justify-center">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        {/* Tree Icon */}
                        <div className="absolute bottom-4 right-4">
                            <img
                                src="/icon-192.png"
                                alt="Tree"
                                className="w-16 h-16 rounded-lg"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Create Core Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClosePage}
                        className="inline-flex items-center gap-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold px-12 py-6 rounded-3xl text-xl hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 transition-all shadow-2xl"
                    >
                        <CheckCircle className="w-8 h-8" />
                        Ядро создано
                        <ArrowRight className="w-6 h-6" />
                    </motion.button>
                </motion.div>
            </main>
        </div>
    );
}
