'use client';

import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const supabase = createClient();
  const [isTelegramMiniApp, setIsTelegramMiniApp] = useState(false);

  useEffect(() => {
    // Check if we're in Telegram Mini App
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const webApp = (window as any).Telegram.WebApp;
      const tgUser = webApp.initDataUnsafe?.user;
      if (tgUser) {
        setIsTelegramMiniApp(true);
      }
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

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
          Программа 20 уровней. Пассивный доход. Твой путь к изобилию начинается здесь.
        </p>
        <Link
          href="/login"
          className="ios-btn text-lg px-8 py-4 shadow-lg shadow-blue-500/30"
        >
          Войти
        </Link>
      </div>
    );
  }

  // User is logged in - show their data
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-ios-background px-4 py-8">
      <div className="w-full max-w-md space-y-6">

        {/* Header / Welcome */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ios-primary">
            Привет, {user.first_name || user.username || 'User'}!
          </h1>
          <p className="text-ios-secondary mt-1">Твой прогресс сегодня</p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="ios-card p-5 flex flex-col items-center justify-center text-center">
            <div className="text-ios-secondary text-sm font-medium mb-1">Баланс</div>
            <div className="text-2xl font-bold text-ios-primary">${user.wallet_balance}</div>
          </div>
          <div className="ios-card p-5 flex flex-col items-center justify-center text-center">
            <div className="text-ios-secondary text-sm font-medium mb-1">AI Core</div>
            <div className="text-2xl font-bold text-ios-primary">{user.aicore_balance}</div>
          </div>
        </div>

        {/* Level Card */}
        <div className="ios-card p-6 flex items-center justify-between">
          <div>
            <div className="text-ios-secondary text-sm font-medium">Текущий уровень</div>
            <div className="text-2xl font-bold text-ios-primary">Level {user.level}</div>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
            {user.level}
          </div>
        </div>

        {/* Profile Info */}
        <div className="ios-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-ios-primary">Профиль</h3>
          </div>
          <div className="p-0">
            {user.username && (
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-50 last:border-0">
                <span className="text-ios-secondary">Username</span>
                <span className="text-ios-primary font-medium">@{user.username}</span>
              </div>
            )}
            {user.telegram_id && (
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-50 last:border-0">
                <span className="text-ios-secondary">Telegram ID</span>
                <span className="text-ios-primary font-medium">{user.telegram_id}</span>
              </div>
            )}
            <div className="flex justify-between items-center px-6 py-4">
              <span className="text-ios-secondary">Реинвест</span>
              <span className="text-green-600 font-medium">{user.reinvest_setup}%</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-8 rounded-xl bg-red-50 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-100 transition-colors"
        >
          Выйти
        </button>
      </div>
    </div>
  );
}
