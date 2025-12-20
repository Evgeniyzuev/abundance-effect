import { Language } from '@/utils/translations';
import { Challenge } from '@/types/supabase';
import React from 'react';
import { Atom } from 'lucide-react';

// Utility function to safely get translated text from challenge
export function getChallengeText(
  translations: Record<string, string> | null,
  language: Language,
  fallback: string = ''
): string {
  if (!translations) return fallback;

  // Try current language first
  if (translations[language]) {
    return translations[language];
  }

  // Fallback to English
  if (translations['en']) {
    return translations['en'];
  }

  // Last resort fallback
  return fallback;
}

// Get translated title for a challenge
export function getChallengeTitle(challenge: Challenge, language: Language): string {
  return getChallengeText(
    challenge.title as Record<string, string> | null,
    language,
    'Untitled Challenge'
  );
}

// Get translated description for a challenge
export function getChallengeDescription(challenge: Challenge, language: Language): string {
  return getChallengeText(
    challenge.description as Record<string, string> | null,
    language,
    'No description available'
  );
}

// Get translated instructions for a challenge
export function getChallengeInstructions(challenge: any, language: Language): string {
  return getChallengeText(
    challenge.instructions as Record<string, string> | null,
    language,
    ''
  );
}

// Get translated requirements for a challenge
export function getChallengeRequirements(challenge: any, language: Language): string {
  return getChallengeText(
    challenge.requirements as Record<string, string> | null,
    language,
    ''
  );
}

// Get display name for challenge owner
export function getChallengeOwnerName(challenge: Challenge): string {
  return challenge.owner_name || 'System';
}

// Format reward display as JSX with icons
export function formatChallengeReward(challenge: Challenge): React.ReactElement {
  const coreReward = challenge.reward_core as string || '';
  const itemRewards = challenge.reward_items as any[] || [];

  const rewardParts: React.ReactElement[] = [];

  // Parse core reward: e.g., "1$" (guaranteed 1 core) or "1$+?" (guaranteed 1 + random)
  if (coreReward && typeof coreReward === 'string') {
    const coreMatch = coreReward.match(/^(\d+)\$/) || coreReward.match(/^(\d+)\$\+\?/);
    if (coreMatch) {
      const amount = parseInt(coreMatch[1], 10);
      const isRandom = coreReward.includes('+?');

      rewardParts.push(
        React.createElement('span', {
          key: 'core',
          className: 'flex items-center gap-0.5'
        }, [
          React.createElement(Atom, { key: 'atom', className: 'w-3 h-3 text-orange-500' }),
          React.createElement('span', {
            key: 'amount',
            className: 'text-sm font-medium text-green-700'
          }, `+${amount}${isRandom ? '+?' : ''}$`)
        ])
      );
    }
  }

  // Items: 🎒 for items (only if guaranteed count > 0)
  if (itemRewards.length > 0) {
    const guaranteedItems = itemRewards.length; // Assume all items are guaranteed

    rewardParts.push(
      React.createElement('span', {
        key: 'items',
        className: 'flex items-center gap-0.5'
      }, [
        React.createElement('span', { key: 'icon', className: 'text-sm' }, '🎒'),
        React.createElement('span', {
          key: 'amount',
          className: 'text-sm font-medium text-purple-600'
        }, guaranteedItems.toString())
      ])
    );
  }

  return React.createElement('div', {
    className: 'flex flex-wrap items-center gap-1'
  }, rewardParts);
}

// Check if challenge is expired
export function isChallengeExpired(challenge: Challenge): boolean {
  if (!challenge.deadline) return false;

  const deadline = new Date(challenge.deadline);
  const now = new Date();

  return deadline < now;
}

// Get challenge status for display
export function getChallengeStatus(challenge: Challenge): 'available' | 'expired' | 'full' {
  if (isChallengeExpired(challenge)) {
    return 'expired';
  }

  if (challenge.max_participants > 0 && challenge.current_participants >= challenge.max_participants) {
    return 'full';
  }

  return 'available';
}

// Get challenge type display name
export function getChallengeTypeName(type: Challenge['type'], language: Language): string {
  const typeNames: Record<Challenge['type'], Record<Language, string>> = {
    system: {
      en: 'System Challenge',
      zh: '系统挑战',
      es: 'Desafío del Sistema',
      hi: 'सिस्टम चैलेंज',
      ar: 'تحدي النظام',
      ru: 'Системный Челлендж'
    },
    user_created: {
      en: 'User Challenge',
      zh: '用户挑战',
      es: 'Desafío de Usuario',
      hi: 'उपयोगकर्ता चैलेंज',
      ar: 'تحدي المستخدم',
      ru: 'Пользовательский Челлендж'
    },
    event: {
      en: 'Event',
      zh: '活动',
      es: 'Evento',
      hi: 'इवेंट',
      ar: 'فعالية',
      ru: 'Событие'
    },
    tournament: {
      en: 'Tournament',
      zh: '锦标赛',
      es: 'Torneo',
      hi: 'टूर्नामेंट',
      ar: 'بطولة',
      ru: 'Турнир'
    }
  };

  return typeNames[type]?.[language] || typeNames[type]?.['en'] || type;
}

// Get verification type display name
export function getVerificationTypeName(type: Challenge['verification_type'], language: Language): string {
  const verificationNames: Record<Challenge['verification_type'], Record<Language, string>> = {
    auto: {
      en: 'Auto-verified',
      zh: '自动验证',
      es: 'Verificación automática',
      hi: 'स्वतः सत्यापित',
      ar: 'تحقق تلقائي',
      ru: 'Автопроверка'
    },
    manual_peer: {
      en: 'Peer Review',
      zh: '同行评审',
      es: 'Revisión por pares',
      hi: 'सहकर्मी समीक्षा',
      ar: 'مراجعة الأقران',
      ru: 'Проверка пирами'
    },
    manual_creator: {
      en: 'Creator Review',
      zh: '创建者评审',
      es: 'Revisión del creador',
      hi: 'निर्माता समीक्षा',
      ar: 'مراجعة المنشئ',
      ru: 'Проверка создателем'
    }
  };

  return verificationNames[type]?.[language] || verificationNames[type]?.['en'] || type;
}
