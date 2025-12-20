'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Language, TranslationKey, interpolate } from '@/utils/translations';
import { storage, STORAGE_KEYS } from '@/utils/storage';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey, params?: Record<string, string | number>) => string;
    isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Cache for loaded translations to avoid repeated imports
const translationsCache: Partial<Record<Language, Record<string, string>>> = {};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    const loadTranslations = useCallback(async (lang: Language) => {
        setIsLoading(true);
        try {
            if (translationsCache[lang]) {
                setTranslations(translationsCache[lang]!);
            } else {
                // Dynamically import the language JSON
                const module = await import(`@/locales/${lang}.json`);
                const data = module.default;
                translationsCache[lang] = data;
                setTranslations(data);
            }
        } catch (error) {
            console.error(`Failed to load translations for ${lang}:`, error);
            // Fallback to English if not already English
            if (lang !== 'en') {
                await loadTranslations('en');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const initLanguage = async () => {
            const savedLang = storage.get<Language>(STORAGE_KEYS.LANGUAGE);
            const langToLoad = savedLang || 'en';
            setLanguageState(langToLoad);
            await loadTranslations(langToLoad);
            setMounted(true);
        };
        initLanguage();
    }, [loadTranslations]);

    const setLanguage = async (lang: Language) => {
        setLanguageState(lang);
        storage.set(STORAGE_KEYS.LANGUAGE, lang);
        document.documentElement.lang = lang;
        await loadTranslations(lang);
    };

    useEffect(() => {
        if (mounted) {
            document.documentElement.lang = language;
        }
    }, [mounted, language]);

    const t = useCallback((key: TranslationKey, params?: Record<string, string | number>): string => {
        const text = translations[key] || key;
        return interpolate(text, params);
    }, [translations]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
            <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
                {children}
            </div>
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
