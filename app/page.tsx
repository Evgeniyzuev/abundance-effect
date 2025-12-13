'use client';

import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { languages } from '@/utils/translations';

function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm flex items-center gap-2 bg-white/90 backdrop-blur-sm shadow-lg rounded-full border border-gray-200/50"
      >
        <span className="text-lg">🌐</span>
        <span className="hidden sm:inline">{languages[language]}</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-12 right-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-2 min-w-48">
          <div className="text-xs font-medium text-gray-500 mb-2 px-3 py-1">
            {t('onboarding.choose_language')}
          </div>
          {Object.entries(languages).map(([code, name]) => (
            <button
              key={code}
              onClick={() => {
                setLanguage(code as any);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                language === code
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function OnboardingSection({ 
  title, 
  description, 
  children, 
  className = "",
  imagePosition = "right" 
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  imagePosition?: "left" | "right";
}) {
  return (
    <section className={`py-12 px-6 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className={`flex flex-col ${imagePosition === "right" ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-8`}>
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              {title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {description}
            </p>
            {children}
          </div>
          <div className="flex-1">
            <div className="aspect-[4/3] bg-gray-100 rounded-2xl flex items-center justify-center">
              <div className="text-4xl opacity-60">📱</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSection() {
  const { t } = useLanguage();
  
  return (
    <section className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('onboarding.hero_title')}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-6">
            {t('onboarding.hero_subtitle')}
          </p>
          <p className="text-lg text-gray-500 leading-relaxed max-w-3xl mx-auto">
            {t('onboarding.hero_description')}
          </p>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EmotionSection() {
  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Your Transformation Starts Here
          </h2>
          <p className="text-lg text-gray-600">
            From stress and struggle to freedom and abundance
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 p-6 rounded-2xl text-center">
            <div className="text-4xl mb-2">😰</div>
            <div className="font-semibold text-gray-800">Financial Stress</div>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl text-center">
            <div className="text-4xl mb-2">🏖️</div>
            <div className="font-semibold text-gray-800">Freedom & Joy</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgramSection() {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            {t('onboarding.program_title')} 💹
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('onboarding.program_description')}
          </p>
        </div>
        
        <div className="text-center bg-green-50 p-8 rounded-2xl">
          <div className="text-4xl mb-4">📈</div>
          <div className="text-xl font-semibold text-gray-800">$1,000,000 Net Worth</div>
          <div className="text-gray-600 mt-2">From 0 to Millionaire</div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border">
            <span className="text-sm font-medium text-gray-700">Level 1-5</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border">
            <span className="text-sm font-medium text-gray-700">Level 6-10</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border">
            <span className="text-sm font-medium text-gray-700">Level 11-15</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border">
            <span className="text-sm font-medium text-gray-700">Level 16-20</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChallengesSection() {
  const { t } = useLanguage();
  
  return (
    <OnboardingSection
      title={t('onboarding.challenges_title')}
      description={t('onboarding.challenges_description')}
    >
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-orange-50 p-4 rounded-xl">
          <div className="text-2xl mb-2">🏆</div>
          <div className="text-sm font-semibold text-gray-800">Daily Challenges</div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl">
          <div className="text-2xl mb-2">🎖️</div>
          <div className="text-sm font-semibold text-gray-800">Achievements</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="text-2xl mb-2">💎</div>
          <div className="text-sm font-semibold text-gray-800">Rare Rewards</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl">
          <div className="text-2xl mb-2">🔥</div>
          <div className="text-sm font-semibold text-gray-800">Streaks</div>
        </div>
      </div>
    </OnboardingSection>
  );
}

function AiCoreSection() {
  const { t } = useLanguage();
  
  return (
    <OnboardingSection
      title={t('onboarding.ai_core_title')}
      description={t('onboarding.ai_core_description')}
      imagePosition="left"
    >
      <div className="bg-indigo-900 p-6 rounded-2xl text-white mt-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <div className="text-lg font-bold">AI Core</div>
            <div className="text-indigo-200">Lifelong Income</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 p-4 rounded-xl">
            <div className="text-xl font-bold">24/7</div>
            <div className="text-sm text-indigo-200">Always Working</div>
          </div>
          <div className="bg-white/10 p-4 rounded-xl">
            <div className="text-xl font-bold">∞</div>
            <div className="text-sm text-indigo-200">Lifelong Income</div>
          </div>
        </div>
      </div>
    </OnboardingSection>
  );
}

function CtaSection() {
  const { t } = useLanguage();
  const { user } = useUser();
  
  return (
    <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-3xl mx-auto text-center text-white">
        <h2 className="text-3xl lg:text-4xl font-bold mb-6">
          {t('onboarding.cta_title')}
        </h2>
        <p className="text-xl mb-8 opacity-90 leading-relaxed">
          {t('onboarding.cta_description')}
        </p>
        <Link
          href={user ? "/challenges" : "/login"}
          className="inline-flex items-center gap-3 bg-white text-gray-900 font-bold px-8 py-4 rounded-2xl text-lg hover:bg-gray-100 transition-colors shadow-lg"
        >
          <span>{user ? 'Continue' : t('onboarding.get_started')}</span>
          <span className="text-xl">{user ? '🎯' : '🚀'}</span>
        </Link>
      </div>
    </section>
  );
}

function HomeContent() {
  const { user, isLoading } = useUser();
  const { t } = useLanguage();
  const router = useRouter();
  const [skipOnboarding, setSkipOnboarding] = useState(false);

  const ONBOARDING_SKIP_KEY = 'abundance_skip_onboarding';

  // Simple skip onboarding check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const skipOnboardingValue = localStorage.getItem(ONBOARDING_SKIP_KEY);
      if (skipOnboardingValue === 'true') {
        setSkipOnboarding(true);
      }
    }
  }, []);

  // Handle skip onboarding for logged-in users
  useEffect(() => {
    if (user && !isLoading && skipOnboarding) {
      router.push('/challenges');
    }
  }, [user, isLoading, skipOnboarding, router]);

  const handleSkipOnboardingChange = (checked: boolean) => {
    setSkipOnboarding(checked);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_SKIP_KEY, checked.toString());
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-900 text-xl mb-4 font-medium">
            Загрузка...
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LanguageSelector />
      
      <HeroSection />
      <EmotionSection />
      <ProgramSection />
      <ChallengesSection />
      <AiCoreSection />
      
      {/* Wish Fulfillment Section */}
      <OnboardingSection
        title={t('onboarding.wishes_title')}
        description={t('onboarding.wishes_description')}
        className="bg-pink-50"
      >
        <div className="space-y-4 mt-6">
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
            <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">💫</span>
            </div>
            <div>
              <div className="font-semibold text-gray-800">Set Your Dreams</div>
              <div className="text-sm text-gray-600">Define what you truly want</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📈</span>
            </div>
            <div>
              <div className="font-semibold text-gray-800">Track Progress</div>
              <div className="text-sm text-gray-600">Monitor your journey daily</div>
            </div>
          </div>
        </div>
      </OnboardingSection>

      {/* Learning Section */}
      <OnboardingSection
        title={t('onboarding.learning_title')}
        description={t('onboarding.learning_description')}
        className="bg-gray-50"
      >
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-2xl mb-2">📚</div>
            <div className="font-semibold text-gray-800">Exclusive Content</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-2xl mb-2">💡</div>
            <div className="font-semibold text-gray-800">Proven Strategies</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-2xl mb-2">🎓</div>
            <div className="font-semibold text-gray-800">Expert Insights</div>
          </div>
        </div>
      </OnboardingSection>
      
      <CtaSection />
      
      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-center">
        <div className="text-gray-400 text-sm">
          © 2024 Abundance Effect. Transform your life.
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
