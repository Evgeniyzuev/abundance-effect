import React from 'react';
import { Trophy } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldLevel: number;
  newLevel: number;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  newLevel
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-auto text-center shadow-lg">
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="bg-gray-100 rounded-full p-4">
            <Trophy className="w-8 h-8 text-gray-700" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {t('level.level_up_title') || 'New Level!'}
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6 text-sm">
          {t('level.congratulations') || 'Congratulations! You have reached a new level!'}
        </p>

        {/* Level display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-2xl font-bold text-gray-900">{newLevel}</div>
          <div className="text-xs text-gray-500 mt-1">
            {t('level.new') || 'New Level'}
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
        >
          {t('level.continue') || 'Continue'}
        </button>
      </div>
    </div>
  );
};
