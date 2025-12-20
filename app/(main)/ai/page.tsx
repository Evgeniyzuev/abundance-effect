'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function AiPage() {
    const { t } = useLanguage();

    return (
        <div className="p-4 pt-safe space-y-6">
            <h1 className="text-2xl font-bold text-ios-primary">{t('ai.title')}</h1>
            <div className="ios-card p-6 text-center text-ios-secondary">
                <p>{t('ai.coming_soon')}</p>
            </div>
        </div>
    );
}
