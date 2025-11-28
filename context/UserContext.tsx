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
    isTelegramAuthenticating: boolean
    refreshUser: () => Promise<void>
    logout: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<DbUser | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isTelegramAuthenticating, setIsTelegramAuthenticating] = useState(false)
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
            console.log('🔄 Starting auth initialization...');

            // Step 1: Enhanced Telegram WebApp check with retries for desktop app
            const checkTelegramWithRetries = async (retries = 10): Promise<boolean> => {
                for (let i = 0; i < retries; i++) {
                    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
                        const webApp = (window as any).Telegram.WebApp;

                        // Call ready multiple times to ensure proper initialization
                        try {
                            webApp.ready();
                        } catch (e) {
                            console.log(`⚠️ Telegram WebApp ready() failed (attempt ${i + 1}):`, e);
                        }

                        const tgUser = webApp.initDataUnsafe?.user;

                        console.log(`📱 Telegram WebApp check (${i + 1}/${retries}):`, {
                            hasWebApp: !!webApp,
                            hasUser: !!tgUser,
                            user: tgUser?.id || 'no user',
                            initData: webApp.initData?.length || 0,
                            platform: webApp.platform || 'unknown'
                        });

                        if (tgUser && tgUser.id) {
                            console.log('🎯 Telegram user detected, starting authentication...');
                            return true;
                        } else if (i === retries - 1) {
                            console.log('⚠️ No Telegram user data found after all retries');
                        }
                    } else {
                        console.log(`🔄 Waiting for Telegram SDK... (${i + 1}/${retries})`);
                    }

                    // Wait before next check, with increasing delay
                    await new Promise(resolve => setTimeout(resolve, 200 + (i * 50)));
                }
                return false;
            };

            const isInTelegram = await checkTelegramWithRetries();

            if (isInTelegram) {
                setIsTelegramAuthenticating(true);

                const webApp = (window as any).Telegram.WebApp;
                const tgUser = webApp.initDataUnsafe?.user;

                try {
                    const response = await fetch('/api/auth/telegram-user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            telegramUser: tgUser,
                            initData: webApp.initData,
                        }),
                    });

                    const result = await response.json();
                    console.log('📡 Telegram API response:', result);

                    if (result.success && result.password) {
                        console.log('🔐 Attempting Supabase sign in...');
                        const { data, error } = await supabase.auth.signInWithPassword({
                            email: `telegram_${tgUser.id}@abundance-effect.app`,
                            password: result.password,
                        });

                        if (error) {
                            console.error('❌ Error signing in with Telegram:', error);
                        } else {
                            console.log('✅ Successfully signed in to Supabase:', data);
                        }
                    } else {
                        console.error('❌ Telegram auth failed:', result);
                    }
                } catch (apiError) {
                    console.error('❌ API call error:', apiError);
                } finally {
                    setIsTelegramAuthenticating(false);
                }
            } else {
                console.log('🌐 Not in Telegram WebApp environment');
            }

            // Step 2: Load from cache (but not if we're in Telegram first time)
            if (!isInTelegram) {
                const cachedUser = loadUserFromCache();
                if (cachedUser) {
                    console.log('💾 Loaded user from cache:', cachedUser);
                    setUser(cachedUser);
                    setIsLoading(false);
                    return; // Don't continue if cache loaded and not in Telegram
                }
            }

            try {
                // Step 3: Check normal session
                console.log('🔍 Checking Supabase session...');
                const { data: { session: currentSession } } = await supabase.auth.getSession()
                console.log('📋 Session result:', currentSession ? 'exists' : 'none');
                setSession(currentSession)

                if (currentSession?.user) {
                    console.log('👤 Session user found, fetching DB user...');
                    const dbUser = await fetchDbUser(currentSession.user.id)
                    if (dbUser) {
                        console.log('✅ DB user loaded:', dbUser);
                        setUser(dbUser)
                        saveUserToCache(dbUser)
                    } else {
                        console.log('⚠️ Session exists but no DB user');
                        storage.clearAuthCache();
                        setUser(null);
                    }
                } else {
                    console.log('🚪 No session, clearing cache if exists');
                    const cachedUser = loadUserFromCache();
                    if (cachedUser) {
                        storage.clearAuthCache();
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('❌ Error initializing auth:', error)
                storage.clearAuthCache();
                setUser(null);
            } finally {
                setIsLoading(false)
                console.log('🏁 Auth initialization complete');
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
        <UserContext.Provider value={{ user, session, isLoading, isTelegramAuthenticating, refreshUser, logout }}>
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
