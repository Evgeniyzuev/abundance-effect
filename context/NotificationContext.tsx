'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { getClient, createClient } from '@/utils/supabase/client';
import { useUser } from './UserContext';

export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'reward' | 'challenge';
    is_read: boolean;
    data: any;
    created_at: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUser();

    const supabase = useMemo(() => {
        const client = getClient();
        if (!client) {
            return createClient();
        }
        return client;
    }, []);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;

        setIsLoading(true);
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Error fetching notifications:', error);
        } else {
            setNotifications(data || []);
        }
        setIsLoading(false);
    }, [user, supabase]);

    useEffect(() => {
        if (user) {
            fetchNotifications();

            // Real-time subscription for new notifications
            const channel = supabase
                .channel(`notifications:${user.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        setNotifications((current) => [payload.new as Notification, ...current]);
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        } else {
            setNotifications([]);
        }
    }, [user, fetchNotifications, supabase]);

    const markAsRead = async (id: string) => {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);

        if (error) {
            console.error('Error marking notification as read:', error);
        } else {
            setNotifications((current) =>
                current.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            );
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;

        const { error } = await supabase.rpc('mark_all_notifications_as_read', {
            target_user_id: user.id,
        });

        if (error) {
            console.error('Error marking all notifications as read:', error);
        } else {
            setNotifications((current) =>
                current.map((n) => ({ ...n, is_read: true }))
            );
        }
    };

    const deleteNotification = async (id: string) => {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting notification:', error);
        } else {
            setNotifications((current) => current.filter((n) => n.id !== id));
        }
    };

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                isLoading,
                fetchNotifications,
                markAsRead,
                markAllAsRead,
                deleteNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
