'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useChallenges } from '@/hooks/useChallenges';
import { getChallengeTitle, getChallengeOwnerName, formatChallengeReward, getChallengeTypeName } from '@/utils/challengeTranslations';
import { CheckCircle, Users, Trophy, Atom, Loader2, RotateCcw } from 'lucide-react';
import { ChallengeCompletionModal } from '@/components/ChallengesCompletionModal';

type ChallengeSection = 'available' | 'accepted' | 'completed';

export default function ChallengesPage() {
    const { t, language } = useLanguage();
    const {
        challengesWithParticipation,
        joinChallenge,
        updateParticipation,
        completedChallenge,
        showCompletionModal,
        setShowCompletionModal,
        checkingChallenges,
        fetchChallenges
    } = useChallenges();

    const [expandedSection, setExpandedSection] = useState<ChallengeSection>('available');

    // Filter challenges by status
    const availableChallenges = challengesWithParticipation.filter(challenge =>
        !challenge.userParticipation
    );

    const acceptedChallenges = challengesWithParticipation.filter(challenge =>
        challenge.userParticipation?.status === 'active'
    );

    const completedChallenges = challengesWithParticipation.filter(challenge =>
        challenge.userParticipation?.status === 'completed'
    );

    const toggleSection = (section: ChallengeSection) => {
        setExpandedSection(expandedSection === section ? 'available' : section);
    };

    const getSectionIcon = (section: ChallengeSection, count: number) => {
        switch (section) {
            case 'available':
                return <Users className="w-5 h-5" />;
            case 'accepted':
                return <Trophy className="w-5 h-5" />;
            case 'completed':
                return <CheckCircle className="w-5 h-5" />;
        }
    };

    const getSectionTitle = (section: ChallengeSection, count: number) => {
        const titles = {
            available: t('challenges.available') || 'Available Challenges',
            accepted: t('challenges.accepted') || 'Accepted Challenges',
            completed: t('challenges.completed') || 'Completed Challenges'
        };
        return `${titles[section]} (${count})`;
    };

    const ChallengeCard = ({ challenge }: { challenge: any }) => {
        const challengeLevel = challenge.level || 1;

        // Get remaining spots (only show if limited and > 0)
        const spotsLeft = challenge.max_participants
            ? challenge.max_participants - challenge.current_participants
            : null;

        return (
            <div className="ios-card p-1 mb-2 relative">
                {/* Challenge image - positioned absolutely to be full height and extend outside padding */}
                <div className="absolute left-0 top-0 bottom-0 flex items-center">
                    {challenge.image_url ? (
                        <img
                            src={challenge.image_url}
                            alt={getChallengeTitle(challenge, language)}
                            className="w-16 h-full rounded-lg object-cover bg-gray-100"
                        />
                    ) : (
                        <div className="w-16 h-full rounded-lg bg-gray-200 flex items-center justify-center">
                            <Trophy className="w-7 h-7 text-gray-400" />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 ml-20">
                    {/* Main content */}

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            {/* Title and level */}
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                <h3 className="font-semibold text-sm text-gray-900 truncate">
                                    {getChallengeTitle(challenge, language)}
                                </h3>
                                <span className="text-xs font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded flex-shrink-0">
                                    Lvl {challengeLevel}
                                </span>
                            </div>

                            {/* Action button */}
                            <button
                                onClick={async () => {
                                    if (challenge.userParticipation) {
                                        // For challenge completion, we need to wait for server response (no optimistic UI)
                                        // because verification script runs on server and may reject completion
                                        await updateParticipation(challenge.id, 'completed');
                                    } else {
                                        // Join can use optimistic UI since it's straightforward
                                        await joinChallenge(challenge.id);
                                    }
                                }}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ml-2 flex items-center gap-1 ${
                                    challenge.userParticipation?.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : challenge.userParticipation?.status === 'active'
                                            ? 'bg-blue-500 text-blue-800 hover:bg-blue-700' // Changed from blue-100 to blue-500 for better contrast
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                                disabled={challenge.userParticipation?.status === 'completed' || checkingChallenges.has(challenge.id)}
                            >
                                {checkingChallenges.has(challenge.id) ? (
                                    <>
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        {t('challenges.checking')}
                                    </>
                                ) : challenge.userParticipation?.status === 'completed'
                                ? <CheckCircle className="w-3 h-3" />
                                : challenge.userParticipation?.status === 'active'
                                    ? t('challenges.check')
                                    : t('challenges.join')
                                }
                            </button>
                        </div>

                        {/* Reward and constraints in one line */}
                        <div className="flex items-center justify-between mt-1">
                            {/* Reward display */}
                            <div className="flex items-center gap-1">
                                {formatChallengeReward(challenge)}
                            </div>

                            {/* Constraints (deadline or spots) */}
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                {challenge.deadline && (
                                    <span className="flex items-center gap-0.5">
                                        <span>⏰</span>
                                        <span>{new Date(challenge.deadline).toLocaleDateString()}</span>
                                    </span>
                                )}
                                {spotsLeft !== null && spotsLeft > 0 && (
                                    <span className="flex items-center gap-0.5">
                                        <Users className="w-3 h-3" />
                                        <span>{spotsLeft}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ChallengeSection = ({ title, count, section, challenges }: {
        title: string;
        count: number;
        section: ChallengeSection;
        challenges: any[];
    }) => (
        <div className="mb-4">
            <button
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center">
                    {getSectionIcon(section, count)}
                    <span className="ml-3 font-semibold text-gray-900">{title} ({count})</span>
                </div>
                <div className={`transform transition-transform ${expandedSection === section ? 'rotate-180' : ''}`}>
                    ▼
                </div>
            </button>

            {expandedSection === section && (
                <div className="mt-2 space-y-2">
                    {challenges.length === 0 ? (
                        <div className="ios-card p-4 text-center text-ios-secondary">
                            {t('challenges.no_challenges_yet')}
                        </div>
                    ) : (
                        challenges.map(challenge => (
                            <ChallengeCard key={challenge.id} challenge={challenge} />
                        ))
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="pb-20 px-4">
            {/* Page Header */}
            <div className="pt-6 pb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{t('challenges.page_title')}</h1>
                <button
                    onClick={() => fetchChallenges()}
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    title="Refresh challenges"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            {/* Challenge Sections */}
            <div className="space-y-4">
                <ChallengeSection
                    title={getSectionTitle('available', availableChallenges.length)}
                    count={availableChallenges.length}
                    section="available"
                    challenges={availableChallenges}
                />

                <ChallengeSection
                    title={getSectionTitle('accepted', acceptedChallenges.length)}
                    count={acceptedChallenges.length}
                    section="accepted"
                    challenges={acceptedChallenges}
                />

                <ChallengeSection
                    title={getSectionTitle('completed', completedChallenges.length)}
                    count={completedChallenges.length}
                    section="completed"
                    challenges={completedChallenges}
                />
            </div>

            {/* Completion Modal */}
            <ChallengeCompletionModal
                isOpen={showCompletionModal}
                onClose={() => setShowCompletionModal(false)}
                challenge={completedChallenge}
            />
        </div>
    );
}
