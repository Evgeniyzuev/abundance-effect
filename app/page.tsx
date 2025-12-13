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
          Эффект Изобилия
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
          Жизнь в изобилии — это не мечта, а естественное состояние человека, когда он в гармонии с собой, другими и миром.
        </p>
        
        {/* Start Button */}
        <Link
          href={user ? "/challenges" : "/login"}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
        >
          <span>Начать</span>
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
            Программа роста 💹
          </h2>
          <p className="text-lg text-amber-600 font-medium mb-4">
            С нуля до $1 000 000 net worth
          </p>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Прозрачная система уровней: от первого шага до первого миллиона. На 20 уровне — $1 000 000 чистого капитала.
          </p>
        </div>
        
        {/* Double Layout - Level 1 and Level 20 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl text-center">
            <div className="text-4xl mb-3">🌱</div>
            <div className="text-lg font-semibold text-gray-800">Level 1</div>
            <div className="text-sm text-gray-600 mt-1">Первый шаг</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl text-center">
            <div className="text-4xl mb-3">👑</div>
            <div className="text-lg font-semibold text-gray-800">Level 20</div>
            <div className="text-sm text-gray-600 mt-1">$1 000 000</div>
          </div>
        </div>
        
        {/* Emotion cards from previous section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-xl text-center">
            <div className="text-3xl mb-2">😰</div>
            <div className="text-sm font-semibold text-gray-800">Финансовый стресс</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center">
            <div className="text-3xl mb-2">🏖️</div>
            <div className="text-sm font-semibold text-gray-800">Свобода и радость</div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {['Level 1-5', 'Level 6-10', 'Level 11-15', 'Level 16-20'].map((level) => (
            <div key={level} className="bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
              <span className="text-sm font-medium text-gray-700">{level}</span>
            </div>
          ))}
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
            Челленджи и награды 🏆
          </h2>
          <p className="text-lg text-amber-600 font-medium mb-4">
            Доход, который всегда под рукой
          </p>
          <p className="text-gray-600 leading-relaxed">
            Выполняй задания — получай вознаграждения. Сам решаешь, когда и сколько зарабатывать. Чем выше уровень — тем больше доход.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 p-4 rounded-xl">
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-sm font-semibold text-gray-800">Ежедневные челленджи</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="text-2xl mb-2">🎖️</div>
            <div className="text-sm font-semibold text-gray-800">Достижения</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="text-2xl mb-2">💎</div>
            <div className="text-sm font-semibold text-gray-800">Редкие награды</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="text-2xl mb-2">🔥</div>
            <div className="text-sm font-semibold text-gray-800">Страйки</div>
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
            AI Core 🤖
          </h2>
          <p className="text-lg text-amber-600 font-medium mb-4">
            Неотчуждаемый капитал
          </p>
          <p className="text-gray-600 leading-relaxed">
            Гарантированный пассивный доход. Рост на 26% годовых — минимум. ×2 за 3 года, ×10 за 10 лет. Работает даже без твоих усилий.
          </p>
        </div>
        
        <div className="bg-indigo-900 p-6 rounded-2xl text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <div className="text-lg font-bold">AI Core</div>
              <div className="text-indigo-200">Пожизненный доход</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-xl font-bold">24/7</div>
              <div className="text-sm text-indigo-200">Всегда работает</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-xl font-bold">26%</div>
              <div className="text-sm text-indigo-200">Годовой рост</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SuccessStoriesSection() {
  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Истории успеха 🌟
          </h2>
          <p className="text-lg text-amber-600 font-medium mb-4">
            Учись у тех, кто уже там
          </p>
          <p className="text-gray-600 leading-relaxed">
            Реальные кейсы людей, достигших твоих целей. Технологии повышения дохода, ИИ-наставник и ассистент — всё для твоего роста.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 p-6 rounded-2xl text-center">
            <div className="text-4xl mb-2">📖</div>
            <div className="font-semibold text-gray-800">Истории успеха</div>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl text-center">
            <div className="text-4xl mb-2">🧠</div>
            <div className="font-semibold text-gray-800">AI Наставник</div>
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
            Исполнение желаний ✨
          </h2>
          <p className="text-lg text-amber-600 font-medium mb-4">
            Жизнь мечты — уже доступна
          </p>
          <p className="text-gray-600 leading-relaxed">
            Современные технологии позволяют не просто закрывать базовые потребности, но и реализовывать самые смелые мечты. Узнай, как это делают другие.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
            <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">💫</span>
            </div>
            <div>
              <div className="font-semibold text-gray-800">Определи свои мечты</div>
              <div className="text-sm text-gray-600">Чего ты действительно хочешь</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📈</span>
            </div>
            <div>
              <div className="font-semibold text-gray-800">Отслеживай прогресс</div>
              <div className="text-sm text-gray-600">Следи за путём каждый день</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BusinessSection() {
  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Развивай своё дело 💼
          </h2>
          <p className="text-lg text-amber-600 font-medium mb-4">
            Инструменты нового поколения
          </p>
          <p className="text-gray-600 leading-relaxed">
            Всё для предпринимателей: инсайты о клиентах, автоматизация, AI-аналитика. Создавай то, чего люди действительно хотят.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-6 rounded-2xl text-center">
            <div className="text-4xl mb-2">💼</div>
            <div className="font-semibold text-gray-800">Бизнес</div>
            <div className="text-sm text-gray-600 mt-1">Инсайты и аналитика</div>
          </div>
          <div className="bg-orange-50 p-6 rounded-2xl text-center">
            <div className="text-4xl mb-2">⚙️</div>
            <div className="font-semibold text-gray-800">Tech Tools</div>
            <div className="text-sm text-gray-600 mt-1">Автоматизация</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PayYourselfSection() {
  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Плати сначала себе 💰
          </h2>
          <p className="text-lg text-amber-600 font-medium mb-4">
            Каждая покупка — инвестиция
          </p>
          <p className="text-gray-600 leading-relaxed">
            Становись бенефициаром бизнесов. Не трать — вкладывай. Деньги возвращаются и множатся, принося доход снова и снова.
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-2xl text-center">
          <div className="text-4xl mb-3">💸</div>
          <div className="text-lg font-semibold text-gray-800">Invest → Earn → Grow</div>
          <div className="text-sm text-gray-600 mt-2">Вкладывай → Зарабатывай → Расти</div>
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const values = [
    { icon: <Shield className="w-8 h-8" />, label: "Безопасность" },
    { icon: <Globe className="w-8 h-8" />, label: "Устойчивость" },
    { icon: <Heart className="w-8 h-8" />, label: "Независимость" }
  ];
  
  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Ценности 🌱
          </h2>
          <p className="text-lg text-amber-600 font-medium mb-4">
            Независимость. Безопасность. Устойчивость.
          </p>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Мы строим общество устойчивых людей, которые не вредят миру и друг другу ради денег и власти. Изобилие — это ответственность.
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
            <div className="font-semibold text-gray-800">Эксклюзивный контент</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-2xl mb-2">💡</div>
            <div className="font-semibold text-gray-800">Проверенные стратегии</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-2xl mb-2">🎓</div>
            <div className="font-semibold text-gray-800">Экспертные инсайты</div>
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
          Готов начать?
        </h2>
        <p className="text-xl mb-8 opacity-90 leading-relaxed">
          Первый шаг к изобилию — осознание, что оно уже здесь
        </p>
        <Link
          href={user ? "/challenges" : "/login"}
          className="inline-flex items-center gap-3 bg-white text-gray-900 font-bold px-8 py-4 rounded-2xl text-lg hover:bg-gray-100 transition-colors shadow-lg"
        >
          <span>{user ? 'Продолжить' : 'Начать путь'}</span>
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
      
      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-center">
        <div className="text-gray-400 text-sm">
          © 2024 Abundance Effect. Светлое будущее начинается сегодня.
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
