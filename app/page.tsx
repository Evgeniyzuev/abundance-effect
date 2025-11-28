'use client';

import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user, isLoading, isTelegramAuthenticating, logout } = useUser();
  const router = useRouter();
  const [isTelegramMiniApp, setIsTelegramMiniApp] = useState(false);

  useEffect(() => {
    // Check if we're in Telegram Mini App
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const webApp = (window as any).Telegram.WebApp;
      const tgUser = webApp.initDataUnsafe?.user;
      console.log('📱 Main page: Telegram check:', {
        hasWebApp: !!webApp,
        hasUser: !!tgUser,
        user: tgUser
      });
      if (tgUser) {
        setIsTelegramMiniApp(true);
        console.log('✅ Telegram Mini App detected');
      } else {
        console.log('❌ No Telegram user found');
      }
    } else {
      console.log('🌐 Main page: Regular web environment');
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

  if (isLoading || isTelegramAuthenticating) {
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
    // User is not logged in - show welcome screen ONLY if not in Telegram Mini App
    if (isTelegramMiniApp) {
      // In Telegram Mini App, we should never show login button - auth should happen automatically
      // If we get here, it means auth failed - show error or try again
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-ios-background px-6">
          <div className="text-center">
            <div className="text-ios-primary text-xl mb-4 font-medium">
              Ошибка авторизации
            </div>
            <div className="text-ios-secondary text-lg mb-6">
              Попробуйте перезапустить приложение
            </div>
            <button
              onClick={() => window.location.reload()}
              className="ios-btn text-lg px-8 py-4 shadow-lg shadow-blue-500/30"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      );
    }

    // Regular web environment - show welcome screen
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-ios-background px-6">
        <h1 className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-5xl font-bold text-transparent mb-6 text-center tracking-tight">
          Abundance Effect
        </h1>
        <p className="text-ios-secondary text-center mb-10 max-w-md text-lg leading-relaxed">
          Journey to Abundance!!
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
