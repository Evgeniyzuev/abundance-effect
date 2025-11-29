import React from 'react';
import { CheckCircle, Trophy } from 'lucide-react';
import { formatChallengeReward } from '@/utils/challengeTranslations';

interface ChallengeCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: any;
}

export const ChallengeCompletionModal: React.FC<ChallengeCompletionModalProps> = ({
  isOpen,
  onClose,
  challenge
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-4 flex justify-center">
          <div className="bg-green-100 rounded-full p-3">
            <Trophy className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Challenge Completed!
        </h2>

        {/* Challenge Name */}
        <p className="text-gray-600 mb-4">
          {challenge?.title?.en || 'Challenge'}
        </p>

        {/* Reward Info */}
        <div className="bg-gray-50 rounded-lg p-3 mb-6">
          <div className="text-sm text-gray-600 mb-1">Your reward:</div>
          <div className="font-semibold text-gray-900">
            {formatChallengeReward(challenge)}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Great!
        </button>
      </div>
    </div>
  );
};
