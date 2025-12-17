'use client';

import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { languages } from '@/utils/translations';
import { Shield, Globe, Heart } from 'lucide-react';

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

function HeroSection() {
  const { t } = useLanguage();
  const { user } = useUser();
  
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-3xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/icon-512.png"
            alt="Abundance Effect"
            width={100}
            height={100}
            className="mx-auto rounded-2xl shadow-lg"
          />
        </div>
        
        {/* Bright Title */}
        <h1 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
          {t('onboarding.hero_title')}
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
          {t('onboarding.hero_subtitle')}
        </p>
        
        {/* Start Button */}
        <Link
          href={user ? "/challenges" : "/login"}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
        >
          <span>{t('onboarding.get_started')}</span>
          <span className="text-xl">🚀</span>
        </Link>
      </div>
    </section>
  );
}

function ProgramSection() {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {t('onboarding.program_title')} 💹
          </h2>
          <p className="text-lg text-amber-600 font-medium mb-4">
            {t('onboarding.program_subtitle')}
          </p>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {t('onboarding.program_description')}
          </p>
        </div>
        
        {/* Double Layout - Level 1 and Level 20 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl text-center">
            <div className="text-4xl mb-3">🌱</div>
            <div className="text-lg font-semibold text-gray-800">{t('onboarding.level_1')}</div>
            <div className="text-sm text-gray-600 mt-1">{t('onboarding.first_step')}</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl text-center">
            <div className="text-4xl mb-3">👑</div>
            <div className="text-lg font-semibold text-gray-800">{t('onboarding.level_20')}</div>
            <div className="text-sm text-gray-600 mt-1">$1 000 000</div>
          </div>
        </div>
        
        {/* Emotion cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-xl text-center">
            <div className="text-3xl mb-2">😰</div>
            <div className="text-sm font-semibold text-gray-800">{t('onboarding.financial_stress')}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center">
            <div className="text-3xl mb-2">🏖️</div>
            <div className="text-sm font-semibold text-gray-800">{t('onboarding.freedom_joy')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChallengesSection() {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {t('onboarding.challenges_title')} 🏆
          </h2>
          <p className="text-lg text-amber-600 font-medium mb-4">
            {t('onboarding.challenges_subtitle')}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {t('onboarding.challenges_description')}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 p-4 rounded-xl">
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-sm font-semibold text-gray-800">{t('onboarding.daily_challenges')}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="text-2xl mb-2">🎖️</div>
            <div className="text-sm font-semibold text-gray-800">{t('onboarding.achievements')}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="text-2xl mb-2">💎</div>
            <div className="text-sm font-semibold text-gray-800">{t('onboarding.rare_rewards')}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="text-2xl mb-2">🔥</div>
            <div className="text-sm font-semibold text-gray-800">{t('onboarding.streaks')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AiCoreSection() {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {t('onboarding.ai_core_title')} 🤖
          </h2>
          <p className="text-lg text-amber-600 font-medium mb-4">
            {t('onboarding.ai_core_subtitle')}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {t('onboarding.ai_core_description')}
          </p>
        </div>
        
        <div className="bg-indigo-900 p-6 rounded-2xl text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <div className="text-lg font-bold">AI Core</div>
              <div className="text-indigo-200">{t('onboarding.lifelong_income')}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-xl font-bold">24/7</div>
              <div className="text-sm text-indigo-200">{t('onboarding.always_working')}</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-xl font-bold">26%</div>
              <div className="text-sm text-indigo-200">{t('onboarding.annual_growth')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SuccessStoriesSection() {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {t('onboarding.success_title')} 🌟
          </h2>
          <p className="text-lg text-amber-600 font-medium mb-4">
            {t('onboarding.success_subtitle')}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {t('onboarding.success_description')}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 p-6 rounded-2xl text-center">
            <div className="text-4xl mb-2">📖</div>
            <div className="font-semibold text-gray-800">{t('onboarding.success_stories')}</div>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl text-center">
            <div className="text-4xl mb-2">🧠</div>
            <div className="font-semibold text-gray-800">{t('onboarding.ai_mentor')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WishesSection() {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 px-6 bg-pink-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {t('onboarding.wishes_title')} ✨
          </h2>
          <p className="text-lg text-amber-600 font-medium mb-4">
            {t('onboarding.wishes_subtitle')}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {t('onboarding.wishes_description')}
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
            <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">💫</span>
            </div>
            <div>
              <div className="font-semibold text-gray-800">{t('onboarding.define_dreams')}</div>
              <div className="text-sm text-gray-600">{t('onboarding.what_you_want')}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📈</span>
            </div>
            <div>
              <div className="font-semibold text-gray-800">{t('onboarding.track_progress')}</div>
              <div className="text-sm text-gray-600">{t('onboarding.track_daily')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BusinessSection() {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {t('onboarding.business_title')} 💼
          </h2>
          <p className="text-lg text-amber-600 font-medium mb-4">
            {t('onboarding.business_subtitle')}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {t('onboarding.business_description')}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-6 rounded-2xl text-center">
            <div className="text-4xl mb-2">💼</div>
            <div className="font-semibold text-gray-800">{t('onboarding.business')}</div>
            <div className="text-sm text-gray-600 mt-1">{t('onboarding.insights_analytics')}</div>
          </div>
          <div className="bg-orange-50 p-6 rounded-2xl text-center">
            <div className="text-4xl mb-2">⚙️</div>
            <div className="font-semibold text-gray-800">Tech Tools</div>
            <div className="text-sm text-gray-600 mt-1">{t('onboarding.automation')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PayYourselfSection() {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {t('onboarding.pay_first_title')} 💰
          </h2>
          <p className="text-lg text-amber-600 font-medium mb-4">
            {t('onboarding.pay_first_subtitle')}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {t('onboarding.pay_first_description')}
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-2xl text-center">
          <div className="text-4xl mb-3">💸</div>
          <div className="text-lg font-semibold text-gray-800">{t('onboarding.invest_earn_grow')}</div>
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const { t } = useLanguage();
  
  const values = [
    { icon: <Shield className="w-8 h-8" />, label: t('onboarding.value_security') },
    { icon: <Globe className="w-8 h-8" />, label: t('onboarding.value_sustainability') },
    { icon: <Heart className="w-8 h-8" />, label: t('onboarding.value_independence') }
  ];
  
  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {t('onboarding.values_title')} 🌱
          </h2>
          <p className="text-lg text-amber-600 font-medium mb-4">
            {t('onboarding.values_subtitle')}
          </p>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {t('onboarding.values_description')}
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {values.map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl">
              <div className="text-amber-500 mb-3">
                {item.icon}
              </div>
              <span className="text-sm font-medium text-center text-gray-800">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LearningSection() {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {t('onboarding.learning_title')} 📚
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {t('onboarding.learning_description')}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-2xl mb-2">📚</div>
            <div className="font-semibold text-gray-800">{t('onboarding.exclusive_content')}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-2xl mb-2">💡</div>
            <div className="font-semibold text-gray-800">{t('onboarding.proven_strategies')}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-2xl mb-2">🎓</div>
            <div className="font-semibold text-gray-800">{t('onboarding.expert_insights')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  const { t } = useLanguage();
  const { user } = useUser();
  
  return (
    <section className="py-16 px-6 bg-gradient-to-r from-amber-500 to-orange-500">
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
          <span>{user ? t('onboarding.continue') : t('onboarding.start_path')}</span>
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const skipOnboardingValue = localStorage.getItem(ONBOARDING_SKIP_KEY);
      if (skipOnboardingValue === 'true') {
        setSkipOnboarding(true);
      }
    }
  }, []);

  useEffect(() => {
    if (user && !isLoading && skipOnboarding) {
      // Check if user has created a core
      if (user.aicore_balance === 0) {
        router.push('/core-creation');
      } else {
        router.push('/challenges');
      }
    }
  }, [user, isLoading, skipOnboarding, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-900 text-xl mb-4 font-medium">
            {t('common.loading')}
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LanguageSelector />
      
      <HeroSection />
      <ProgramSection />
      <ChallengesSection />
      <AiCoreSection />
      <SuccessStoriesSection />
      <WishesSection />
      <BusinessSection />
      <PayYourselfSection />
      <ValuesSection />
      <LearningSection />
      <CtaSection />
      
      <footer className="py-8 px-6 bg-gray-900 text-center">
        <div className="text-gray-400 text-sm">
          © 2024 Abundance Effect
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
