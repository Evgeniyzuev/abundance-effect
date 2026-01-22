import React from 'react';
import { X, Trophy, Info, ListChecks, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
    getChallengeTitle,
    getChallengeDescription,
    getChallengeInstructions,
    getChallengeRequirements,
    formatChallengeReward,
    getChallengeTypeName,
    getVerificationTypeName
} from '@/utils/challengeTranslations';
import { motion, AnimatePresence } from 'framer-motion';
import AppTestingForm from './challenges/AppTestingForm';

interface ChallengeDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    challenge: any;
    onAction?: (progressData?: any) => void;
    actionLoading?: boolean;
}

export const ChallengeDetailModal: React.FC<ChallengeDetailModalProps> = ({
    isOpen,
    onClose,
    challenge,
    onAction,
    actionLoading
}) => {
    const { t, language } = useLanguage();

    if (!isOpen || !challenge) return null;

    const instructions = getChallengeInstructions(challenge, language);
    const requirements = getChallengeRequirements(challenge, language);
    const challengeLevel = challenge.level || 1;
    const isCompleted = challenge.userParticipation?.status === 'completed';
    const isActive = challenge.userParticipation?.status === 'active';
    const isAppTesting = challenge.verification_logic === 'app_testing';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 pb-20 sm:pb-4 text-left">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="relative bg-[#F2F2F7] sm:bg-white w-[calc(100%-1rem)] sm:w-full max-w-lg rounded-3xl sm:rounded-2xl overflow-hidden max-h-[85vh] sm:max-h-[90vh] flex flex-col shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                                <Trophy className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                                    {getChallengeTitle(challenge, language)}
                                </h2>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                                        Lvl {challengeLevel}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {getChallengeTypeName(challenge.type, language)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="overflow-y-auto flex-1 p-4 pb-10 space-y-6">
                        {/* Image if available */}
                        {challenge.image_url && (
                            <div className="rounded-2xl overflow-hidden h-48 w-full bg-gray-100">
                                <img
                                    src={challenge.image_url}
                                    alt={getChallengeTitle(challenge, language)}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Special App Testing Form */}
                        {isActive && isAppTesting ? (
                            <section className="bg-white p-4 rounded-2xl shadow-sm">
                                <AppTestingForm onSuccess={(progressData) => onAction?.(progressData)} />
                            </section>
                        ) : (
                            <>
                                {/* Description */}
                                <section className="bg-white p-4 rounded-2xl shadow-sm">
                                    <div className="flex items-center gap-2 mb-2 text-blue-600">
                                        <Info className="w-5 h-5" />
                                        <h3 className="font-semibold">{t('goals.wish_description')}</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                        {getChallengeDescription(challenge, language)}
                                    </p>
                                </section>
                            </>
                        )}

                        {/* Requirements if available */}
                        {requirements && (
                            <section className="bg-white p-4 rounded-2xl shadow-sm">
                                <div className="flex items-center gap-2 mb-2 text-purple-600">
                                    <ListChecks className="w-5 h-5" />
                                    <h3 className="font-semibold">{t('challenges.requirements')}</h3>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                    {requirements}
                                </p>
                                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Verification:</span>
                                    <span className="font-medium text-gray-700">
                                        {getVerificationTypeName(challenge.verification_type, language)}
                                    </span>
                                </div>
                            </section>
                        )}

                        {/* Instructions if available */}
                        {!isAppTesting && instructions && (
                            <section className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-blue-500">
                                <h3 className="font-semibold text-gray-900 mb-2">{t('challenges.instructions')}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                    {instructions}
                                </p>
                            </section>
                        )}

                        {/* Rewards */}
                        <section className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 rounded-2xl border border-orange-200/50">
                            <h3 className="text-sm font-semibold text-orange-800 uppercase tracking-wider mb-3">
                                {t('challenges.your_reward')}
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {formatChallengeReward(challenge)}
                            </div>
                        </section>

                        {/* Constraints */}
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 px-2">
                            {challenge.deadline && (
                                <div className="flex items-center gap-1.5">
                                    <span className="text-lg">⏰</span>
                                    <span>{new Date(challenge.deadline).toLocaleDateString()}</span>
                                </div>
                            )}
                            {challenge.max_participants > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <span className="text-lg">👥</span>
                                    <span>{challenge.current_participants} / {challenge.max_participants}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Action */}
                    <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0 pb-safe">
                        {(!isActive || !isAppTesting) && (
                            <button
                                onClick={() => onAction?.()}
                                disabled={isCompleted || actionLoading}
                                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${isCompleted
                                    ? 'bg-green-100 text-green-700'
                                    : isActive
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                                        : 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-200'
                                    } disabled:opacity-70`}
                            >
                                {actionLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : isCompleted ? (
                                    <>
                                        <ListChecks className="w-5 h-5" />
                                        {t('tasks.completed')}
                                    </>
                                ) : isActive ? (
                                    <>
                                        {t('challenges.check')}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                ) : (
                                    <>
                                        {t('challenges.join')}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
