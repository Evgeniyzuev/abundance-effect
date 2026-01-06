'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserPlus, User, Shield, Users, ChevronRight, MessageCircle, MoreVertical, Trash2, Loader2 } from 'lucide-react';
import { getContactsAction, removeContactAction } from '@/app/actions/profile';
import { fetchHierarchyAction } from '@/app/actions/hierarchy';
import AddContactModal from './AddContactModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface ContactsTabProps {
    userId: string;
}

export default function ContactsTab({ userId }: ContactsTabProps) {
    const router = useRouter();
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [hierarchy, setHierarchy] = useState<{ lead: any; team: any[] }>({ lead: null, team: [] });
    const [manualContacts, setManualContacts] = useState<any[]>([]);

    const loadData = useCallback(async () => {
        setLoading(true);
        const [hResult, cResult] = await Promise.all([
            fetchHierarchyAction(),
            getContactsAction()
        ]);

        if (hResult.success && hResult.data) {
            setHierarchy(hResult.data);
        }
        if (cResult.success && cResult.data) {
            setManualContacts(cResult.data);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleRemoveContact = async (id: string) => {
        if (confirm(t('contacts.remove_confirm'))) {
            const result = await removeContactAction(id);
            if (result.success) {
                setManualContacts(prev => prev.filter(c => c.id !== id));
            }
        }
    };

    const filterList = (list: any[]) => {
        if (!searchTerm) return list;
        return list.filter(u =>
            u?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const filteredTeam = filterList(hierarchy.team);
    const filteredManual = filterList(manualContacts);

    const ContactItem = ({ user, type }: { user: any, type: 'lead' | 'team' | 'manual' }) => (
        <div
            onClick={() => router.push(`/profile/${user.id}`)}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-all cursor-pointer group"
        >
            <div className="relative">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-100 flex items-center justify-center">
                    {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <User size={24} />
                        </div>
                    )}
                </div>
                {type === 'lead' && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        <Shield size={12} className="text-white" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 truncate">
                        {`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username}
                    </h4>
                    <span className="flex-shrink-0 px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 font-black text-[9px] uppercase border border-blue-100">
                        LVL {user.level || 0}
                    </span>
                </div>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                    {user.username ? `@${user.username}` : t('onboarding.hero_title')}
                </p>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity">
                {type === 'manual' && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveContact(user.id);
                        }}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
                <ChevronRight size={20} className="text-gray-300" />
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
                <p className="text-sm text-gray-500 font-medium">{t('common.loading')}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-full">
            {/* Search and Add */}
            <div className="px-6 py-4 flex gap-3 sticky top-[56px] bg-white z-10 border-b border-gray-50">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder={t('contacts.search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-11 h-11 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-90 transition-all"
                >
                    <UserPlus size={20} />
                </button>
            </div>

            <div className="flex-1 space-y-2 pb-24">
                {/* Lead Section */}
                {hierarchy.lead && !searchTerm && (
                    <div className="mt-4">
                        <h3 className="px-6 mb-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('contacts.lead_section')}</h3>
                        <div className="bg-white">
                            <ContactItem user={hierarchy.lead} type="lead" />
                        </div>
                    </div>
                )}

                {/* Team Section */}
                {filteredTeam.length > 0 && (
                    <div className="mt-4">
                        <h3 className="px-6 mb-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('contacts.team_section')} ({filteredTeam.length})</h3>
                        <div className="bg-white divide-y divide-gray-50">
                            {filteredTeam.map(member => (
                                <ContactItem key={member.id} user={member} type="team" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Manual Contacts */}
                {filteredManual.length > 0 && (
                    <div className="mt-4">
                        <h3 className="px-6 mb-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('contacts.manual_section')} ({filteredManual.length})</h3>
                        <div className="bg-white divide-y divide-gray-50">
                            {filteredManual.map(contact => (
                                <ContactItem key={contact.id} user={contact} type="manual" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredTeam.length === 0 && filteredManual.length === 0 && !hierarchy.lead && (
                    <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6">
                            <Users size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{t('contacts.empty_title')}</h3>
                        <p className="text-sm text-gray-400 mb-8">{t('contacts.empty_desc')}</p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-8 py-4 bg-black text-white rounded-3xl font-bold shadow-xl active:scale-95 transition-all flex items-center gap-2"
                        >
                            <UserPlus size={20} />
                            {t('contacts.find_people')}
                        </button>
                    </div>
                )}
            </div>

            <AddContactModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={loadData}
            />
        </div>
    );
}
