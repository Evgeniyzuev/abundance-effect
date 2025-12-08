import React, { useEffect, useState } from 'react';
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
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger fireworks animation after modal appears
      setTimeout(() => setShowFireworks(true), 300);
    } else {
      setShowFireworks(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Fireworks animation */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${20 + (i * 6)}%`,
                top: `${15 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '2s',
              }}
            >
              <div className="w-2 h-2 bg-yellow-400 rounded-full opacity-80"></div>
            </div>
          ))}
          {[...Array(8)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute animate-pulse"
              style={{
                left: `${25 + (i * 8)}%`,
                top: `${10 + (i % 2) * 30}%`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1.5s',
              }}
            >
              <div className="w-1 h-1 bg-pink-400 rounded-full opacity-60"></div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-auto text-center shadow-lg relative overflow-hidden">
        {/* Celebration background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-pink-50 opacity-30 rounded-2xl"></div>

        {/* Icon */}
        <div className="mb-4 flex justify-center relative z-10">
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full p-4 shadow-lg animate-bounce">
            <Trophy className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2 relative z-10">
          {t('level.level_up_title') || 'Level Up!'}
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6 text-sm relative z-10">
          {t('level.congratulations') || 'Congratulations! You\'ve reached a new level!'}
        </p>

        {/* Level display */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border-2 border-yellow-200 shadow-inner relative z-10">
          <div className="text-3xl font-bold text-gray-900 animate-pulse">{newLevel}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">
            {t('level.new') || 'New Level'}
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 relative z-10"
        >
          {t('level.continue') || 'Continue'}
        </button>
      </div>
    </div>
  );
};
