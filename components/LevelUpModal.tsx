import React, { useEffect, useState } from 'react';
import { Trophy, Sparkles, Star } from 'lucide-react';
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
  oldLevel,
  newLevel
}) => {
  const { t } = useLanguage();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Задержка для запуска анимации конфетти
      setTimeout(() => setShowConfetti(true), 500);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Конфетти фон */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-purple-500/10 to-blue-500/10 animate-pulse" />
          {/* Простые конфетти с CSS */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-gradient-to-br from-${
                  ['yellow', 'purple', 'blue', 'green', 'pink'][i % 5]
                }-400 rounded-full animate-bounce`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Модальное окно */}
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl p-8 w-full max-w-md mx-auto text-center shadow-2xl border border-white/20 animate-in slide-in-from-bottom-4 duration-500">
          {/* Иконка с анимацией */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-6 shadow-lg animate-pulse">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              {/* Звездочки вокруг */}
              <div className="absolute -top-2 -right-2">
                <Star className="w-6 h-6 text-yellow-400 fill-current animate-spin" />
              </div>
              <div className="absolute -bottom-1 -left-1">
                <Sparkles className="w-5 h-5 text-purple-500 fill-current animate-bounce" />
              </div>
            </div>
          </div>

          {/* Заголовок */}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent mb-2 animate-in slide-in-from-top-2 duration-700">
            {t('level.level_up_title') || 'Level Up!'}
          </h2>

          {/* Сообщение */}
          <p className="text-gray-600 mb-4 text-lg">
            {t('level.congratulations') || 'Поздравляем! Вы достигли нового уровня!'}
          </p>

          {/* Отображение уровней */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-inner border border-gray-200">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-500 line-through">{oldLevel}</div>
                <div className="text-sm text-gray-400">{t('level.previous') || 'Предыдущий'}</div>
              </div>
              <div className="text-4xl text-yellow-500 animate-pulse">→</div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent animate-bounce">{newLevel}</div>
                <div className="text-sm text-green-500 font-medium">{t('level.new') || 'Новый уровень'}</div>
              </div>
            </div>

            {/* Бонусы уровня */}
            <div className="border-t pt-3">
              <div className="text-sm text-gray-600">
                {t('level.unlock_message') || `Новый уровень даёт дополнительные возможности и бонусы!`}
              </div>
            </div>
          </div>

          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-in slide-in-from-bottom-2 duration-1000"
          >
            {t('level.continue') || 'Продолжить приключение!'}
          </button>
        </div>
      </div>
    </>
  );
};
