'use client';

import { useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { submitAppReviewAction } from '@/app/actions/reviews';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppTestingFormProps {
    onSuccess: (data: any) => void;
}

export default function AppTestingForm({ onSuccess }: AppTestingFormProps) {
    const { t, language } = useLanguage();
    const [visitedTabs, setVisitedTabs] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        tested_functions: '',
        errors_found: '',
        suggestions: '',
        ai_thoughts: '',
        personal_usage_needs: '',
        rating: 5
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requiredTabs = [
        { href: '/goals', label: { en: 'Goals', ru: 'Желания' } },
        { href: '/challenges', label: { en: 'Challenges', ru: 'Задачи' } },
        { href: '/ai', label: { en: 'AI Assistant', ru: 'ИИ Помощник' } },
        { href: '/wallet', label: { en: 'Wallet', ru: 'Кошелек' } },
        { href: '/social', label: { en: 'Social', ru: 'Социум' } },
    ];

    useEffect(() => {
        const visited = storage.get<string[]>(STORAGE_KEYS.VISITED_TABS) || [];
        setVisitedTabs(visited);
    }, []);

    const allVisited = requiredTabs.every(tab => visitedTabs.includes(tab.href));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!allVisited) return;

        setIsSubmitting(true);
        setError(null);

        const result = await submitAppReviewAction(formData);

        if (result.success) {
            storage.set(STORAGE_KEYS.CHALLENGE_APP_TESTING_COMPLETE, true);
            onSuccess({ visited_tabs: visitedTabs });
        } else {
            setError(result.error || 'Failed to submit review');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    {allVisited ?
                        <span className="text-green-600 flex items-center gap-1"><CheckCircle2 size={16} /> {t('challenges.app_testing.all_tabs_visited' as any)}</span> :
                        <span className="text-orange-600 flex items-center gap-1"><Circle size={16} /> {t('challenges.app_testing.explore_sections' as any)}</span>
                    }
                </h3>
                <div className="flex flex-wrap gap-2">
                    {requiredTabs.map(tab => {
                        const isVisited = visitedTabs.includes(tab.href);
                        return (
                            <div
                                key={tab.href}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${isVisited
                                    ? 'bg-green-100 text-green-700 border-green-200'
                                    : 'bg-white text-gray-400 border-gray-200'
                                    }`}
                            >
                                {(tab.label as any)[language] || tab.label.en}
                            </div>
                        );
                    })}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('challenges.app_testing.tested_functions' as any)}
                    </label>
                    <textarea
                        required
                        className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm p-3 bg-white border"
                        rows={2}
                        placeholder={t('challenges.app_testing.tested_functions_placeholder' as any)}
                        value={formData.tested_functions}
                        onChange={e => setFormData({ ...formData, tested_functions: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('challenges.app_testing.errors_found' as any)}
                    </label>
                    <textarea
                        className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm p-3 bg-white border"
                        rows={2}
                        placeholder={t('challenges.app_testing.errors_found_placeholder' as any)}
                        value={formData.errors_found}
                        onChange={e => setFormData({ ...formData, errors_found: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('challenges.app_testing.suggestions' as any)}
                    </label>
                    <textarea
                        className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm p-3 bg-white border"
                        rows={2}
                        placeholder={t('challenges.app_testing.suggestions_placeholder' as any)}
                        value={formData.suggestions}
                        onChange={e => setFormData({ ...formData, suggestions: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('challenges.app_testing.ai_thoughts' as any)}
                    </label>
                    <textarea
                        className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm p-3 bg-white border"
                        rows={3}
                        placeholder={t('challenges.app_testing.ai_thoughts_placeholder' as any)}
                        value={formData.ai_thoughts}
                        onChange={e => setFormData({ ...formData, ai_thoughts: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('challenges.app_testing.personal_needs' as any)}
                    </label>
                    <textarea
                        className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm p-3 bg-white border"
                        rows={3}
                        placeholder={t('challenges.app_testing.personal_needs_placeholder' as any)}
                        value={formData.personal_usage_needs}
                        onChange={e => setFormData({ ...formData, personal_usage_needs: e.target.value })}
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-xs bg-red-50 p-3 rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!allVisited || isSubmitting}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${allVisited && !isSubmitting
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 active:scale-95'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {isSubmitting ? t('challenges.app_testing.submitting' as any) : allVisited ? t('challenges.app_testing.submit_and_check' as any) : t('challenges.app_testing.visit_all_tabs' as any)}
                </button>
            </form>
        </div>
    );
}
