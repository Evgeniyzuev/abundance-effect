import { Language } from '@/utils/translations';
import { Challenge } from '@/types/supabase';

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

// Get display name for challenge owner
export function getChallengeOwnerName(challenge: Challenge): string {
  return challenge.owner_name || 'System';
}

// Format reward display
export function formatChallengeReward(challenge: Challenge): string {
  const coreReward = challenge.reward_core;
  const itemRewards = challenge.reward_items as any[];

  let rewardText = '';

  if (coreReward > 0) {
    rewardText += `${coreReward} Core`;
  }

  if (itemRewards && itemRewards.length > 0) {
    if (rewardText) rewardText += ' + ';
    rewardText += `${itemRewards.length} item${itemRewards.length > 1 ? 's' : ''}`;
  }

  return rewardText || 'No rewards';
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
