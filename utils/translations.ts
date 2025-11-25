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
    // Notes page
    | 'notes.title'
    | 'notes.add_note'
    | 'notes.today'
    | 'notes.planned'
    | 'notes.all'
    | 'notes.completed'
    | 'notes.create_list'
    | 'notes.edit_list'
    | 'notes.delete_list'
    | 'notes.list_name'
    | 'notes.no_notes'
    | 'notes.search_placeholder'
    | 'notes.details'
    | 'notes.date'
    | 'notes.time'
    | 'notes.tags'
    | 'notes.priority'
    | 'notes.priority_none'
    | 'notes.priority_low'
    | 'notes.priority_medium'
    | 'notes.priority_high'
    | 'notes.list'
    | 'notes.icon'
    | 'notes.color'
    | 'notes.new_list'
    | 'notes.done'
    | 'notes.back'
    | 'notes.cancel'
    | 'notes.confirm_delete_note'
    | 'notes.confirm_delete_list'
    | 'notes.my_lists'
    | 'notes.list_name_placeholder'
    // Tasks page
    | 'tasks.title'
    | 'tasks.no_active'
    | 'tasks.create_first'
    | 'tasks.completed'
    | 'tasks.expand'
    | 'tasks.collapse'
    | 'tasks.new_task'
    | 'tasks.edit_task'
    | 'tasks.title_field'
    | 'tasks.title_placeholder'
    | 'tasks.description_field'
    | 'tasks.description_placeholder'
    | 'tasks.task_type'
    | 'tasks.type_one_time'
    | 'tasks.type_streak'
    | 'tasks.type_daily'
    | 'tasks.streak_goal'
    | 'tasks.streak_goal_placeholder'
    | 'tasks.type_one_time_desc'
    | 'tasks.type_streak_desc'
    | 'tasks.type_daily_desc'
    | 'tasks.confirm_delete'
    | 'tasks.saving'
    | 'tasks.image_field'
    | 'tasks.image_url_placeholder'
    | 'tasks.choose_image'
    | 'tasks.image_preview'
    | 'tasks.mark_today'
    | 'tasks.complete_task'
    | 'tasks.task_details'
    | 'tasks.daily_progress'
    // Roadmap
    | 'roadmap.title'
    | 'roadmap.current_level'
    | 'roadmap.next_level'
    | 'roadmap.keep_moving'
    // Common
    | 'common.loading'
    | 'common.error'
    | 'common.create'
    | 'common.delete'
    | 'common.save'
    | 'common.cancel'
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
        // Notes
        'notes.title': 'Notes',
        'notes.add_note': 'Add Note',
        'notes.today': 'Today',
        'notes.planned': 'Planned',
        'notes.all': 'All',
        'notes.completed': 'Completed',
        'notes.create_list': 'Create List',
        'notes.edit_list': 'Edit List',
        'notes.delete_list': 'Delete List',
        'notes.list_name': 'List Name',
        'notes.no_notes': 'No notes',
        'notes.search_placeholder': 'Search',
        'notes.details': 'Details',
        'notes.date': 'Date',
        'notes.time': 'Time',
        'notes.tags': 'Tags',
        'notes.priority': 'Priority',
        'notes.priority_none': 'None',
        'notes.priority_low': 'Low',
        'notes.priority_medium': 'Medium',
        'notes.priority_high': 'High',
        'notes.list': 'List',
        'notes.icon': 'Icon',
        'notes.color': 'Color',
        'notes.new_list': 'New List',
        'notes.done': 'Done',
        'notes.back': 'Back',
        'notes.cancel': 'Cancel',
        'notes.confirm_delete_note': 'Delete this note?',
        'notes.confirm_delete_list': 'Delete this list?',
        'notes.my_lists': 'My Lists',
        'notes.list_name_placeholder': 'List Name',
        // Tasks
        'tasks.title': 'Tasks',
        'tasks.no_active': 'No active tasks yet',
        'tasks.create_first': 'Create Your First Task',
        'tasks.completed': 'Completed',
        'tasks.expand': 'Expand',
        'tasks.collapse': 'Collapse',
        'tasks.new_task': 'New Task',
        'tasks.edit_task': 'Edit Task',
        'tasks.title_field': 'Title',
        'tasks.title_placeholder': 'Enter task title...',
        'tasks.description_field': 'Description',
        'tasks.description_placeholder': 'Add details...',
        'tasks.task_type': 'Task Type',
        'tasks.type_one_time': 'One-time',
        'tasks.type_streak': 'Streak',
        'tasks.type_daily': 'Daily',
        'tasks.streak_goal': 'Streak Goal (days)',
        'tasks.streak_goal_placeholder': 'e.g., 30',
        'tasks.type_one_time_desc': 'Complete once and mark as done.',
        'tasks.type_streak_desc': 'Track consecutive days. Complete the goal to finish.',
        'tasks.type_daily_desc': 'Track daily without a limit. Complete anytime.',
        'tasks.confirm_delete': 'Are you sure you want to delete this task?',
        'tasks.saving': 'Saving...',
        'tasks.image_field': 'Task Image',
        'tasks.image_url_placeholder': 'Enter image URL...',
        'tasks.choose_image': 'Choose Image',
        'tasks.image_preview': 'Image preview',
        'tasks.mark_today': 'Mark Today',
        'tasks.complete_task': 'Complete Task',
        'tasks.task_details': 'Task Details',
        'tasks.daily_progress': 'Daily Progress',
        // Roadmap
        'roadmap.title': 'Roadmap',
        'roadmap.current_level': 'Level',
        'roadmap.next_level': 'Next Level',
        'roadmap.keep_moving': 'Keep moving',
        // Common
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.create': 'Create',
        'common.delete': 'Delete',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
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
        // Notes
        'notes.title': '笔记',
        'notes.add_note': '添加笔记',
        'notes.today': '今天',
        'notes.planned': '已计划',
        'notes.all': '全部',
        'notes.completed': '已完成',
        'notes.create_list': '创建列表',
        'notes.edit_list': '编辑列表',
        'notes.delete_list': '删除列表',
        'notes.list_name': '列表名称',
        'notes.no_notes': '没有笔记',
        'notes.search_placeholder': '搜索',
        'notes.details': '详情',
        'notes.date': '日期',
        'notes.time': '时间',
        'notes.tags': '标签',
        'notes.priority': '优先级',
        'notes.priority_none': '无',
        'notes.priority_low': '低',
        'notes.priority_medium': '中',
        'notes.priority_high': '高',
        'notes.list': '列表',
        'notes.icon': '图标',
        'notes.color': '颜色',
        'notes.new_list': '新列表',
        'notes.done': '完成',
        'notes.back': '返回',
        'notes.cancel': '取消',
        'notes.confirm_delete_note': '删除这条笔记？',
        'notes.confirm_delete_list': '删除这个列表？',
        'notes.my_lists': '我的列表',
        'notes.list_name_placeholder': '列表名称',
        // Tasks
        'tasks.title': '任务',
        'tasks.no_active': '暂无活跃任务',
        'tasks.create_first': '创建您的第一个任务',
        'tasks.completed': '已完成',
        'tasks.expand': '展开',
        'tasks.collapse': '收起',
        'tasks.new_task': '新任务',
        'tasks.edit_task': '编辑任务',
        'tasks.title_field': '标题',
        'tasks.title_placeholder': '输入任务标题...',
        'tasks.description_field': '描述',
        'tasks.description_placeholder': '添加详情...',
        'tasks.task_type': '任务类型',
        'tasks.type_one_time': '一次性',
        'tasks.type_streak': '连续',
        'tasks.type_daily': '每日',
        'tasks.streak_goal': '连续目标（天）',
        'tasks.streak_goal_placeholder': '例如：30',
        'tasks.type_one_time_desc': '完成一次并标记为完成。',
        'tasks.type_streak_desc': '跟踪连续天数。完成目标即可结束。',
        'tasks.type_daily_desc': '每日跟踪，无限制。随时完成。',
        'tasks.confirm_delete': '确定要删除此任务吗？',
        'tasks.saving': '保存中...',
        'tasks.image_field': '任务图片',
        'tasks.image_url_placeholder': '输入图片URL...',
        'tasks.choose_image': '选择图片',
        'tasks.image_preview': '图片预览',
        'tasks.mark_today': '标记今天',
        'tasks.complete_task': '完成任务',
        'tasks.task_details': '任务详情',
        'tasks.daily_progress': '每日进度',
        // Roadmap
        'roadmap.title': '路线图',
        'roadmap.current_level': '等级',
        'roadmap.next_level': '下一级',
        'roadmap.keep_moving': '继续前进',
        // Common
        'common.loading': '加载中...',
        'common.error': '错误',
        'common.create': '创建',
        'common.delete': '删除',
        'common.save': '保存',
        'common.cancel': '取消',
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
        // Notes
        'notes.title': 'Notas',
        'notes.add_note': 'Agregar Nota',
        'notes.today': 'Hoy',
        'notes.planned': 'Planificado',
        'notes.all': 'Todas',
        'notes.completed': 'Completadas',
        'notes.create_list': 'Crear Lista',
        'notes.edit_list': 'Editar Lista',
        'notes.delete_list': 'Eliminar Lista',
        'notes.list_name': 'Nombre de Lista',
        'notes.no_notes': 'Sin notas',
        'notes.search_placeholder': 'Buscar',
        'notes.details': 'Detalles',
        'notes.date': 'Fecha',
        'notes.time': 'Hora',
        'notes.tags': 'Etiquetas',
        'notes.priority': 'Prioridad',
        'notes.priority_none': 'Ninguna',
        'notes.priority_low': 'Baja',
        'notes.priority_medium': 'Media',
        'notes.priority_high': 'Alta',
        'notes.list': 'Lista',
        'notes.icon': 'Ícono',
        'notes.color': 'Color',
        'notes.new_list': 'Nueva Lista',
        'notes.done': 'Listo',
        'notes.back': 'Volver',
        'notes.cancel': 'Cancelar',
        'notes.confirm_delete_note': '¿Eliminar esta nota?',
        'notes.confirm_delete_list': '¿Eliminar esta lista?',
        'notes.my_lists': 'Mis Listas',
        'notes.list_name_placeholder': 'Nombre de Lista',
        // Tasks
        'tasks.title': 'Tareas',
        'tasks.no_active': 'Aún no hay tareas activas',
        'tasks.create_first': 'Crea Tu Primera Tarea',
        'tasks.completed': 'Completadas',
        'tasks.expand': 'Expandir',
        'tasks.collapse': 'Contraer',
        'tasks.new_task': 'Nueva Tarea',
        'tasks.edit_task': 'Editar Tarea',
        'tasks.title_field': 'Título',
        'tasks.title_placeholder': 'Ingresa el título de la tarea...',
        'tasks.description_field': 'Descripción',
        'tasks.description_placeholder': 'Agrega detalles...',
        'tasks.task_type': 'Tipo de Tarea',
        'tasks.type_one_time': 'Una vez',
        'tasks.type_streak': 'Racha',
        'tasks.type_daily': 'Diaria',
        'tasks.streak_goal': 'Meta de Racha (días)',
        'tasks.streak_goal_placeholder': 'ej., 30',
        'tasks.type_one_time_desc': 'Completa una vez y marca como hecho.',
        'tasks.type_streak_desc': 'Rastrea días consecutivos. Completa la meta para terminar.',
        'tasks.type_daily_desc': 'Rastrea diariamente sin límite. Completa en cualquier momento.',
        'tasks.confirm_delete': '¿Estás seguro de que quieres eliminar esta tarea?',
        'tasks.saving': 'Guardando...',
        'tasks.image_field': 'Imagen de Tarea',
        'tasks.image_url_placeholder': 'Ingresa URL de imagen...',
        'tasks.choose_image': 'Elegir Imagen',
        'tasks.image_preview': 'Vista previa de imagen',
        'tasks.mark_today': 'Marcar Hoy',
        'tasks.complete_task': 'Completar Tarea',
        'tasks.task_details': 'Detalles de Tarea',
        'tasks.daily_progress': 'Progreso Diario',
        // Roadmap
        'roadmap.title': 'Hoja de Ruta',
        'roadmap.current_level': 'Nivel',
        'roadmap.next_level': 'Siguiente Nivel',
        'roadmap.keep_moving': 'Sigue moviéndote',
        // Common
        'common.loading': 'Cargando...',
        'common.error': 'Error',
        'common.create': 'Crear',
        'common.delete': 'Eliminar',
        'common.save': 'Guardar',
        'common.cancel': 'Cancelar',
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
        // Notes
        'notes.title': 'नोट्स',
        'notes.add_note': 'नोट जोड़ें',
        'notes.today': 'आज',
        'notes.planned': 'नियोजित',
        'notes.all': 'सभी',
        'notes.completed': 'पूर्ण',
        'notes.create_list': 'सूची बनाएं',
        'notes.edit_list': 'सूची संपादित करें',
        'notes.delete_list': 'सूची हटाएं',
        'notes.list_name': 'सूची का नाम',
        'notes.no_notes': 'कोई नोट नहीं',
        'notes.search_placeholder': 'खोजें',
        'notes.details': 'विवरण',
        'notes.date': 'तारीख',
        'notes.time': 'समय',
        'notes.tags': 'टैग',
        'notes.priority': 'प्राथमिकता',
        'notes.priority_none': 'कोई नहीं',
        'notes.priority_low': 'कम',
        'notes.priority_medium': 'मध्यम',
        'notes.priority_high': 'उच्च',
        'notes.list': 'सूची',
        'notes.icon': 'आइकन',
        'notes.color': 'रंग',
        'notes.new_list': 'नई सूची',
        'notes.done': 'हो गया',
        'notes.back': 'वापस',
        'notes.cancel': 'रद्द करें',
        'notes.confirm_delete_note': 'क्या आप इस नोट को हटाना चाहते हैं?',
        'notes.confirm_delete_list': 'क्या आप इस सूची को हटाना चाहते हैं?',
        'notes.my_lists': 'मेरी सूचियाँ',
        'notes.list_name_placeholder': 'सूची का नाम',
        // Tasks
        'tasks.title': 'कार्य',
        'tasks.no_active': 'अभी तक कोई सक्रिय कार्य नहीं',
        'tasks.create_first': 'अपना पहला कार्य बनाएं',
        'tasks.completed': 'पूर्ण',
        'tasks.expand': 'विस्तार करें',
        'tasks.collapse': 'संक्षिप्त करें',
        'tasks.new_task': 'नया कार्य',
        'tasks.edit_task': 'कार्य संपादित करें',
        'tasks.title_field': 'शीर्षक',
        'tasks.title_placeholder': 'कार्य शीर्षक दर्ज करें...',
        'tasks.description_field': 'विवरण',
        'tasks.description_placeholder': 'विवरण जोड़ें...',
        'tasks.task_type': 'कार्य प्रकार',
        'tasks.type_one_time': 'एक बार',
        'tasks.type_streak': 'लगातार',
        'tasks.type_daily': 'दैनिक',
        'tasks.streak_goal': 'लगातार लक्ष्य (दिन)',
        'tasks.streak_goal_placeholder': 'उदा., 30',
        'tasks.type_one_time_desc': 'एक बार पूरा करें और पूर्ण के रूप में चिह्नित करें।',
        'tasks.type_streak_desc': 'लगातार दिनों को ट्रैक करें। लक्ष्य पूरा करने के लिए समाप्त करें।',
        'tasks.type_daily_desc': 'बिना सीमा के दैनिक ट्रैक करें। किसी भी समय पूरा करें।',
        'tasks.confirm_delete': 'क्या आप वाकई इस कार्य को हटाना चाहते हैं?',
        'tasks.saving': 'सहेजा जा रहा है...',
        'tasks.image_field': 'कार्य छवि',
        'tasks.image_url_placeholder': 'छवि URL दर्ज करें...',
        'tasks.choose_image': 'छवि चुनें',
        'tasks.image_preview': 'छवि पूर्वावलोकन',
        'tasks.mark_today': 'आज चिह्नित करें',
        'tasks.complete_task': 'कार्य पूर्ण करें',
        'tasks.task_details': 'कार्य विवरण',
        'tasks.daily_progress': 'दैनिक प्रगति',
        // Roadmap
        'roadmap.title': 'रोडमैप',
        'roadmap.current_level': 'स्तर',
        'roadmap.next_level': 'अगला स्तर',
        'roadmap.keep_moving': 'चलते रहो',
        // Common
        'common.loading': 'लोड हो रहा है...',
        'common.error': 'त्रुटि',
        'common.create': 'बनाएं',
        'common.delete': 'हटाएं',
        'common.save': 'सहेजें',
        'common.cancel': 'रद्द करें',
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
        // Notes
        'notes.title': 'الملاحظات',
        'notes.add_note': 'إضافة ملاحظة',
        'notes.today': 'اليوم',
        'notes.planned': 'مخطط',
        'notes.all': 'الكل',
        'notes.completed': 'مكتمل',
        'notes.create_list': 'إنشاء قائمة',
        'notes.edit_list': 'تحرير القائمة',
        'notes.delete_list': 'حذف القائمة',
        'notes.list_name': 'اسم القائمة',
        'notes.no_notes': 'لا توجد ملاحظات',
        'notes.search_placeholder': 'بحث',
        'notes.details': 'التفاصيل',
        'notes.date': 'التاريخ',
        'notes.time': 'الوقت',
        'notes.tags': 'العلامات',
        'notes.priority': 'الأولوية',
        'notes.priority_none': 'لا شيء',
        'notes.priority_low': 'منخفض',
        'notes.priority_medium': 'متوسط',
        'notes.priority_high': 'عالي',
        'notes.list': 'قائمة',
        'notes.icon': 'أيقونة',
        'notes.color': 'اللون',
        'notes.new_list': 'قائمة جديدة',
        'notes.done': 'تم',
        'notes.back': 'عودة',
        'notes.cancel': 'إلغاء',
        'notes.confirm_delete_note': 'حذف هذه الملاحظة؟',
        'notes.confirm_delete_list': 'حذف هذه القائمة؟',
        'notes.my_lists': 'قوائمي',
        'notes.list_name_placeholder': 'اسم القائمة',
        // Tasks
        'tasks.title': 'المهام',
        'tasks.no_active': 'لا توجد مهام نشطة حتى الآن',
        'tasks.create_first': 'أنشئ مهمتك الأولى',
        'tasks.completed': 'مكتمل',
        'tasks.expand': 'توسيع',
        'tasks.collapse': 'طي',
        'tasks.new_task': 'مهمة جديدة',
        'tasks.edit_task': 'تحرير المهمة',
        'tasks.title_field': 'العنوان',
        'tasks.title_placeholder': 'أدخل عنوان المهمة...',
        'tasks.description_field': 'الوصف',
        'tasks.description_placeholder': 'أضف التفاصيل...',
        'tasks.task_type': 'نوع المهمة',
        'tasks.type_one_time': 'مرة واحدة',
        'tasks.type_streak': 'متتالية',
        'tasks.type_daily': 'يومية',
        'tasks.streak_goal': 'هدف المتتالية (أيام)',
        'tasks.streak_goal_placeholder': 'مثلاً، 30',
        'tasks.type_one_time_desc': 'أكمل مرة واحدة وحدد كمنجز.',
        'tasks.type_streak_desc': 'تتبع الأيام المتتالية. أكمل الهدف للإنهاء.',
        'tasks.type_daily_desc': 'تتبع يومياً بدون حد. أكمل في أي وقت.',
        'tasks.confirm_delete': 'هل أنت متأكد أنك تريد حذف هذه المهمة؟',
        'tasks.saving': 'جاري الحفظ...',
        'tasks.image_field': 'صورة المهمة',
        'tasks.image_url_placeholder': 'أدخل رابط الصورة...',
        'tasks.choose_image': 'اختر صورة',
        'tasks.image_preview': 'معاينة الصورة',
        'tasks.mark_today': 'تحديد اليوم',
        'tasks.complete_task': 'إكمال المهمة',
        'tasks.task_details': 'تفاصيل المهمة',
        'tasks.daily_progress': 'التقدم اليومي',
        // Roadmap
        'roadmap.title': 'خارطة الطريق',
        'roadmap.current_level': 'المستوى',
        'roadmap.next_level': 'المستوى التالي',
        'roadmap.keep_moving': 'استمر في التحرك',
        // Common
        'common.loading': 'جار التحميل...',
        'common.error': 'خطأ',
        'common.create': 'إنشاء',
        'common.delete': 'حذف',
        'common.save': 'حفظ',
        'common.cancel': 'إلغاء',
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
        // Notes
        'notes.title': 'Заметки',
        'notes.add_note': 'Добавить Заметку',
        'notes.today': 'Сегодня',
        'notes.planned': 'Запланировано',
        'notes.all': 'Все',
        'notes.completed': 'Завершено',
        'notes.create_list': 'Создать Список',
        'notes.edit_list': 'Редактировать Список',
        'notes.delete_list': 'Удалить Список',
        'notes.list_name': 'Название Списка',
        'notes.no_notes': 'Нет заметок',
        'notes.search_placeholder': 'Поиск',
        'notes.details': 'Детали',
        'notes.date': 'Дата',
        'notes.time': 'Время',
        'notes.tags': 'Теги',
        'notes.priority': 'Приоритет',
        'notes.priority_none': 'Нет',
        'notes.priority_low': 'Низкий',
        'notes.priority_medium': 'Средний',
        'notes.priority_high': 'Высокий',
        'notes.list': 'Список',
        'notes.icon': 'Иконка',
        'notes.color': 'Цвет',
        'notes.new_list': 'Новый Список',
        'notes.done': 'Готово',
        'notes.back': 'Назад',
        'notes.cancel': 'Отмена',
        'notes.confirm_delete_note': 'Удалить эту заметку?',
        'notes.confirm_delete_list': 'Удалить этот список?',
        'notes.my_lists': 'Мои Списки',
        'notes.list_name_placeholder': 'Название Списка',
        // Tasks
        'tasks.title': 'Задачи',
        'tasks.no_active': 'Пока нет активных задач',
        'tasks.create_first': 'Создайте Вашу Первую Задачу',
        'tasks.completed': 'Завершено',
        'tasks.expand': 'Развернуть',
        'tasks.collapse': 'Свернуть',
        'tasks.new_task': 'Новая Задача',
        'tasks.edit_task': 'Редактировать Задачу',
        'tasks.title_field': 'Название',
        'tasks.title_placeholder': 'Введите название задачи...',
        'tasks.description_field': 'Описание',
        'tasks.description_placeholder': 'Добавьте детали...',
        'tasks.task_type': 'Тип Задачи',
        'tasks.type_one_time': 'Разовая',
        'tasks.type_streak': 'Серия',
        'tasks.type_daily': 'Ежедневная',
        'tasks.streak_goal': 'Цель серии (дни)',
        'tasks.streak_goal_placeholder': 'напр., 30',
        'tasks.type_one_time_desc': 'Выполните один раз и отметьте как завершённую.',
        'tasks.type_streak_desc': 'Отслеживайте последовательные дни. Выполните цель для завершения.',
        'tasks.type_daily_desc': 'Отслеживайте ежедневно без ограничений. Завершите в любое время.',
        'tasks.confirm_delete': 'Вы уверены, что хотите удалить эту задачу?',
        'tasks.saving': 'Сохранение...',
        'tasks.image_field': 'Изображение задачи',
        'tasks.image_url_placeholder': 'Введите URL изображения...',
        'tasks.choose_image': 'Выбрать изображение',
        'tasks.image_preview': 'Предпросмотр изображения',
        'tasks.mark_today': 'Отметить сегодня',
        'tasks.complete_task': 'Завершить задачу',
        'tasks.task_details': 'Детали задачи',
        'tasks.daily_progress': 'Ежедневный прогресс',
        // Roadmap
        'roadmap.title': 'Дорожная карта',
        'roadmap.current_level': 'Уровень',
        'roadmap.next_level': 'Следующий уровень',
        'roadmap.keep_moving': 'Продолжай движение',
        // Common
        'common.loading': 'Загрузка...',
        'common.error': 'Ошибка',
        'common.create': 'Создать',
        'common.delete': 'Удалить',
        'common.save': 'Сохранить',
        'common.cancel': 'Отмена',
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
