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





    | 'profile.title'
    | 'profile.language'
    | 'common.loading'
    | 'common.error'
    | 'auth.login'
    | 'auth.logout'
    | 'auth.welcome_subtitle'
    | 'auth.google'
    | 'auth.telegram'
    | 'auth.telegram_mini_app'
    | 'auth.apple';

export const translations: { [key in Language]: { [key in TranslationKey]: string } } = {
    en: {





        'profile.title': 'Profile',
        'profile.language': 'Language',
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'auth.login': 'Login',
        'auth.logout': 'Logout',
        'auth.welcome_subtitle': 'Log in to start your journey',
        'auth.google': 'Continue with Google',
        'auth.telegram': 'Continue with Telegram',
        'auth.telegram_mini_app': 'Open Telegram Mini App',
        'auth.apple': 'Continue with Apple',
    },
    zh: {





        'profile.title': '个人资料',
        'profile.language': '语言',
        'common.loading': '加载中...',
        'common.error': '错误',
        'auth.login': '登录',
        'auth.logout': '登出',
        'auth.welcome_subtitle': '登录以开始您的旅程',
        'auth.google': '通过 Google 继续',
        'auth.telegram': '通过 Telegram 继续',
        'auth.telegram_mini_app': '打开 Telegram 小程序',
        'auth.apple': '通过 Apple 继续',
    },
    es: {





        'profile.title': 'Perfil',
        'profile.language': 'Idioma',
        'common.loading': 'Cargando...',
        'common.error': 'Error',
        'auth.login': 'Iniciar sesión',
        'auth.logout': 'Cerrar sesión',
        'auth.welcome_subtitle': 'Inicia sesión para comenzar tu viaje',
        'auth.google': 'Continuar con Google',
        'auth.telegram': 'Continuar con Telegram',
        'auth.telegram_mini_app': 'Abrir Mini App de Telegram',
        'auth.apple': 'Continuar con Apple',
    },
    hi: {





        'profile.title': 'प्रोफ़ाइल',
        'profile.language': 'भाषा',
        'common.loading': 'लोड हो रहा है...',
        'common.error': 'त्रुटि',
        'auth.login': 'लॉग इन करें',
        'auth.logout': 'लॉग आउट',
        'auth.welcome_subtitle': 'अपनी यात्रा शुरू करने के लिए लॉग इन करें',
        'auth.google': 'Google के साथ जारी रखें',
        'auth.telegram': 'Telegram के साथ जारी रखें',
        'auth.telegram_mini_app': 'Telegram मिनी ऐप खोलें',
        'auth.apple': 'Apple के साथ जारी रखें',
    },
    ar: {





        'profile.title': 'الملف الشخصي',
        'profile.language': 'لغة',
        'common.loading': 'جار التحميل...',
        'common.error': 'خطأ',
        'auth.login': 'تسجيل الدخول',
        'auth.logout': 'تسجيل الخروج',
        'auth.welcome_subtitle': 'سجل الدخول لبدء رحلتك',
        'auth.google': 'تواصل مع Google',
        'auth.telegram': 'تواصل مع Telegram',
        'auth.telegram_mini_app': 'افتح تطبيق Telegram المصغر',
        'auth.apple': 'تواصل مع Apple',
    },
    ru: {





        'profile.title': 'Профиль',
        'profile.language': 'Язык',
        'common.loading': 'Загрузка...',
        'common.error': 'Ошибка',
        'auth.login': 'Войти',
        'auth.logout': 'Выйти',
        'auth.welcome_subtitle': 'Войдите, чтобы начать свой путь',
        'auth.google': 'Войти через Google',
        'auth.telegram': 'Войти через Telegram',
        'auth.telegram_mini_app': 'Открыть Telegram Mini App',
        'auth.apple': 'Войти через Apple',
    },
};
