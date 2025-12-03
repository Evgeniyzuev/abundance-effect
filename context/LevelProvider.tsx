import React from 'react';
import { LevelUpModal } from '@/components/LevelUpModal';
import { useLevelCheck } from '@/hooks/useLevelCheck';

interface LevelProviderProps {
  children: React.ReactNode;
}

export function LevelProvider({ children }: LevelProviderProps) {
  const { levelUpModal, handleLevelUpModalClose } = useLevelCheck();

  return (
    <>
      {children}
      {levelUpModal && levelUpModal.isOpen && (
        <LevelUpModal
          isOpen={levelUpModal.isOpen}
          onClose={handleLevelUpModalClose}
          oldLevel={levelUpModal.newLevel - 1}
          newLevel={levelUpModal.newLevel}
        />
      )}
    </>
  );
}
