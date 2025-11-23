export type Language = 'en' | 'zh' | 'es' | 'hi' | 'ar' | 'ru';

export const languages: { [key in Language]: string } = {
    en: 'English',
    zh: '中文 (Mandarin)',
    es: 'Español',
    hi: 'हिन्दी (Hindi)',
    ar: 'العربية (Arabic)',
    ru: 'Русский',
};

export type TranslationKey =
    // Goals page
    | 'goals.title'
    | 'goals.goal'
    | 'goals.add_wish'
    // Challenges page
    | 'challenges.title'
    | 'challenges.no_active'
    // AI page
    | 'ai.title'
    | 'ai.coming_soon'
    // Wallet page
    | 'wallet.title'
    | 'wallet.total_balance'
    | 'wallet.aicore_balance'
    // Profile/Social page
    | 'profile.title'
    | 'profile.language'
    | 'profile.level'
    | 'profile.username'
    | 'profile.telegram_id'
    | 'profile.reinvest'
    // Common
    | 'common.loading'
    | 'common.error'
    // Auth
    | 'auth.login'
    | 'auth.logout'
    | 'auth.welcome_subtitle'
    | 'auth.google'
    | 'auth.telegram'
    | 'auth.telegram_mini_app'
    | 'auth.apple';

export const translations: { [key in Language]: { [key in TranslationKey]: string } } = {
    en: {
        // Goals
        'goals.title': 'My Goals',
        'goals.goal': 'Goal',
        'goals.add_wish': 'Add Wish',
        // Challenges
        'challenges.title': 'Challenges',
        'challenges.no_active': 'No active challenges yet.',
        // AI
        'ai.title': 'AI Assistant',
        'ai.coming_soon': 'AI Squad coming soon.',
        // Wallet
        'wallet.title': 'Wallet',
        'wallet.total_balance': 'Total Balance',
        'wallet.aicore_balance': 'AI Core Balance',
        // Profile
        'profile.title': 'Profile',
        'profile.language': 'Language',
        'profile.level': 'Level',
        'profile.username': 'Username',
        'profile.telegram_id': 'Telegram ID',
        'profile.reinvest': 'Reinvest',
        // Common
        'common.loading': 'Loading...',
        'common.error': 'Error',
        // Auth
        'auth.login': 'Login',
        'auth.logout': 'Logout',
        'auth.welcome_subtitle': 'Log in to start your journey',
        'auth.google': 'Continue with Google',
        'auth.telegram': 'Continue with Telegram',
        'auth.telegram_mini_app': 'Open Telegram Mini App',
        'auth.apple': 'Continue with Apple',
    },
    zh: {
        // Goals
        'goals.title': '我的目标',
        'goals.goal': '目标',
        'goals.add_wish': '添加愿望',
        // Challenges
        'challenges.title': '挑战',
        'challenges.no_active': '暂无活跃挑战。',
        // AI
        'ai.title': 'AI 助手',
        'ai.coming_soon': 'AI 小队即将推出。',
        // Wallet
        'wallet.title': '钱包',
        'wallet.total_balance': '总余额',
        'wallet.aicore_balance': 'AI Core 余额',
        // Profile
        'profile.title': '个人资料',
        'profile.language': '语言',
        'profile.level': '等级',
        'profile.username': '用户名',
        'profile.telegram_id': 'Telegram ID',
        'profile.reinvest': '再投资',
        // Common
        'common.loading': '加载中...',
        'common.error': '错误',
        // Auth
        'auth.login': '登录',
        'auth.logout': '登出',
        'auth.welcome_subtitle': '登录以开始您的旅程',
        'auth.google': '通过 Google 继续',
        'auth.telegram': '通过 Telegram 继续',
        'auth.telegram_mini_app': '打开 Telegram 小程序',
        'auth.apple': '通过 Apple 继续',
    },
    es: {
        // Goals
        'goals.title': 'Mis Objetivos',
        'goals.goal': 'Objetivo',
        'goals.add_wish': 'Agregar Deseo',
        // Challenges
        'challenges.title': 'Desafíos',
        'challenges.no_active': 'Aún no hay desafíos activos.',
        // AI
        'ai.title': 'Asistente de IA',
        'ai.coming_soon': 'Escuadrón de IA próximamente.',
        // Wallet
        'wallet.title': 'Billetera',
        'wallet.total_balance': 'Saldo Total',
        'wallet.aicore_balance': 'Saldo AI Core',
        // Profile
        'profile.title': 'Perfil',
        'profile.language': 'Idioma',
        'profile.level': 'Nivel',
        'profile.username': 'Nombre de usuario',
        'profile.telegram_id': 'ID de Telegram',
        'profile.reinvest': 'Reinversión',
        // Common
        'common.loading': 'Cargando...',
        'common.error': 'Error',
        // Auth
        'auth.login': 'Iniciar sesión',
        'auth.logout': 'Cerrar sesión',
        'auth.welcome_subtitle': 'Inicia sesión para comenzar tu viaje',
        'auth.google': 'Continuar con Google',
        'auth.telegram': 'Continuar con Telegram',
        'auth.telegram_mini_app': 'Abrir Mini App de Telegram',
        'auth.apple': 'Continuar con Apple',
    },
    hi: {
        // Goals
        'goals.title': 'मेरे लक्ष्य',
        'goals.goal': 'लक्ष्य',
        'goals.add_wish': 'इच्छा जोड़ें',
        // Challenges
        'challenges.title': 'चुनौतियाँ',
        'challenges.no_active': 'अभी तक कोई सक्रिय चुनौती नहीं।',
        // AI
        'ai.title': 'AI सहायक',
        'ai.coming_soon': 'AI स्क्वाड जल्द ही आ रहा है।',
        // Wallet
        'wallet.title': 'वॉलेट',
        'wallet.total_balance': 'कुल बैलेंस',
        'wallet.aicore_balance': 'AI Core बैलेंस',
        // Profile
        'profile.title': 'प्रोफ़ाइल',
        'profile.language': 'भाषा',
        'profile.level': 'स्तर',
        'profile.username': 'यूज़रनेम',
        'profile.telegram_id': 'Telegram ID',
        'profile.reinvest': 'पुनर्निवेश',
        // Common
        'common.loading': 'लोड हो रहा है...',
        'common.error': 'त्रुटि',
        // Auth
        'auth.login': 'लॉग इन करें',
        'auth.logout': 'लॉग आउट',
        'auth.welcome_subtitle': 'अपनी यात्रा शुरू करने के लिए लॉग इन करें',
        'auth.google': 'Google के साथ जारी रखें',
        'auth.telegram': 'Telegram के साथ जारी रखें',
        'auth.telegram_mini_app': 'Telegram मिनी ऐप खोलें',
        'auth.apple': 'Apple के साथ जारी रखें',
    },
    ar: {
        // Goals
        'goals.title': 'أهدافي',
        'goals.goal': 'هدف',
        'goals.add_wish': 'أضف أمنية',
        // Challenges
        'challenges.title': 'التحديات',
        'challenges.no_active': 'لا توجد تحديات نشطة حتى الآن.',
        // AI
        'ai.title': 'مساعد الذكاء الاصطناعي',
        'ai.coming_soon': 'فريق الذكاء الاصطناعي قريباً.',
        // Wallet
        'wallet.title': 'المحفظة',
        'wallet.total_balance': 'الرصيد الإجمالي',
        'wallet.aicore_balance': 'رصيد AI Core',
        // Profile
        'profile.title': 'الملف الشخصي',
        'profile.language': 'لغة',
        'profile.level': 'المستوى',
        'profile.username': 'اسم المستخدم',
        'profile.telegram_id': 'معرف Telegram',
        'profile.reinvest': 'إعادة الاستثمار',
        // Common
        'common.loading': 'جار التحميل...',
        'common.error': 'خطأ',
        // Auth
        'auth.login': 'تسجيل الدخول',
        'auth.logout': 'تسجيل الخروج',
        'auth.welcome_subtitle': 'سجل الدخول لبدء رحلتك',
        'auth.google': 'تواصل مع Google',
        'auth.telegram': 'تواصل مع Telegram',
        'auth.telegram_mini_app': 'افتح تطبيق Telegram المصغر',
        'auth.apple': 'تواصل مع Apple',
    },
    ru: {
        // Goals
        'goals.title': 'Мои Цели',
        'goals.goal': 'Цель',
        'goals.add_wish': 'Добавить Желание',
        // Challenges
        'challenges.title': 'Челленджи',
        'challenges.no_active': 'Пока нет активных челленджей.',
        // AI
        'ai.title': 'AI Ассистент',
        'ai.coming_soon': 'AI Команда скоро.',
        // Wallet
        'wallet.title': 'Кошелёк',
        'wallet.total_balance': 'Общий Баланс',
        'wallet.aicore_balance': 'Баланс AI Core',
        // Profile
        'profile.title': 'Профиль',
        'profile.language': 'Язык',
        'profile.level': 'Уровень',
        'profile.username': 'Имя пользователя',
        'profile.telegram_id': 'Telegram ID',
        'profile.reinvest': 'Реинвестиция',
        // Common
        'common.loading': 'Загрузка...',
        'common.error': 'Ошибка',
        // Auth
        'auth.login': 'Войти',
        'auth.logout': 'Выйти',
        'auth.welcome_subtitle': 'Войдите, чтобы начать свой путь',
        'auth.google': 'Войти через Google',
        'auth.telegram': 'Войти через Telegram',
        'auth.telegram_mini_app': 'Открыть Telegram Mini App',
        'auth.apple': 'Войти через Apple',
    },
};
