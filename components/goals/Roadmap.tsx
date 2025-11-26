import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { motion } from 'framer-motion';

export default function Roadmap() {
    const { language } = useLanguage();
    const t = (key: keyof typeof translations['en']) => translations[language][key] || key;
    const [level, setLevel] = useState(1);

    useEffect(() => {
        const savedLevel = localStorage.getItem('user_level');
        if (savedLevel) {
            const parsed = parseInt(savedLevel);
            if (!isNaN(parsed)) {
                setLevel(parsed);
            }
        }
    }, []);

    return (
        <div className="relative h-[calc(100vh-140px)] w-full overflow-hidden rounded-2xl shadow-inner">
            {/* Background Map */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                style={{ backgroundImage: "url('/images/roadmap_bg.png')" }}
            >
                <div className="absolute inset-0 bg-black/30" /> {/* Overlay for better contrast */}
            </div>

            {/* Route Visualization (SVG) */}
            <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
                {/* Dashed path from bottom to top */}
                <path
                    d="M 50% 90% Q 20% 70% 50% 50% T 50% 10%"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.6)"
                    strokeWidth="4"
                    strokeDasharray="10, 10"
                    strokeLinecap="round"
                />

                {/* Next Level Point */}
                <circle cx="50%" cy="10%" r="8" fill="#FFD700" className="animate-pulse" />
            </svg>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col justify-between p-6">
                {/* Top Section: Next Level Info */}
                <div className="mt-8 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center text-white"
                    >
                        <div className="text-sm font-medium opacity-80">{t('roadmap.next_level')}</div>
                        <div className="text-3xl font-bold">{level + 1}</div>
                        <div className="text-xs mt-1 text-yellow-300">{t('roadmap.keep_moving')}</div>
                    </motion.div>
                </div>

                {/* Bottom Section: User Arrow */}
                <div className="mb-4 flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        {/* Pulse Effect */}
                        <div className="absolute -inset-4 bg-blue-500/30 rounded-full blur-xl animate-pulse" />

                        {/* Navigation Arrow Icon */}
                        <div className="relative bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-600/50 border-2 border-white/50 transform -rotate-45">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="19" x2="12" y2="5"></line>
                                <polyline points="5 12 12 5 19 12"></polyline>
                            </svg>
                        </div>

                        <div className="mt-3 text-center">
                            <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                {t('roadmap.current_level')} {level}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
