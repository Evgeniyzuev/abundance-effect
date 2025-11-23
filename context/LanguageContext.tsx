'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, TranslationKey } from '@/utils/translations';
import { storage, STORAGE_KEYS } from '@/utils/storage';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedLang = storage.get<Language>(STORAGE_KEYS.LANGUAGE);
        if (savedLang && translations[savedLang]) {
            setLanguageState(savedLang);
        }
        setMounted(true);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        storage.set(STORAGE_KEYS.LANGUAGE, lang);
        document.documentElement.lang = lang;
        // Apply RTL class for text direction only, not layout mirroring
        if (lang === 'ar') {
            document.documentElement.classList.add('rtl');
        } else {
            document.documentElement.classList.remove('rtl');
        }
    };

    useEffect(() => {
        if (mounted) {
            document.documentElement.lang = language;
            // Apply RTL class for text direction only
            if (language === 'ar') {
                document.documentElement.classList.add('rtl');
            } else {
                document.documentElement.classList.remove('rtl');
            }
        }
    }, [mounted, language]);

    const t = (key: TranslationKey): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
