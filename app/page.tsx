'use client';

import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // User is not logged in - show welcome screen with login button
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-black px-4">
        <h1 className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-6xl font-bold text-transparent mb-8">
          Abundance Effect
        </h1>
        <p className="text-gray-400 text-center mb-8 max-w-md">
          Программа 20 уровней. Пассивный доход. Твой путь к изобилию начинается здесь.
        </p>
        <Link
          href="/login"
          className="rounded-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-8 py-3 text-lg font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Войти
        </Link>
      </div>
    );
  }

  // User is logged in - show their data
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black px-4">
      <div className="max-w-2xl w-full bg-gray-900 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-6">
          Добро пожаловать, {user.first_name || user.username || 'User'}!
        </h1>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded">
              <div className="text-gray-400 text-sm">Wallet Balance</div>
              <div className="text-2xl font-bold">${user.wallet_balance}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <div className="text-gray-400 text-sm">AI Core Balance</div>
              <div className="text-2xl font-bold">{user.aicore_balance}</div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <div className="text-gray-400 text-sm">Level</div>
            <div className="text-2xl font-bold">Level {user.level}</div>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <div className="text-gray-400 text-sm mb-2">Profile Info</div>
            <div className="text-sm space-y-1">
              {user.username && <div>Username: @{user.username}</div>}
              {user.telegram_id && <div>Telegram ID: {user.telegram_id}</div>}
              <div>Reinvest: {user.reinvest_setup}%</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}
