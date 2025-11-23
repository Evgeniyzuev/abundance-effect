'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { DbUser } from '@/types'

type UserContextType = {
    user: DbUser | null
    session: Session | null
    isLoading: boolean
    refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<DbUser | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    const fetchDbUser = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('Error fetching user:', error)
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
        setUser(dbUser)
    }

    useEffect(() => {
        const init = async () => {
            setIsLoading(true)
            try {
                console.log('[UserContext] Initializing...');

                // First, check if we're in Telegram WebApp
                if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
                    const webApp = (window as any).Telegram.WebApp;
                    webApp.ready();

                    const tgUser = webApp.initDataUnsafe?.user;

                    if (tgUser) {
                        console.log('[UserContext] Telegram user detected:', tgUser);

                        // Try to authenticate via our API
                        console.log('[UserContext] Calling /api/auth/telegram-user...');
                        const response = await fetch('/api/auth/telegram-user', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                telegramUser: tgUser,
                                initData: webApp.initData,
                            }),
                        });

                        const result = await response.json();
                        console.log('[UserContext] API response:', result);

                        if (result.success && result.password) {
                            console.log('[UserContext] Signing in to Supabase...');
                            // Sign in to Supabase
                            const { error, data } = await supabase.auth.signInWithPassword({
                                email: `telegram_${tgUser.id}@abundance-effect.app`,
                                password: result.password,
                            });

                            if (error) {
                                console.error('[UserContext] Error signing in with Telegram:', error);
                            } else {
                                console.log('[UserContext] Successfully signed in!', data);
                            }
                        } else {
                            console.error('[UserContext] API did not return success/password');
                        }
                    } else {
                        console.log('[UserContext] No Telegram user in initDataUnsafe');
                    }
                } else {
                    console.log('[UserContext] Not in Telegram WebApp');
                }

                // Then check normal session
                console.log('[UserContext] Checking session...');
                const { data: { session: currentSession } } = await supabase.auth.getSession()
                console.log('[UserContext] Current session:', currentSession);
                setSession(currentSession)

                if (currentSession?.user) {
                    const dbUser = await fetchDbUser(currentSession.user.id)
                    setUser(dbUser)
                } else {
                    setUser(null)
                }
            } catch (error) {
                console.error('Error initializing auth:', error)
            } finally {
                setIsLoading(false)
            }

            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
                setSession(newSession)
                if (newSession?.user) {
                    // If it's a new sign in, we might need to wait for the trigger to create the user
                    // But usually it's fast. If not found, we might want to retry or handle it.
                    // For now, simple fetch.
                    const dbUser = await fetchDbUser(newSession.user.id)
                    setUser(dbUser)
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
    }, [])

    return (
        <UserContext.Provider value={{ user, session, isLoading, refreshUser }}>
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
