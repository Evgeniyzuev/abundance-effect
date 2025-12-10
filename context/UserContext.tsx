'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { DbUser } from '@/types'
import { storage, STORAGE_KEYS, CachedUserAuth, TelegramInitDataCache } from '@/utils/storage'

type UserContextType = {
    user: DbUser | null
    session: Session | null
    isLoading: boolean
    refreshUser: () => Promise<void>
    logout: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<DbUser | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    // Save user to cache
    const saveUserToCache = (dbUser: DbUser) => {
        const cachedUser: CachedUserAuth = {
            id: dbUser.id,
            telegram_id: dbUser.telegram_id,
            username: dbUser.username,
            first_name: dbUser.first_name,
            last_name: dbUser.last_name,
            avatar_url: dbUser.avatar_url,
            level: dbUser.level,
            wallet_balance: dbUser.wallet_balance,
            aicore_balance: dbUser.aicore_balance,
            reinvest_setup: dbUser.reinvest_setup,
            cached_at: Date.now(),
        };
        storage.set(STORAGE_KEYS.USER_AUTH_CACHE, cachedUser);
    };

    // Load user from cache
    const loadUserFromCache = (): DbUser | null => {
        const cached = storage.get<CachedUserAuth>(STORAGE_KEYS.USER_AUTH_CACHE);
        if (!cached) return null;

        // Check if cache is too old (e.g., 7 days)
        const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
        if (Date.now() - cached.cached_at > MAX_CACHE_AGE) {
            storage.clearAuthCache();
            return null;
        }

        // Convert cached data to DbUser format with all required fields
        return {
            id: cached.id,
            telegram_id: cached.telegram_id,
            username: cached.username,
            first_name: cached.first_name,
            last_name: cached.last_name,
            avatar_url: cached.avatar_url,
            phone_number: null,
            created_at: '',
            updated_at: '',
            wallet_balance: cached.wallet_balance,
            aicore_balance: cached.aicore_balance,
            level: cached.level,
            reinvest_setup: cached.reinvest_setup,
            referrer_id: null,
        } as DbUser;
    };

    const fetchDbUser = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single()

            if (error || !data) {
                // If user not found, try to sync
                console.log('User not found in public table, attempting sync...');
                try {
                    const syncResponse = await fetch('/api/auth/sync-user', { method: 'POST' });
                    const syncResult = await syncResponse.json();

                    if (syncResult.success && syncResult.user) {
                        return syncResult.user as DbUser;
                    }
                } catch (syncError) {
                    console.error('Error syncing user:', syncError);
                }

                console.error('Error fetching user after sync attempt:', error);
                return null
            }
            return data as DbUser
        } catch (error) {
            console.error('Unexpected error fetching user:', error)
            return null
        }
    }

    const refreshUser = async () => {
        if (!session?.user) return
        const dbUser = await fetchDbUser(session.user.id)
        if (dbUser) {
            setUser(dbUser)
            saveUserToCache(dbUser)
        }
    }

    const logout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setSession(null)
        storage.clearAuthCache()
    }

    useEffect(() => {
        const init = async () => {
            // Step 1: Load from cache immediately for instant UI
            const cachedUser = loadUserFromCache();
            if (cachedUser) {
                console.log('Loaded user from cache:', cachedUser);
                setUser(cachedUser);
                setIsLoading(false); // Show UI immediately
            }

            try {
            // Step 2: Check if we're in Telegram WebApp
            // Only proceed with Telegram detection if we have strong indicators
            const getTelegramWebApp = async () => {
                if (typeof window === 'undefined') return null;

                // Helper to check existence
                const getWebApp = () => (window as any).Telegram?.WebApp;

                let webApp = getWebApp();
                if (webApp) return webApp;

                // More strict Telegram environment detection
                // Only poll if we have clear Telegram indicators
                const hasTelegramWebAppData = window.location.hash.includes('tgWebAppData');
                const userAgent = window.navigator.userAgent;
                const isTelegramBot = userAgent.includes('TelegramBot') || userAgent.includes('tg://');
                
                // Only check for Telegram if we have specific indicators
                if (hasTelegramWebAppData || isTelegramBot) {
                    console.log('Strong Telegram environment detected, polling for WebApp...');
                    for (let i = 0; i < 20; i++) { // Wait up to 2 seconds
                        await new Promise(r => setTimeout(r, 100));
                        webApp = getWebApp();
                        if (webApp) return webApp;
                    }
                }
                
                return null;
            };

            const webApp = await getTelegramWebApp();

            if (webApp) {
                webApp.ready();
                const tgUser = webApp.initDataUnsafe?.user;
                const startParam = webApp.initDataUnsafe?.start_param;

                if (tgUser) {
                    console.log('Telegram user detected:', tgUser, 'start_param:', startParam);

                        // Save Telegram init data to cache
                        const tgCache: TelegramInitDataCache = {
                            initData: webApp.initData,
                            user: tgUser,
                            cached_at: Date.now(),
                        };
                        storage.set(STORAGE_KEYS.TELEGRAM_INIT_DATA, tgCache);

                        // Get referrer code - try startParam first, then localStorage
                        let referrerId = startParam;
                        if (!referrerId) {
                            const storedReferral = storage.get<string>(STORAGE_KEYS.REFERRAL_CODE);
                            if (storedReferral) {
                                referrerId = storedReferral;
                                console.log('Using stored referral code:', referrerId);
                            }
                        }

                        console.log('Authenticating Telegram user with referrerId:', referrerId);

                        try {
                            // Try to authenticate via our API
                            const response = await fetch('/api/auth/telegram-user', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    telegramUser: tgUser,
                                    initData: webApp.initData,
                                    referrerId: referrerId || null,
                                }),
                            });

                            // Check if response is valid before parsing JSON
                            if (!response.ok) {
                                console.error('Telegram auth API returned error:', response.status, response.statusText);
                                return;
                            }

                            const result = await response.json();

                            // Check if result is valid before accessing properties
                            if (!result) {
                                console.error('Empty response from Telegram auth API');
                                return;
                            }

                            if (result.success && result.password) {
                                // Sign in to Supabase
                                const { error } = await supabase.auth.signInWithPassword({
                                    email: `telegram_${tgUser.id}@abundance-effect.app`,
                                    password: result.password,
                                });

                                if (error) {
                                    console.error('Error signing in with Telegram:', error);
                                    // Clear cache on auth error
                                    storage.clearAuthCache();
                                    setUser(null);
                                }
                            } else if (result.error) {
                                console.error('Telegram auth API error:', result.error);
                            } else {
                                console.error('Unexpected Telegram auth response:', result);
                            }
                        } catch (authError) {
                            console.error('Error during Telegram authentication:', authError);
                            // Don't throw - continue with normal auth flow for non-Telegram users
                        }
                    }
                }

                // Step 3: Check normal session (this runs in background if cache was loaded)
                const { data: { session: currentSession } } = await supabase.auth.getSession()
                setSession(currentSession)

                if (currentSession?.user) {
                    const dbUser = await fetchDbUser(currentSession.user.id)
                    if (dbUser) {
                        setUser(dbUser)
                        saveUserToCache(dbUser)
                    } else {
                        // Auth session exists but no DB user - clear cache
                        storage.clearAuthCache();
                        setUser(null);
                    }
                } else {
                    // No session - clear cache if it exists
                    if (cachedUser) {
                        console.log('No session found, clearing cache');
                        storage.clearAuthCache();
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error)
                // Clear cache on error
                storage.clearAuthCache();
                setUser(null);
            } finally {
                setIsLoading(false)
            }

            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, newSession: Session | null) => {
                console.log('Auth state changed:', event);
                setSession(newSession)

                if (event === 'SIGNED_OUT') {
                    storage.clearAuthCache();
                    setUser(null);
                } else if (newSession?.user) {
                    const dbUser = await fetchDbUser(newSession.user.id)
                    if (dbUser) {
                        setUser(dbUser)
                        saveUserToCache(dbUser)
                    }
                } else {
                    setUser(null)
                }
                setIsLoading(false)
            })

            return () => {
                subscription.unsubscribe()
            }
        }

        init()

        // Visibility change handler removed as we now use Server Actions for robust data operations
    }, [])

    return (
        <UserContext.Provider value={{ user, session, isLoading, refreshUser, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
