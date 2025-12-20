'use client';

import React, { useState } from 'react';
import { Bell, X, Check, Trash2, Info, CheckCircle, AlertTriangle, XCircle, Gift, Trophy } from 'lucide-react';
import { useNotifications, Notification } from '@/context/NotificationContext';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, isLoading } = useNotifications();
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-green-500" size={18} />;
            case 'warning': return <AlertTriangle className="text-amber-500" size={18} />;
            case 'error': return <XCircle className="text-red-500" size={18} />;
            case 'reward': return <Gift className="text-purple-500" size={18} />;
            case 'challenge': return <Trophy className="text-blue-500" size={18} />;
            default: return <Info className="text-blue-400" size={18} />;
        }
    };

    return (
        <>
            <button
                onClick={toggleOpen}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
                aria-label="Notifications"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleOpen}
                            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-sm bg-white shadow-2xl flex flex-col pt-safe"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900">{t('notifications.title') || 'Notifications'}</h2>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs font-medium text-blue-600 hover:text-blue-700 p-1"
                                        >
                                            {t('notifications.mark_all_read') || 'Mark all as read'}
                                        </button>
                                    )}
                                    <button
                                        onClick={toggleOpen}
                                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center h-40 space-y-3">
                                        <div className="w-8 h-8 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                        <p className="text-sm text-gray-500">{t('common.loading')}</p>
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-64 text-center p-6 space-y-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                            <Bell size={32} />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">{t('notifications.no_new') || 'No new notifications'}</p>
                                            <p className="text-sm text-gray-500 mt-1">{t('notifications.no_new_desc') || "We'll notify you when something important happens."}</p>
                                        </div>
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`relative p-4 rounded-2xl border transition-all ${notification.is_read
                                                    ? 'bg-white border-gray-100 text-gray-600'
                                                    : 'bg-blue-50/50 border-blue-100 text-gray-900'
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="mt-1 flex-shrink-0">
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h3 className="font-bold text-sm truncate">{notification.title}</h3>
                                                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                                            {new Date(notification.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm mt-1 leading-relaxed opacity-90">{notification.message}</p>

                                                    <div className="flex items-center gap-3 mt-3">
                                                        {!notification.is_read && (
                                                            <button
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
                                                            >
                                                                <Check size={14} />
                                                                {t('notifications.mark_read') || 'Mark read'}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => deleteNotification(notification.id)}
                                                            className="text-xs font-medium text-gray-400 flex items-center gap-1 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                            {t('common.delete')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
