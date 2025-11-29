'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useChallenges } from '@/hooks/useChallenges';
import { getChallengeTitle, getChallengeOwnerName, formatChallengeReward, getChallengeTypeName } from '@/utils/challengeTranslations';
import { CheckCircle, Users, Trophy, Atom } from 'lucide-react';

type ChallengeSection = 'available' | 'accepted' | 'completed';

export default function ChallengesPage() {
    const { t } = useLanguage();
    const {
        challengesWithParticipation,
        joinChallenge,
        updateParticipation
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
        // Calculate challenge level (for now, simple calculation based on reward_core)
        const getChallengeLevel = (challenge: any) => {
            const coreReward = challenge.reward_core || 0;
            if (coreReward === 0) return 0;
            if (coreReward < 10) return 1;
            if (coreReward < 50) return 2;
            if (coreReward < 100) return 3;
            return 4;
        };

        return (
            <div className="ios-card p-3 mb-3">
                <div className="flex items-start gap-3">
                    {/* Challenge image thumbnail */}
                    <div className="flex-shrink-0">
                        {challenge.image_url ? (
                            <img
                                src={challenge.image_url}
                                alt={getChallengeTitle(challenge, 'en')}
                                className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-gray-400" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Title and level */}
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm text-gray-900 truncate">
                                {getChallengeTitle(challenge, 'en')}
                            </h3>
                            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                                Lvl {getChallengeLevel(challenge)}
                            </span>
                        </div>

                        {/* Reward display */}
                        <div className="flex flex-wrap items-center gap-1 mb-2">
                            {formatChallengeReward(challenge)}
                        </div>

                        {/* Deadline and spots */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-3">
                                {challenge.deadline && (
                                    <span className="flex items-center gap-1">
                                        <span>⏰</span>
                                        <span>{new Date(challenge.deadline).toLocaleDateString()}</span>
                                    </span>
                                )}
                                {challenge.max_participants && (
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        <span>
                                            {challenge.max_participants - challenge.current_participants || 0}/{challenge.max_participants}
                                        </span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action button */}
                    <div className="flex-shrink-0 ml-2">
                        <button
                            onClick={() => challenge.userParticipation
                                ? updateParticipation(challenge.id, 'completed')
                                : joinChallenge(challenge.id)
                            }
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                challenge.userParticipation?.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : challenge.userParticipation?.status === 'active'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                            disabled={challenge.userParticipation?.status === 'completed'}
                        >
                            {challenge.userParticipation?.status === 'completed'
                                ? '✓'
                                : challenge.userParticipation?.status === 'active'
                                    ? 'Active'
                                    : 'Join'
                            }
                        </button>
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
                            No challenges yet
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
            <div className="pt-6 pb-4">
                <h1 className="text-2xl font-bold text-gray-900">Challenges</h1>
                <p className="text-ios-secondary mt-1">Complete challenges to earn rewards</p>
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
        </div>
    );
}
