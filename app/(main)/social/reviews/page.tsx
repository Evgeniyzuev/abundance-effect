'use client';

import { useState, useEffect } from 'react';
import { getAppReviewsAction } from '@/app/actions/reviews';
import { useLanguage } from '@/context/LanguageContext';
import { Star, MessageSquare, AlertCircle, Lightbulb, Brain, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AppReviewsPage() {
    const { t } = useLanguage();
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            const result = await getAppReviewsAction();
            if (result.success && result.data) {
                setReviews(result.data);
            }
            setIsLoading(false);
        };
        fetchReviews();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="flex-1 overflow-y-auto pt-4 pb-20 px-4">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Отзывы пользователей</h1>
                    <p className="text-gray-500 text-sm mt-1">Опыт и идеи нашего сообщества</p>
                </header>

                <div className="space-y-4">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                                        {review.user_profiles?.avatar_url ? (
                                            <img src={review.user_profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="text-blue-500 w-6 h-6" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 leading-none">
                                            {review.user_profiles?.display_name || 'Пользователь'}
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-1">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs font-bold text-yellow-700">{review.rating}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                                        <MessageSquare size={14} />
                                        <span className="text-xs font-semibold uppercase tracking-wider">Функции</span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">{review.tested_functions}</p>
                                </div>

                                {review.errors_found && (
                                    <div>
                                        <div className="flex items-center gap-2 text-red-500 mb-1">
                                            <AlertCircle size={14} />
                                            <span className="text-xs font-semibold uppercase tracking-wider">Ошибки</span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed">{review.errors_found}</p>
                                    </div>
                                )}

                                {review.suggestions && (
                                    <div>
                                        <div className="flex items-center gap-2 text-green-600 mb-1">
                                            <Lightbulb size={14} />
                                            <span className="text-xs font-semibold uppercase tracking-wider">Предложения</span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed">{review.suggestions}</p>
                                    </div>
                                )}

                                {review.ai_thoughts && (
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2 text-purple-600 mb-1">
                                            <Brain size={14} />
                                            <span className="text-xs font-semibold uppercase tracking-wider">О ИИ</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic leading-relaxed">"{review.ai_thoughts}"</p>
                                    </div>
                                )}

                                {review.personal_usage_needs && (
                                    <div>
                                        <div className="flex items-center gap-1 text-gray-400 mb-1">
                                            <span className="text-[10px] uppercase font-bold tracking-widest">Для жизни:</span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed">{review.personal_usage_needs}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {reviews.length === 0 && (
                        <div className="text-center py-20">
                            <div className="text-4xl mb-4">✍️</div>
                            <h3 className="text-gray-900 font-semibold">Пока нет отзывов</h3>
                            <p className="text-gray-500 text-sm">Будьте первым, кто поделится мнением!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
