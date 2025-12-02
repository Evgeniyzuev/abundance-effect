'use client';

import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function HomeContent() {
  const { user, isLoading, logout } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isTelegramMiniApp, setIsTelegramMiniApp] = useState(false);

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

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  // User is logged in - redirect to main app
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/goals');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    // Show loading state while UserContext is initializing (including Telegram auth)
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

  if (!user) {
    // User is not logged in and NOT in Telegram Mini App - show welcome screen
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-ios-background px-6">
        <h1 className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-5xl font-bold text-transparent mb-6 text-center tracking-tight">
          Abundance Effect
        </h1>
        <p className="text-ios-secondary text-center mb-10 max-w-md text-lg leading-relaxed">
          Journey to Abundance!
          <br />
          From 0 to $1M in 20 levels🚀
        </p>
        <Link
          href="/login"
          className="ios-btn text-lg px-8 py-4 shadow-lg shadow-blue-500/30"
        >
          Start
        </Link>
      </div>
    );
  }

  return null; // Or a loading spinner while redirecting
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
