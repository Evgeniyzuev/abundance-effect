'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { TranslationKey } from '@/utils/translations';

interface ProjectDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: any;
    onApply: (message: string) => Promise<void>;
    isApplying: boolean;
}

export function ProjectDetailModal({
    isOpen,
    onClose,
    project,
    onApply,
    isApplying
}: ProjectDetailModalProps) {
    const { t, language } = useLanguage();
    const [message, setMessage] = useState('');

    if (!project) return null;

    const title = project.title[language] || project.title['en'] || project.title['ru'] || '';
    const description = project.description[language] || project.description['en'] || project.description['ru'] || '';
    const instructions = project.instructions?.[language] || project.instructions?.['en'] || project.instructions?.['ru'] || '';
    const requirements = project.requirements?.[language] || project.requirements?.['en'] || project.requirements?.['ru'] || '';

    const status = project.userApplication?.status;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 pb-20 sm:pb-4 text-left">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        className="relative w-[calc(100%-1rem)] sm:w-full max-w-lg bg-white rounded-3xl sm:rounded-2xl overflow-hidden shadow-xl max-h-[85vh] sm:max-h-[90vh] flex flex-col"
                    >
                        {/* Header Image */}
                        <div className="relative h-48 sm:h-56">
                            {project.image_url ? (
                                <img
                                    src={project.image_url}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <Send size={64} className="text-white opacity-50" />
                                </div>
                            )}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-wider">
                                    {project.category || 'Project'}
                                </span>
                                {status && (
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${status === 'approved' ? 'bg-green-100 text-green-700' :
                                        status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {t(`projects.${status}` as TranslationKey)}
                                    </span>
                                )}
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-gray-50 rounded-2xl flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl shadow-sm">
                                        <Users className="text-blue-500" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-500 font-medium">Participants</div>
                                        <div className="text-sm font-bold">{project.current_participants}/{project.max_participants || '∞'}</div>
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-2xl flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl shadow-sm">
                                        <Clock className="text-orange-500" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-500 font-medium">Deadline</div>
                                        <div className="text-sm font-bold">
                                            {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">About Project</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {description}
                                    </p>
                                </div>

                                {instructions && (
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{t('challenges.instructions')}</h3>
                                        <div className="bg-blue-50 rounded-2xl p-4 text-blue-900 text-sm italic">
                                            {instructions}
                                        </div>
                                    </div>
                                )}

                                {requirements && (
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{t('challenges.requirements')}</h3>
                                        <div className="bg-gray-50 rounded-2xl p-4 text-gray-600 text-sm">
                                            {requirements}
                                        </div>
                                    </div>
                                )}

                                {!status && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <h3 className="text-sm font-bold text-gray-900 mb-3">{t('projects.application_message')}</h3>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="..."
                                            className="w-full h-24 p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-white border-t border-gray-100 pb-safe">
                            {!status ? (
                                <button
                                    onClick={() => onApply(message)}
                                    disabled={isApplying}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isApplying ? (
                                        <Clock className="animate-spin" size={20} />
                                    ) : (
                                        <Send size={20} />
                                    )}
                                    {t('projects.send_application')}
                                </button>
                            ) : (
                                <div className={`flex items-center justify-center gap-2 font-bold py-4 rounded-2xl ${status === 'approved' ? 'bg-green-50 text-green-700' :
                                    status === 'pending' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
                                    }`}>
                                    {status === 'approved' ? <CheckCircle2 size={20} /> : status === 'pending' ? <Clock size={20} /> : <AlertCircle size={20} />}
                                    {t(`projects.${status}` as TranslationKey)}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
