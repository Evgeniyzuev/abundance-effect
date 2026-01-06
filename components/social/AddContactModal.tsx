'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, UserMinus, User, Loader2 } from 'lucide-react';
import { searchUsersAction, addContactAction } from '@/app/actions/profile';
import { DbUser } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface AddContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddContactModal({ isOpen, onClose, onSuccess }: AddContactModalProps) {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState<string | null>(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim().length >= 3) {
                handleSearch();
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearch = async () => {
        setIsLoading(true);
        const result = await searchUsersAction(query);
        if (result.success) {
            setResults(result.data || []);
        }
        setIsLoading(false);
    };

    const handleAdd = async (userId: string) => {
        setIsAdding(userId);
        const result = await addContactAction(userId);
        if (result.success) {
            onSuccess();
            setResults(prev => prev.filter(u => u.id !== userId));
        } else {
            alert(result.error);
        }
        setIsAdding(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col h-[70vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-900">{t('contacts.add_contact')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder={t('contacts.search_user_placeholder')}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-3">
                            <Loader2 className="animate-spin text-blue-500" size={32} />
                            <p className="text-sm text-gray-500">{t('contacts.searching')}</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                            {results.map((user) => (
                                <div key={user.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <User size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-gray-900 truncate">
                                            {`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {user.username && <span className="text-xs text-gray-400 truncate">@{user.username}</span>}
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 font-bold">LVL {user.level || 0}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAdd(user.id)}
                                        disabled={isAdding === user.id}
                                        className="p-3 bg-blue-600 text-white rounded-2xl shadow-sm hover:shadow-md active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {isAdding === user.id ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : query.length >= 3 ? (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-400">
                            <Search size={48} className="mb-4 opacity-10" />
                            <p>{t('contacts.no_results')}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-400">
                            <User size={48} className="mb-4 opacity-10" />
                            <p>{t('contacts.min_chars')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
