'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function ChallengesPage() {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-ios-primary">{t('challenges.title')}</h1>
            <div className="ios-card p-6 text-center text-ios-secondary">
                <p>{t('challenges.no_active')}</p>
            </div>
        </div>
    );
}
