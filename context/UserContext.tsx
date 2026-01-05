'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { createClient, getClient } from '@/utils/supabase/client'
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

    // Use existing global client to avoid multiple connections
    const supabase = useMemo(() => {
        const client = getClient()
        if (!client) {
            console.warn('No existing Supabase client found, creating new one')
            return createClient()
        }
        return client
    }, [])

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

    // Load user from cache with improved validation
    const loadUserFromCache = (): DbUser | null => {
        const cached = storage.get<CachedUserAuth>(STORAGE_KEYS.USER_AUTH_CACHE);
        if (!cached) return null;

        // Check if cache is too old (e.g., 30 minutes for active sessions)
        const MAX_CACHE_AGE = 30 * 60 * 1000; // 30 minutes
        if (Date.now() - cached.cached_at > MAX_CACHE_AGE) {
            storage.clearAuthCache();
            return null;
        }

        // Validate cached data integrity
        if (!cached.id || !cached.telegram_id) {
            console.warn('Invalid cached user data, clearing cache');
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
            wallet_balance: cached.wallet_balance || 0,
            aicore_balance: cached.aicore_balance || 0,
            level: cached.level || 1,
            reinvest_setup: cached.reinvest_setup || false,
            referrer_id: null,
        } as DbUser;
    };

    // Debounced fetch to prevent multiple concurrent requests
    const fetchDbUser = useMemo(() => {
        let fetchPromise: Promise<DbUser | null> | null = null;
        let lastUserId: string | null = null;

        return async (userId: string) => {
            // If we're already fetching this user, return the existing promise
            if (fetchPromise && lastUserId === userId) {
                return fetchPromise;
            }

            lastUserId = userId;
            fetchPromise = (async () => {
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
                } finally {
                    // Clear the fetch promise after completion
                    fetchPromise = null;
                }
            })();

            return fetchPromise;
        };
    }, [supabase]);

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
        const getTelegramWebApp = async () => {
            if (typeof window === 'undefined') return null;
            const getWebApp = () => (window as any).Telegram?.WebApp;
            let webApp = getWebApp();
            if (webApp) return webApp;

            const hasTelegramWebAppData = window.location.hash.includes('tgWebAppData');
            const userAgent = window.navigator.userAgent;
            const isTelegramBot = userAgent.includes('TelegramBot') || userAgent.includes('tg://');

            if (hasTelegramWebAppData || isTelegramBot) {
                for (let i = 0; i < 20; i++) {
                    await new Promise(r => setTimeout(r, 50));
                    webApp = getWebApp();
                    if (webApp) return webApp;
                }
            }
            return null;
        };

        const init = async () => {
            const cachedUser = loadUserFromCache();
            if (cachedUser) {
                setUser(cachedUser);
                setIsLoading(false);
            }

            try {
                const [webApp, sessionResult] = await Promise.all([
                    getTelegramWebApp(),
                    supabase.auth.getSession()
                ]);

                let currentSession = sessionResult.data.session;
                setSession(currentSession);

                if (webApp) {
                    webApp.ready();
                    const tgUser = webApp.initDataUnsafe?.user;

                    if (tgUser) {
                        const tgCache: TelegramInitDataCache = {
                            initData: webApp.initData,
                            user: tgUser,
                            cached_at: Date.now(),
                        };
                        storage.set(STORAGE_KEYS.TELEGRAM_INIT_DATA, tgCache);

                        if (!currentSession) {
                            console.log('Detected Telegram user, performing auto-login...');
                            const referrerId = webApp.initDataUnsafe?.start_param || storage.get<string>(STORAGE_KEYS.REFERRAL_CODE);

                            const response = await fetch('/api/auth/telegram-user', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    telegramUser: tgUser,
                                    initData: webApp.initData,
                                    referrerId: referrerId || null,
                                }),
                            });

                            if (response.ok) {
                                const result = await response.json();
                                if (result.success && result.password) {
                                    const { data: authData } = await supabase.auth.signInWithPassword({
                                        email: `telegram_${tgUser.id}@abundance-effect.app`,
                                        password: result.password,
                                    });
                                    currentSession = authData.session;
                                    setSession(currentSession);
                                }
                            }
                        }
                    }
                }

                if (currentSession?.user) {
                    const dbUser = await fetchDbUser(currentSession.user.id);
                    if (dbUser) {
                        setUser(dbUser);
                        saveUserToCache(dbUser);
                    } else {
                        storage.clearAuthCache();
                        setUser(null);
                    }
                } else if (!cachedUser) {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setIsLoading(false);
            }
        };

        init();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, newSession: Session | null) => {
            try {
                setSession(newSession);
                if (event === 'SIGNED_OUT') {
                    storage.clearAuthCache();
                    setUser(null);
                } else if (newSession?.user) {
                    const dbUser = await fetchDbUser(newSession.user.id);
                    if (dbUser) {
                        setUser(dbUser);
                        saveUserToCache(dbUser);
                    }
                } else {
                    setUser(null);
                }
                setIsLoading(false);
            } catch (err) {
                console.error('Error in onAuthStateChange:', err);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

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
