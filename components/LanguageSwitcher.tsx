'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/utils/translations';

// Order of languages for the toggle
const LANGUAGE_ORDER: Language[] = ['en', 'ru', 'zh', 'es', 'hi', 'ar'];

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        const currentIndex = LANGUAGE_ORDER.indexOf(language);
        const nextIndex = (currentIndex + 1) % LANGUAGE_ORDER.length;
        setLanguage(LANGUAGE_ORDER[nextIndex]);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center justify-center px-4 py-2 rounded-full bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors shadow-sm active:scale-95"
            aria-label="Switch Language"
        >
            🌐 {language.toUpperCase()}
        </button>
    );
}
