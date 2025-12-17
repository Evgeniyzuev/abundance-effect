'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/utils/supabase/client';

export default function CoreCreationPage() {
    const { user, refreshUser } = useUser();
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        // If user already has core, redirect to challenges
        if (user && user.aicore_balance > 0) {
            router.push('/challenges');
        }
    }, [user, router]);

    // Auto-create core when user has ai_core_balance = 0
    useEffect(() => {
        const createCore = async () => {
            if (!user || user.aicore_balance !== 0 || isCreating) return;

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

        createCore();
    }, [user, refreshUser, isCreating]);

    const handleCoreCreated = () => {
        router.push('/challenges');
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white flex items-center justify-center p-6">
            <div className="max-w-2xl mx-auto text-center space-y-8">
                {/* Core Visualization */}
                <div className="relative">
                    <div className="w-48 h-48 mx-auto mb-8 relative">
                        {/* Core sphere */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shadow-2xl flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 flex items-center justify-center">
                                <span className="text-2xl">⚡</span>
                            </div>
                        </div>

                        {/* Tree icon */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <Image
                                src="/icon-192.png"
                                alt="Tree"
                                width={48}
                                height={48}
                                className="rounded-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300">
                            AI Core
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        Ваш личный вклад в систему Abundance Effect
                    </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-xl">💰</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Гарантированный доход</h3>
                        <p className="text-sm text-gray-300">
                            0.0633% в день — пожизненно
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-xl">🌱</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Бесконечный рост</h3>
                        <p className="text-sm text-gray-300">
                            26% в год минимум
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-xl">🔒</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Неотчуждаемо</h3>
                        <p className="text-sm text-gray-300">
                            Нельзя потерять или украсть
                        </p>
                    </div>
                </div>

                {/* Core Created Button */}
                <button
                    onClick={handleCoreCreated}
                    disabled={isCreating}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-8 py-4 rounded-2xl text-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isCreating ? (
                        <>
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Создание AI Core...
                        </>
                    ) : (
                        <>
                            <span className="text-2xl">✅</span>
                            Ядро создано
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
