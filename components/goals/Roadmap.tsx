import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/context/UserContext';
import { useLevelCheck } from '@/hooks/useLevelCheck';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';

type InterestPoint = {
    id: string;
    x: number;
    y: number;
    type: 'challenge' | 'wish' | 'boost';
    title: string;
    reward: string;
    difficulty: 'easy' | 'medium' | 'hard';
};

export default function Roadmap() {
    const { user } = useUser();
    const { levelThresholds } = useLevelCheck();
    const supabase = createClient();

    const [mapImage, setMapImage] = useState<string>('/images/roadmap_bg.png');
    const [selectedPointId, setSelectedPointId] = useState<string>('poi-2');

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

    const points: InterestPoint[] = useMemo(
        () => [
            { id: 'poi-1', x: 30, y: 82, type: 'wish', title: 'Микро-желание', reward: '+10 опыта', difficulty: 'easy' },
            { id: 'poi-2', x: 70, y: 74, type: 'challenge', title: 'Челлендж фокуса', reward: '+20 опыта', difficulty: 'medium' },
            { id: 'poi-3', x: 40, y: 66, type: 'boost', title: 'Буст привычки', reward: '+15 опыта', difficulty: 'easy' },
            { id: 'poi-4', x: 76, y: 57, type: 'wish', title: 'Полезное желание', reward: '+25 опыта', difficulty: 'medium' },
            { id: 'poi-5', x: 28, y: 48, type: 'challenge', title: 'Челлендж энергии', reward: '+30 опыта', difficulty: 'hard' },
            { id: 'poi-6', x: 62, y: 38, type: 'boost', title: 'Спринт дня', reward: '+20 опыта', difficulty: 'medium' },
            { id: 'poi-7', x: 36, y: 28, type: 'wish', title: 'Большое желание', reward: '+40 опыта', difficulty: 'hard' },
        ],
        [],
    );

    const selectedPoint = points.find((point) => point.id === selectedPointId) ?? points[0];

    const getIcon = (type: InterestPoint['type']) => {
        if (type === 'challenge') return '⚔️';
        if (type === 'wish') return '✨';
        return '🚀';
    };

    const getTypeLabel = (type: InterestPoint['type']) => {
        if (type === 'challenge') return 'Челлендж';
        if (type === 'wish') return 'Желание';
        return 'Буст';
    };

    const getDifficultyColor = (difficulty: InterestPoint['difficulty']) => {
        if (difficulty === 'easy') return 'text-emerald-200';
        if (difficulty === 'medium') return 'text-amber-200';
        return 'text-rose-200';
    };

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Background Map */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                style={{ backgroundImage: `url('${mapImage}')` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-sky-900/45 via-emerald-950/30 to-slate-950/65" />
                <div className="absolute -top-14 -left-10 w-44 h-44 rounded-full bg-cyan-300/20 blur-3xl" />
                <div className="absolute top-1/3 -right-14 w-56 h-56 rounded-full bg-lime-300/15 blur-3xl" />
                <div className="absolute bottom-12 left-1/4 w-64 h-40 rounded-full bg-amber-200/10 blur-3xl" />
            </div>

            {/* Route Visualization */}
            <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
                {/* Main S-shaped track */}
                <path
                    d="M 50% 89% C 20% 82%, 80% 74%, 68% 64% C 54% 54%, 21% 48%, 34% 36% C 48% 25%, 65% 22%, 52% 10%"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M 50% 89% C 20% 82%, 80% 74%, 68% 64% C 54% 54%, 21% 48%, 34% 36% C 48% 25%, 65% 22%, 52% 10%"
                    fill="none"
                    stroke="rgba(253, 224, 71, 0.85)"
                    strokeWidth="6"
                    strokeDasharray="14 16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Next Level Point */}
                <circle cx="52%" cy="10%" r="16" fill="rgba(250, 204, 21, 0.95)" />
                <circle cx="52%" cy="10%" r="24" fill="rgba(250, 204, 21, 0.28)" />
            </svg>

            <div className="absolute inset-0 z-20">
                {/* Next Level badge */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2">
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-400/95 text-slate-900 border border-amber-200 rounded-2xl px-4 py-3 shadow-xl"
                    >
                        <div className="text-[11px] uppercase tracking-wide font-semibold opacity-80">Следующий уровень</div>
                        <div className="font-bold text-lg leading-none">Lv. {nextLevel}</div>
                    </motion.div>
                </div>

                {/* Current position marker */}
                <div className="absolute left-1/2 bottom-16 -translate-x-1/2 flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="relative flex flex-col items-center"
                    >
                        <div className="px-2 py-1 rounded-full bg-black/50 border border-white/20 text-white text-xs mb-2 backdrop-blur-sm">
                            Текущая позиция · Lv. {currentLevel}
                        </div>
                        <div className="text-amber-300 drop-shadow-[0_6px_12px_rgba(253,224,71,0.55)] animate-bounce">
                            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3L4 15h5v6h6v-6h5L12 3z" />
                            </svg>
                        </div>
                    </motion.div>
                </div>

                {/* Interactive POI points */}
                {points.map((point) => {
                    const isSelected = point.id === selectedPoint.id;
                    return (
                        <button
                            key={point.id}
                            type="button"
                            onClick={() => setSelectedPointId(point.id)}
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                            style={{ left: `${point.x}%`, top: `${point.y}%` }}
                        >
                            <motion.div
                                whileTap={{ scale: 0.94 }}
                                whileHover={{ scale: 1.06 }}
                                className={[
                                    'w-16 h-16 rounded-full border-2 shadow-xl backdrop-blur-sm',
                                    'flex items-center justify-center text-2xl',
                                    isSelected
                                        ? 'bg-orange-500 border-orange-200 ring-4 ring-orange-200/50'
                                        : 'bg-rose-500/90 border-rose-200/90',
                                ].join(' ')}
                            >
                                {getIcon(point.type)}
                            </motion.div>
                        </button>
                    );
                })}

                {/* Selected point info card */}
                <div className="absolute left-1/2 bottom-2 -translate-x-1/2 w-[min(92vw,420px)]">
                    <motion.div
                        key={selectedPoint.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl bg-slate-900/75 border border-white/15 p-4 text-white backdrop-blur-md"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className="text-[11px] uppercase tracking-wide opacity-75">{getTypeLabel(selectedPoint.type)}</div>
                                <div className="text-base font-semibold leading-tight">{selectedPoint.title}</div>
                            </div>
                            <div className={`text-xs font-semibold ${getDifficultyColor(selectedPoint.difficulty)}`}>
                                {selectedPoint.difficulty === 'easy' ? 'Легко' : selectedPoint.difficulty === 'medium' ? 'Средне' : 'Сложно'}
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm">
                            <span className="opacity-80">Награда: {selectedPoint.reward}</span>
                            <span className="text-amber-300">Маршрут свободный</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
