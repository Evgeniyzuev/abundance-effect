'use client';

import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="px-4 py-3 flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <img src="/icon-512.png" alt="Logo" className="w-8 h-8 rounded-full" />
          <span className="font-semibold text-lg">Abundance</span>
        </div>
        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
        </button>
      </div>
    </header>
  );
}

function HeroSection() {
  const { user } = useUser();
  
  return (
    <section className="pt-8 pb-12 px-4 text-center">
      <div className="mb-6">
        <div className="flex items-center justify-center mb-4">
          <img src="/icon-512.png" alt="Эффект Изобилия" className="w-16 h-16 rounded-2xl mr-3" />
          <h1 className="text-3xl font-bold leading-tight">
            Эффект Изобилия
          </h1>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">
          Жизнь в изобилии — это не мечта, а естественное состояние человека, когда он в гармонии с собой, другими и миром.
        </p>
      </div>
      
      <div className="mt-8 flex flex-col gap-3">
        <Link
          href={user ? "/challenges" : "/login"}
          className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg"
        >
          <span>{user ? 'Продолжить' : 'Начать путь'}</span>
          <span className="text-xl">🚀</span>
        </Link>
        
        <button className="inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-white/90 transition-all">
          <span>Узнать больше</span>
          <span className="text-sm">↓</span>
        </button>
      </div>
    </section>
  );
}

function Section({ 
  title, 
  subtitle, 
  children, 
  image1, 
  image2, 
  layout = "default" 
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  image1?: string;
  image2?: string;
  layout?: "default" | "double" | "full";
}) {
  return (
    <section className="px-4 py-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold mb-1">{title}</h2>
        {subtitle && (
          <p className="text-amber-600 font-medium text-sm">{subtitle}</p>
        )}
      </div>
      
      {layout === "double" && image1 && image2 && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-2xl overflow-hidden">
            <img 
              src={image1} 
              alt={`${title} 1`}
              className="w-full h-auto"
            />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img 
              src={image2} 
              alt={`${title} 2`}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
      
      {layout === "full" && (
        <div className="mb-5 rounded-2xl overflow-hidden">
          <img 
            src={image1} 
            alt={title}
            className="w-full h-auto"
          />
        </div>
      )}
      
      {children && (
        <p className="text-gray-700 leading-relaxed">
          {children}
        </p>
      )}
      
      <div className="mt-8">
        <div className="h-px bg-gray-100"></div>
      </div>
    </section>
  );
}

function CtaSection() {
  const { user } = useUser();
  const { t } = useLanguage();
  
  return (
    <section className="px-4 py-8 text-center bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🎯</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">Готов начать?</h3>
        <p className="text-gray-600">
          Первый шаг к изобилию — осознание, что оно уже здесь
        </p>
      </div>
      
      <Link
        href={user ? "/challenges" : "/login"}
        className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg"
      >
        <span>{user ? 'Продолжить путь' : 'Начать путь'}</span>
        <span className="text-xl">✨</span>
      </Link>
      
      <p className="mt-6 text-xs text-gray-500">
        Abundance Effect • Светлое будущее начинается сегодня
      </p>
    </section>
  );
}

function HomeContent() {
  const { user, isLoading } = useUser();
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 font-sans">
      <Header />
      
      <main className="max-w-md mx-auto">
        <HeroSection />
        
        <Section
          title="Программа роста"
          subtitle="С нуля до $1 000 000 net worth"
          layout="double"
          image1="https://placehold.co/280x280/f8f6f4/333333?text=Level+1"
          image2="https://placehold.co/280x280/e8f4f0/333333?text=Level+20"
        >
          Прозрачная система уровней: от первого шага до первого миллиона. На 20 уровне — $1 000 000 чистого капитала.
        </Section>

        <Section
          title="Челленджи и награды"
          subtitle="Доход, который всегда под рукой"
          layout="double"
          image1="https://placehold.co/280x350/faf7f2/333333?text=Challenge"
          image2="https://placehold.co/280x350/eef8f5/333333?text=Reward"
        >
          Выполняй задания — получай вознаграждения. Сам решаешь, когда и сколько зарабатывать. Чем выше уровень — тем больше доход.
        </Section>

        <Section
          title="AI Core"
          subtitle="Неотчуждаемый капитал"
          layout="full"
          image1="https://placehold.co/600x400/f0f9f6/333333?text=AI+Core+%E2%86%92+26%25+annual"
        >
          Гарантированный пассивный доход. Рост на 26% годовых — минимум. ×2 за 3 года, ×10 за 10 лет. Работает даже без твоих усилий.
        </Section>

        <Section
          title="Истории успеха"
          subtitle="Учись у тех, кто уже там"
          layout="double"
          image1="https://placehold.co/280x350/fff8f0/333333?text=Success+Story"
          image2="https://placehold.co/280x350/f5f0ff/333333?text=AI+Mentor"
        >
          Реальные кейсы людей, достигших твоих целей. Технологии повышения дохода, ИИ-наставник и ассистент — всё для твоего роста.
        </Section>

        <Section
          title="Исполнение желаний"
          subtitle="Жизнь мечты — уже доступна"
          layout="full"
          image1="https://placehold.co/600x400/fff0f5/333333?text=Wish+Granted+%E2%9C%A8"
        >
          Современные технологии позволяют не просто закрывать базовые потребности, но и реализовывать самые смелые мечты. Узнай, как это делают другие.
        </Section>

        <Section
          title="Развивай своё дело"
          subtitle="Инструменты нового поколения"
          layout="double"
          image1="https://placehold.co/280x300/f2f8ff/333333?text=Business"
          image2="https://placehold.co/280x300/fcf4f0/333333?text=Tech+Tools"
        >
          Всё для предпринимателей: инсайты о клиентах, автоматизация, AI-аналитика. Создавай то, чего люди действительно хотят.
        </Section>

        <Section
          title="Плати сначала себе"
          subtitle="Каждая покупка — инвестиция"
          layout="full"
          image1="https://placehold.co/600x350/f0f7ff/333333?text=Invest+→+Earn+→+Grow"
        >
          Становись бенефициаром бизнесов. Не трать — вкладывай. Деньги возвращаются и множатся, принося доход снова и снова.
        </Section>

        <Section
          title="Ценности"
          subtitle="Независимость. Безопасность. Устойчивость."
        >
          Мы строим общество устойчивых людей, которые не вредят миру и друг другу ради денег и власти. Изобилие — это ответственность.
        </Section>
        
        {/* Skip onboarding checkbox - only show for logged-in users */}
        {user && (
          <section className="px-4 py-4">
            <label className="inline-flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={skipOnboarding}
                onChange={(e) => handleSkipOnboardingChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm">Не показывать эту страницу снова</span>
            </label>
          </section>
        )}
        
        <CtaSection />
      </main>
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
