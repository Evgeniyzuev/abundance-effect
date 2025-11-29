'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useChallenges } from '@/hooks/useChallenges';
import { getChallengeTitle, getChallengeDescription, getChallengeOwnerName, formatChallengeReward, getChallengeTypeName } from '@/utils/challengeTranslations';
import { CheckCircle, Users, Trophy } from 'lucide-react';

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

    const ChallengeCard = ({ challenge }: { challenge: any }) => (
        <div className="ios-card p-4 mb-3">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">
                        {getChallengeTitle(challenge, 'en')}
                    </h3>
                    <p className="text-sm text-ios-secondary mb-2">
                        {getChallengeDescription(challenge, 'en')}
                    </p>
                    <div className="flex items-center text-xs text-ios-secondary mb-3">
                        <span>By {getChallengeOwnerName(challenge)}</span>
                        <span className="mx-2">•</span>
                        <span>{getChallengeTypeName(challenge.type, 'en')}</span>
                        <span className="mx-2">•</span>
                        <span>{challenge.current_participants} joined</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-green-600">
                    Reward: {formatChallengeReward(challenge)}
                </div>

                <button
                    onClick={() => challenge.userParticipation
                        ? updateParticipation(challenge.id, 'completed')
                        : joinChallenge(challenge.id)
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        challenge.userParticipation?.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    disabled={challenge.userParticipation?.status === 'completed'}
                >
                    {challenge.userParticipation?.status === 'completed'
                        ? 'Completed'
                        : challenge.userParticipation
                            ? 'Mark Complete'
                            : 'Join Challenge'
                    }
                </button>
            </div>
        </div>
    );

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
