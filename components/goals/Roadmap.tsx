import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { useLevelCheck } from '@/hooks/useLevelCheck';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';

export default function Roadmap() {
    const { t } = useLanguage();
    const { user } = useUser();
    const { levelThresholds } = useLevelCheck();
    const supabase = createClient();

    const [mapImage, setMapImage] = useState<string>('/images/roadmap_bg.png');

    // Load map background from game_items
    useEffect(() => {
        const loadMapBackground = async () => {
            try {
                const { data, error } = await supabase
                    .from('game_items')
                    .select('image')
                    .eq('id', 'map_0')
                    .single();

                if (error) {
                    console.error('Error loading map background:', error);
                    return;
                }

                if (data?.image) {
                    setMapImage(data.image);
                }
            } catch (err) {
                console.error('Error loading map background:', err);
            }
        };

        loadMapBackground();
    }, [supabase]);

    // Calculate current level based on aicore_balance (same as profile page)
    const calculateCurrentLevel = () => {
        if (!user?.aicore_balance || levelThresholds.length === 0) return 0;

        for (let i = levelThresholds.length - 1; i >= 0; i--) {
            if (user.aicore_balance >= levelThresholds[i].core) {
                return levelThresholds[i].level;
            }
        }
        return 0;
    };

    const currentLevel = calculateCurrentLevel();
    const nextLevel = currentLevel + 1;

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Background Map */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                style={{ backgroundImage: `url('${mapImage}')` }}
            >
                <div className="absolute inset-0 bg-black/30" /> {/* Overlay for better contrast */}
            </div>

            {/* Route Visualization (SVG) */}
            <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
                {/* Semi-transparent yellow route line from triangle to level marker */}
                <path
                    d="M 50% 85% L 50% 15%"
                    fill="none"
                    stroke="rgba(255, 215, 0, 0.4)"
                    strokeWidth="6"
                    strokeLinecap="round"
                />

                {/* Semi-transparent white route line from bottom to top */}
                <path
                    d="M 50% 100% L 50% 0%"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="6"
                    strokeLinecap="round"
                />

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
                        <div className="text-sm font-medium opacity-80">📍 Уровень: {nextLevel}</div>
                    </motion.div>
                </div>

                {/* Bottom Section: User Arrow */}
                <div className="mb-16 flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        {/* Yellow Triangle Navigator Icon */}
                        <div className="relative text-yellow-400 p-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2 L18 16 C18 18 16.5 20 15 20 L9 20 C7.5 20 6 18 6 16 L12 2 Z" fill="currentColor" stroke="currentColor" />
                            </svg>
                        </div>

                        <div className="mt-3 text-center">
                            <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                📍 Уровень: {currentLevel}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
