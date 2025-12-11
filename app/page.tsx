'use client';

import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { languages } from '@/utils/translations';

function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ios-btn-secondary px-4 py-2 text-sm flex items-center gap-2 bg-white/90 backdrop-blur-sm shadow-lg rounded-full"
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
                  ? 'bg-ios-accent text-white'
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
    <section className={`py-16 px-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className={`flex flex-col ${imagePosition === "right" ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12`}>
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-ios-primary leading-tight">
              {title}
            </h2>
            <p className="text-lg text-ios-secondary leading-relaxed">
              {description}
            </p>
            {children}
          </div>
          <div className="flex-1">
            <div className="aspect-[4/3] bg-gradient-to-br from-ios-accent/10 to-purple-500/10 rounded-3xl flex items-center justify-center">
              <div className="text-6xl opacity-20">📱</div>
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
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 tracking-tight">
            {t('onboarding.hero_title')}
          </h1>
          <p className="text-xl lg:text-2xl text-ios-secondary leading-relaxed max-w-2xl mx-auto mb-6">
            {t('onboarding.hero_subtitle')}
          </p>
          <p className="text-lg text-ios-secondary/80 leading-relaxed max-w-3xl mx-auto">
            {t('onboarding.hero_description')}
          </p>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeContent() {
  const { user, isLoading, logout } = useUser();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isTelegramMiniApp, setIsTelegramMiniApp] = useState(false);
  const [skipOnboarding, setSkipOnboarding] = useState(false);

  const ONBOARDING_SKIP_KEY = 'abundance_skip_onboarding';

  // Handle referral parameters
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for 'ref' parameter in URL and save to localStorage
    const refParam = searchParams.get('ref');
    if (refParam) {
      const REFERRAL_STORAGE_KEY = 'abundance_referral_code';
      localStorage.setItem(REFERRAL_STORAGE_KEY, refParam);
      console.log('Saved referral code from URL:', refParam);
    }
  }, [searchParams]);

  useEffect(() => {
    // Check if we're in Telegram Mini App
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const webApp = (window as any).Telegram.WebApp;
      const tgUser = webApp.initDataUnsafe?.user;
      if (tgUser) {
        setIsTelegramMiniApp(prev => {
          if (!prev) return true;
          return prev;
        });
      }
    }
  }, []);

  // Check if user wants to skip onboarding
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

  // Grant onboarding knowledge item to logged-in users
  useEffect(() => {
    const grantOnboardingKnowledge = async () => {
      if (!user || !isLoading) return;

      try {
        // Check if user already has onboarding knowledge
        const response = await fetch('/api/results');
        if (response.ok) {
          const results = await response.json();
          const knowledge = results?.knowledge || [];
          
          // Check if onboarding knowledge item is already in user's knowledge
          const hasOnboardingKnowledge = knowledge.some((slot: any) =>
            slot?.itemId === 'onboarding_guide'
          );
          
          if (!hasOnboardingKnowledge) {
            // Add onboarding knowledge to user's results
            const newKnowledgeSlot = {
              slot: knowledge.length > 0 ? Math.max(...knowledge.map((s: any) => s.slot)) + 1 : 0,
              itemId: 'onboarding_guide',
              count: 1
            };
            
            const updatedKnowledge = [...knowledge, newKnowledgeSlot];
            
            await fetch('/api/results', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ knowledge: updatedKnowledge })
            });
            
            console.log('Onboarding knowledge item granted to user');
          }
        }
      } catch (error) {
        console.error('Error granting onboarding knowledge:', error);
      }
    };

    if (user && !isLoading) {
      grantOnboardingKnowledge();
    }
  }, [user, isLoading]);

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  const handleSkipOnboardingChange = (checked: boolean) => {
    setSkipOnboarding(checked);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_SKIP_KEY, checked.toString());
    }
  };

  // Show loading state while UserContext is initializing (including Telegram auth)
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-ios-background">
        <div className="text-center">
          <div className="text-ios-primary text-xl mb-4 font-medium">
            {isTelegramMiniApp ? 'Авторизация...' : 'Загрузка...'}
          </div>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ios-accent mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show the onboarding experience to ALL users (both logged-in and non-logged-in)
  return (
    <div className="min-h-screen bg-white">
      <LanguageSelector />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Emotional Hook - Before/After Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-ios-primary mb-4">
              Your Transformation Starts Here
            </h2>
            <p className="text-lg text-ios-secondary">
              From stress and struggle to freedom and abundance
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            {/* Large emotional image */}
            <div className="col-span-2 relative h-64 lg:h-96">
              <div className="w-full h-full bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-4">😰</div>
                  <div className="text-xl font-semibold text-gray-800">Struggling with Financial Stress?</div>
                  <div className="text-gray-600 mt-2">Trapped in routine and fear</div>
                </div>
              </div>
            </div>
            
            {/* Two smaller images showing the journey */}
            <div className="relative h-48">
              <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl mb-2">⏰</div>
                  <div className="text-sm font-semibold text-gray-800">Work Fatigue</div>
                </div>
              </div>
            </div>
            <div className="relative h-48">
              <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl mb-2">🏖️</div>
                  <div className="text-sm font-semibold text-gray-800">Freedom & Joy</div>
                </div>
              </div>
            </div>
            
            {/* Bottom image showing financial freedom */}
            <div className="col-span-2 relative h-48">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">💎</div>
                  <div className="text-lg font-semibold text-gray-800">Financial Freedom</div>
                  <div className="text-gray-600">Living your dream life</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 20-Level Program Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-ios-primary mb-4 flex items-center justify-center gap-3">
              {t('onboarding.program_title')} 💹
            </h2>
            <p className="text-lg text-ios-secondary leading-relaxed max-w-4xl mx-auto">
              {t('onboarding.program_description')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            {/* Large growth chart image */}
            <div className="col-span-2 relative h-64">
              <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-4">📈</div>
                  <div className="text-xl font-semibold text-gray-800">$1,000,000 Net Worth</div>
                  <div className="text-gray-600 mt-2">From 0 to Millionaire</div>
                </div>
              </div>
            </div>
            
            {/* Two smaller images */}
            <div className="relative h-48">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-sm font-semibold text-gray-800">Money Growth</div>
                </div>
              </div>
            </div>
            <div className="relative h-48">
              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-sm font-semibold text-gray-800">Growth Chart</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Level progression badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl">🎯</span>
              <span className="text-sm font-medium text-gray-700">Level 1-5</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl">🚀</span>
              <span className="text-sm font-medium text-gray-700">Level 6-10</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl">⭐</span>
              <span className="text-sm font-medium text-gray-700">Level 11-15</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl">👑</span>
              <span className="text-sm font-medium text-gray-700">Level 16-20</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Challenges Section */}
      <OnboardingSection
        title={t('onboarding.challenges_title')}
        description={t('onboarding.challenges_description')}
        imagePosition="left"
      >
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gradient-to-br from-orange-100 to-red-100 p-4 rounded-2xl">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-sm font-semibold text-gray-800">Daily Challenges</div>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-2xl">
            <div className="text-3xl mb-2">🎖️</div>
            <div className="text-sm font-semibold text-gray-800">Achievements</div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-4 rounded-2xl">
            <div className="text-3xl mb-2">💎</div>
            <div className="text-sm font-semibold text-gray-800">Rare Rewards</div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-2xl">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-sm font-semibold text-gray-800">Streaks</div>
          </div>
        </div>
      </OnboardingSection>
      
      {/* Wish Fulfillment Section */}
      <OnboardingSection
        title={t('onboarding.wishes_title')}
        description={t('onboarding.wishes_description')}
        className="bg-gradient-to-br from-pink-50 to-rose-50"
      >
        <div className="space-y-4 mt-6">
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">💫</span>
            </div>
            <div>
              <div className="font-semibold text-gray-800">Set Your Dreams</div>
              <div className="text-sm text-gray-600">Define what you truly want</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📈</span>
            </div>
            <div>
              <div className="font-semibold text-gray-800">Track Progress</div>
              <div className="text-sm text-gray-600">Monitor your journey daily</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🎉</span>
            </div>
            <div>
              <div className="font-semibold text-gray-800">Celebrate Success</div>
              <div className="text-sm text-gray-600">Mark achievements and milestones</div>
            </div>
          </div>
        </div>
      </OnboardingSection>
      
      {/* AI Core Section */}
      <OnboardingSection
        title={t('onboarding.ai_core_title')}
        description={t('onboarding.ai_core_description')}
        imagePosition="left"
      >
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-2xl text-white mt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🤖</span>
            </div>
            <div>
              <div className="text-xl font-bold">AI Core</div>
              <div className="text-indigo-200">Non-transferable • Lifelong Income</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-indigo-200">Always Working</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-2xl font-bold">∞</div>
              <div className="text-sm text-indigo-200">Lifelong Income</div>
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
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">📚</div>
            <div className="font-semibold text-gray-800">Exclusive Content</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">💡</div>
            <div className="font-semibold text-gray-800">Proven Strategies</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🎓</div>
            <div className="font-semibold text-gray-800">Expert Insights</div>
          </div>
        </div>
      </OnboardingSection>
      
      {/* Success Stories Section */}
      <OnboardingSection
        title={t('onboarding.success_title')}
        description={t('onboarding.success_description')}
        className="bg-gray-50"
      >
        <div className="grid grid-cols-2 gap-1 mt-8">
          <div className="col-span-2 relative h-64">
            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📖</div>
                <div className="text-lg font-semibold text-gray-800">Success Stories</div>
              </div>
            </div>
          </div>
          <div className="relative h-48">
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-sm font-semibold text-gray-800">Achievements</div>
              </div>
            </div>
          </div>
          <div className="relative h-48">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">🤖</div>
                <div className="text-sm font-semibold text-gray-800">AI Mentor</div>
              </div>
            </div>
          </div>
        </div>
      </OnboardingSection>

      {/* Pay Yourself First Section */}
      <OnboardingSection
        title={t('onboarding.pay_first_title')}
        description={t('onboarding.pay_first_description')}
        imagePosition="left"
      >
        <div className="grid grid-cols-2 gap-1 mt-8">
          <div className="col-span-2 relative h-64">
            <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-lg font-semibold text-gray-800">Financial Planning</div>
              </div>
            </div>
          </div>
          <div className="relative h-48">
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-sm font-semibold text-gray-800">Investment</div>
              </div>
            </div>
          </div>
          <div className="relative h-48">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-sm font-semibold text-gray-800">Goals</div>
              </div>
            </div>
          </div>
        </div>
      </OnboardingSection>

      {/* Values Section */}
      <OnboardingSection
        title={t('onboarding.values_title')}
        description={t('onboarding.values_description')}
        className="bg-gray-50"
      >
        <div className="grid grid-cols-2 gap-1 mt-8">
          <div className="col-span-2 relative h-64">
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🌱</div>
                <div className="text-lg font-semibold text-gray-800">Sustainable Values</div>
              </div>
            </div>
          </div>
          <div className="relative h-48">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">🔒</div>
                <div className="text-sm font-semibold text-gray-800">Security</div>
              </div>
            </div>
          </div>
          <div className="relative h-48">
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl-center">
               flex items-center justify<div className="text-center">
                <div className="text-3xl mb-2">🌍</div>
                <div className="text-sm font-semibold text-gray-800">Community</div>
              </div>
            </div>
          </div>
        </div>
      </OnboardingSection>

      {/* Business Development Section */}
      <OnboardingSection
        title={t('onboarding.business_title')}
        description={t('onboarding.business_description')}
        imagePosition="left"
      >
        <div className="grid grid-cols-2 gap-1 mt-8">
          <div className="col-span-2 relative h-64">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🚀</div>
                <div className="text-lg font-semibold text-gray-800">Business Growth</div>
              </div>
            </div>
          </div>
          <div className="relative h-48">
            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">💼</div>
                <div className="text-sm font-semibold text-gray-800">Entrepreneurship</div>
              </div>
            </div>
          </div>
          <div className="relative h-48">
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-sm font-semibold text-gray-800">Analytics</div>
              </div>
            </div>
          </div>
        </div>
      </OnboardingSection>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            {t('onboarding.cta_title')}
          </h2>
          <p className="text-xl lg:text-2xl mb-10 opacity-90 leading-relaxed">
            {t('onboarding.cta_description')}
          </p>
          <Link
            href={user ? "/challenges" : "/login"}
            className="inline-flex items-center gap-3 bg-white text-gray-900 font-bold px-8 py-4 rounded-2xl text-lg hover:bg-gray-100 transition-colors shadow-2xl"
          >
            <span>{user ? 'Continue' : t('onboarding.get_started')}</span>
            <span className="text-xl">{user ? '🎯' : '🚀'}</span>
          </Link>
          
          {/* Skip onboarding checkbox - only show for logged-in users */}
          {user && (
            <div className="mt-6">
              <label className="inline-flex items-center gap-3 text-white/90 hover:text-white transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipOnboarding}
                  onChange={(e) => handleSkipOnboardingChange(e.target.checked)}
                  className="w-4 h-4 rounded border-white/30 bg-white/20 text-ios-accent focus:ring-white/50 focus:ring-2"
                />
                <span className="text-sm">Don't show this page again</span>
              </label>
            </div>
          )}
        </div>
      </section>
      
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
