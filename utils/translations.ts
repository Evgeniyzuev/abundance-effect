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
    | 'goals.edit_wish'
    | 'goals.wish_image'
    | 'goals.wish_title'
    | 'goals.wish_description'
    | 'goals.cost_label'
    | 'goals.level_label'
    | 'goals.cost_enter_valid'
    | 'goals.level_thresholds_not_available'
    | 'goals.please_log_in'
    | 'goals.please_enter_title'
    | 'goals.image_failed'
    | 'goals.please_select_image'
    | 'goals.image_url_tab'
    | 'goals.image_upload_tab'
    | 'goals.pinterest_link'
    | 'goals.enter_image_url'
    | 'goals.choose_image'
    | 'goals.title_placeholder'
    | 'goals.description_placeholder'
    | 'goals.cost_placeholder'
    | 'goals.level_placeholder'
    | 'goals.cost_calculator_title'
    | 'goals.calculate_level_from_cost'
    | 'goals.save_wish'
    | 'goals.update_wish'
    | 'goals.saving_wish'
    | 'goals.image_preview'
    | 'goals.recommended_for_you'
    | 'goals.completed_wishes'
    // Challenges page
    | 'challenges.title'
    | 'challenges.no_active'
    | 'challenges.available'
    | 'challenges.accepted'
    | 'challenges.completed'
    // AI page
    | 'ai.title'
    | 'ai.coming_soon'
    // Challenges page details
    | 'challenges.page_title'
    | 'challenges.join'
    | 'challenges.check'
    | 'challenges.checking'
    | 'challenges.no_challenges_yet'
    // Challenges completion modal
    | 'challenges.completed_title'
    | 'challenges.your_reward'
    | 'challenges.great'
    // Wallet page
    | 'wallet.title'
    | 'wallet.wallet_balance'
    | 'wallet.core_balance'
    | 'wallet.top_up'
    | 'wallet.transfer_to_core'
    | 'wallet.send'
    | 'wallet.receive'
    | 'wallet.daily_income'
    | 'wallet.reinvest'
    | 'wallet.level'
    | 'wallet.core_growth_calculator'
    | 'wallet.time_to_target'
    | 'wallet.start_core'
    | 'wallet.daily_rewards'
    | 'wallet.years'
    | 'wallet.future_core'
    | 'wallet.target_amount'
    | 'wallet.calculate'
    | 'wallet.estimated_time'
    | 'wallet.target_date'
    | 'wallet.transfer_from_wallet'
    | 'wallet.core_history'
    | 'wallet.loading_history'
    | 'wallet.no_operations'
    | 'wallet.interest_earned'
    | 'wallet.transfer'
    | 'wallet.reinvest_op'
    | 'wallet.operation'
    // Profile/Social page
    | 'profile.title'
    | 'profile.language'
    | 'profile.level'
    | 'profile.username'
    | 'profile.telegram_id'
    | 'profile.reinvest'
    | 'profile.linked_accounts'
    | 'profile.link_account'
    | 'profile.linked'
    | 'profile.not_linked'
    | 'profile.google_telegram_error'
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
    // Levels
    | 'level.level_up_title'
    | 'level.congratulations'
    | 'level.previous'
    | 'level.new'
    | 'level.unlock_message'
    | 'level.continue'
    // Auth
    | 'auth.login'
    | 'auth.logout'
    | 'auth.welcome_subtitle'
    | 'auth.google'
    | 'auth.telegram'
    | 'auth.telegram_mini_app'
    | 'auth.apple'
    | 'auth.email_placeholder'
    | 'auth.send_magic_link'
    | 'auth.or'
    | 'auth.check_email'
    | 'auth.magic_link_sent'
    // Onboarding
    | 'onboarding.choose_language'
    | 'onboarding.hero_title'
    | 'onboarding.hero_subtitle'
    | 'onboarding.hero_description'
    | 'onboarding.program_title'
    | 'onboarding.program_subtitle'
    | 'onboarding.program_description'
    | 'onboarding.level_1' // MISSING: all languages
    | 'onboarding.level_20' // MISSING: all languages
    | 'onboarding.first_step' // MISSING: all languages
    | 'onboarding.financial_stress' // MISSING: all languages
    | 'onboarding.freedom_joy' // MISSING: all languages
    | 'onboarding.challenges_title'
    | 'onboarding.challenges_subtitle' // MISSING: all languages
    | 'onboarding.challenges_description'
    | 'onboarding.daily_challenges' // MISSING: all languages
    | 'onboarding.achievements' // MISSING: all languages
    | 'onboarding.rare_rewards' // MISSING: all languages
    | 'onboarding.streaks' // MISSING: all languages
    | 'onboarding.ai_core_title'
    | 'onboarding.ai_core_subtitle' // MISSING: all languages
    | 'onboarding.ai_core_description'
    | 'onboarding.lifelong_income' // MISSING: all languages
    | 'onboarding.always_working' // MISSING: all languages
    | 'onboarding.annual_growth' // MISSING: all languages
    | 'onboarding.success_title'
    | 'onboarding.success_subtitle' // MISSING: all languages
    | 'onboarding.success_description'
    | 'onboarding.success_stories' // MISSING: all languages
    | 'onboarding.ai_mentor' // MISSING: all languages
    | 'onboarding.wishes_title'
    | 'onboarding.wishes_subtitle' // MISSING: all languages
    | 'onboarding.wishes_description'
    | 'onboarding.define_dreams' // MISSING: all languages
    | 'onboarding.what_you_want' // MISSING: all languages
    | 'onboarding.track_progress' // MISSING: all languages
    | 'onboarding.track_daily' // MISSING: all languages
    | 'onboarding.business_title'
    | 'onboarding.business_subtitle' // MISSING: all languages
    | 'onboarding.business_description'
    | 'onboarding.business' // MISSING: all languages
    | 'onboarding.insights_analytics' // MISSING: all languages
    | 'onboarding.automation' // MISSING: all languages
    | 'onboarding.pay_first_title'
    | 'onboarding.pay_first_subtitle' // MISSING: all languages
    | 'onboarding.pay_first_description'
    | 'onboarding.invest_earn_grow' // MISSING: all languages
    | 'onboarding.values_title'
    | 'onboarding.values_subtitle' // MISSING: all languages
    | 'onboarding.values_description'
    | 'onboarding.value_security' // MISSING: all languages
    | 'onboarding.value_sustainability' // MISSING: all languages
    | 'onboarding.value_independence' // MISSING: all languages
    | 'onboarding.learning_title'
    | 'onboarding.learning_description'
    | 'onboarding.exclusive_content' // MISSING: all languages
    | 'onboarding.proven_strategies' // MISSING: all languages
    | 'onboarding.expert_insights' // MISSING: all languages
    | 'onboarding.cta_title'
    | 'onboarding.cta_description'
    | 'onboarding.get_started'
    | 'onboarding.start_path' // MISSING: all languages
    | 'onboarding.continue'; // MISSING: all languages

export const translations: { [key in Language]: Partial<{ [key in TranslationKey]: string }> } = {
    en: {
        // Goals
        'goals.title': 'My Goals',
        'goals.goal': 'Goal',
        'goals.add_wish': 'Add Wish',
        'goals.edit_wish': 'Edit Wish',
        'goals.wish_image': 'Wish Image',
        'goals.wish_title': 'Title',
        'goals.wish_description': 'Description',
        'goals.cost_label': 'Cost $',
        'goals.level_label': 'Level',
        'goals.cost_enter_valid': 'Please enter a valid cost first',
        'goals.level_thresholds_not_available': 'Level thresholds not available',
        'goals.please_log_in': 'Please log in to add a wish',
        'goals.please_enter_title': 'Please enter a wish title',
        'goals.image_failed': 'Failed to process image',
        'goals.please_select_image': 'Please select an image file',
        'goals.image_url_tab': 'URL',
        'goals.image_upload_tab': 'Upload',
        'goals.pinterest_link': 'Pinterest',
        'goals.enter_image_url': 'Enter image URL',
        'goals.choose_image': 'Choose Image',
        'goals.title_placeholder': 'What do you want to achieve?',
        'goals.description_placeholder': 'Describe your wish...',
        'goals.cost_placeholder': 'e.g. $100',
        'goals.level_placeholder': 'Auto or manual',
        'goals.cost_calculator_title': 'Coming soon',
        'goals.calculate_level_from_cost': 'Calculate level from cost',
        'goals.save_wish': 'Save Wish',
        'goals.update_wish': 'Update Wish',
        'goals.saving_wish': 'Saving...',
        'goals.image_preview': 'Image preview',
        'goals.recommended_for_you': 'Recommended for You',
        'goals.completed_wishes': 'Completed Wishes',
        // Challenges
        'challenges.title': 'Challenges',
        'challenges.page_title': 'Challenges',
        'challenges.no_active': 'No active challenges yet.',
        'challenges.available': 'Available Challenges',
        'challenges.accepted': 'Accepted Challenges',
        'challenges.completed': 'Completed Challenges',
        'challenges.join': 'Join',
        'challenges.check': 'Check',
        'challenges.checking': 'Checking...',
        'challenges.no_challenges_yet': 'No challenges yet',
        'challenges.completed_title': 'Challenge Completed!',
        'challenges.your_reward': 'Your reward:',
        'challenges.great': 'Great!',
        // AI
        'ai.title': 'AI Assistant',
        'ai.coming_soon': 'AI Squad coming soon.',
        // Wallet
        'wallet.title': 'Wallet',
        'wallet.wallet_balance': 'Wallet Balance',
        'wallet.core_balance': 'Core Balance',
        'wallet.top_up': 'Top Up',
        'wallet.transfer_to_core': 'To Core',
        'wallet.send': 'Send',
        'wallet.receive': 'Receive',
        'wallet.daily_income': 'Daily Income',
        'wallet.reinvest': 'Reinvest %',
        'wallet.level': 'Level',
        'wallet.core_growth_calculator': 'Core Growth Calculator',
        'wallet.time_to_target': 'Time to Target',
        'wallet.start_core': 'Start Core',
        'wallet.daily_rewards': 'Daily Rewards',
        'wallet.years': 'Years',
        'wallet.future_core': 'Future Core',
        'wallet.target_amount': 'Target Core Amount',
        'wallet.calculate': 'Calculate',
        'wallet.estimated_time': 'Estimated time to reach target',
        'wallet.target_date': 'Target date',
        'wallet.transfer_from_wallet': 'Transfer from Wallet',
        'wallet.core_history': 'Core History',
        'wallet.loading_history': 'Loading history...',
        'wallet.no_operations': 'No operations yet',
        'wallet.interest_earned': 'Interest Earned',
        'wallet.transfer': 'Transfer',
        'wallet.reinvest_op': 'Reinvest',
        'wallet.operation': 'Operation',
        // Profile
        'profile.title': 'Profile',
        'profile.language': 'Language',
        'profile.level': 'Level',
        'profile.username': 'Username',
        'profile.telegram_id': 'Telegram ID',
        'profile.reinvest': 'Reinvest',
        'profile.linked_accounts': 'Linked Accounts',
        'profile.link_account': 'Link',
        'profile.linked': 'Linked',
        'profile.not_linked': 'Not Linked',
        'profile.google_telegram_error': 'Google linking is not supported in Telegram. Please link Email first, open app in browser, and link Google there.',
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
        // Levels
        'level.level_up_title': 'Level Up!',
        'level.congratulations': 'Congratulations! You\'ve reached a new level!',
        'level.previous': 'Previous',
        'level.new': 'New Level',
        'level.unlock_message': 'The new level brings additional features and bonuses!',
        'level.continue': 'Continue the adventure!',
        // Auth
        'auth.login': 'Login',
        'auth.logout': 'Logout',
        'auth.welcome_subtitle': 'Log in to start your journey',
        'auth.google': 'Continue with Google',
        'auth.telegram': 'Continue with Telegram',
        'auth.telegram_mini_app': 'Open Telegram Mini App',
        'auth.apple': 'Continue with Apple',
        'auth.email_placeholder': 'Enter your email',
        'auth.send_magic_link': 'Send Magic Link',
        'auth.or': 'OR',
        'auth.check_email': 'Check your email for the login link',
        'auth.magic_link_sent': 'Magic link sent!',
        // Onboarding
        'onboarding.choose_language': 'Choose Your Language',
        'onboarding.hero_title': 'Abundance Effect',
        'onboarding.hero_subtitle': 'Path to Abundance, Freedom & Self-Realization',
        'onboarding.hero_description': 'Living in abundance is not a dream, but the natural state of a person when they are in harmony with themselves, others, and the world.',
        'onboarding.program_title': 'Growth Program',
        'onboarding.program_subtitle': 'From zero to your first $1,000,000 at level 20.',
        'onboarding.program_description': 'Step-by-step program, clear actions, support and everything you need. Each level brings new income and new opportunities. Discover how quickly you can achieve your goals with the abundance program!',
        'onboarding.challenges_title': 'Complete Challenges & Get Rewards',
        'onboarding.challenges_description': 'Income is always at hand - independent, flexible. You decide when and how much to earn. Higher levels - more income and influence.',
        'onboarding.wishes_title': 'Wish Fulfillment',
        'onboarding.wishes_description': 'With modern technology, wishes are fulfilled dozens of times easier and faster. Learn stories from others - your dream life is already waiting!',
        'onboarding.ai_core_title': 'AI Core',
        'onboarding.ai_core_description': 'Non-transferable capital that is guaranteed to generate income daily. Base growth: +26% per year, x2 in 3 years, x10 in 10 years - even without effort. AI is your abundance organizer.',
        'onboarding.success_title': 'Success Stories & AI Mentor',
        'onboarding.success_description': 'Learn how others achieved your goals. Learn best practices, increase income. AI assistant takes care of routine and helps figure out everything.',
        'onboarding.pay_first_title': 'Pay Yourself First',
        'onboarding.pay_first_description': 'When buying - become a beneficiary and participate in business income. Don\'t spend money irreversibly: invest so they return and multiply.',
        'onboarding.values_title': 'Our Values',
        'onboarding.values_description': 'Independence, security, sustainability. We build a society of sustainable people who don\'t harm the world and each other for money or power. When one wish is fulfilled - the whole world grows.',
        'onboarding.learning_title': 'Learning & Earning More',
        'onboarding.learning_description': 'Access exclusive educational content, strategies, and insights to maximize your earning potential and personal growth.',
        'onboarding.business_title': 'Build Your Business',
        'onboarding.business_description': 'Develop entrepreneurship skills, create multiple income streams, and build sustainable wealth for long-term success.',
        'onboarding.cta_title': 'Join Today',
        'onboarding.cta_description': 'Create your wish board and start your path to abundance!',
        'onboarding.get_started': 'Get Started',
    },
    zh: {
        // Goals
        'goals.title': '我的目标',
        'goals.goal': '目标',
        'goals.add_wish': '添加愿望',
        'goals.edit_wish': 'Edit Wish', // TODO: Add Chinese translation
        'goals.wish_image': 'Wish Image', // TODO: Add Chinese translation
        'goals.wish_title': 'Title', // TODO: Add Chinese translation
        'goals.wish_description': 'Description', // TODO: Add Chinese translation
        'goals.cost_label': 'Cost $', // TODO: Add Chinese translation
        'goals.level_label': 'Level', // TODO: Add Chinese translation
        'goals.cost_enter_valid': 'Please enter a valid cost first', // TODO: Add Chinese translation
        'goals.level_thresholds_not_available': 'Level thresholds not available', // TODO: Add Chinese translation
        'goals.please_log_in': 'Please log in to add a wish', // TODO: Add Chinese translation
        'goals.please_enter_title': 'Please enter a wish title', // TODO: Add Chinese translation
        'goals.image_failed': 'Failed to process image', // TODO: Add Chinese translation
        'goals.please_select_image': 'Please select an image file', // TODO: Add Chinese translation
        'goals.image_url_tab': 'URL', // TODO: Add Chinese translation
        'goals.image_upload_tab': 'Upload', // TODO: Add Chinese translation
        'goals.pinterest_link': 'Pinterest', // TODO: Add Chinese translation
        'goals.enter_image_url': 'Enter image URL', // TODO: Add Chinese translation
        'goals.choose_image': 'Choose Image', // TODO: Add Chinese translation
        'goals.title_placeholder': 'What do you want to achieve?', // TODO: Add Chinese translation
        'goals.description_placeholder': 'Describe your wish...', // TODO: Add Chinese translation
        'goals.cost_placeholder': 'e.g. $100', // TODO: Add Chinese translation
        'goals.level_placeholder': 'Auto or manual', // TODO: Add Chinese translation
        'goals.cost_calculator_title': 'Coming soon', // TODO: Add Chinese translation
        'goals.calculate_level_from_cost': 'Calculate level from cost', // TODO: Add Chinese translation
        'goals.save_wish': 'Save Wish', // TODO: Add Chinese translation
        'goals.update_wish': 'Update Wish', // TODO: Add Chinese translation
        'goals.saving_wish': 'Saving...', // TODO: Add Chinese translation
        'goals.image_preview': '图片预览',
        'goals.recommended_for_you': '为您推荐',
        'goals.completed_wishes': '已完成愿望',
        // Challenges
        'challenges.title': '挑战',
        'challenges.page_title': '挑战',
        'challenges.no_active': '暂无活跃挑战。',
        'challenges.available': '可用挑战',
        'challenges.accepted': '已接受挑战',
        'challenges.completed': '已完成挑战',
        'challenges.join': '加入',
        'challenges.check': '检查',
        'challenges.checking': '检查中...',
        'challenges.no_challenges_yet': '暂无挑战',
        'challenges.completed_title': '挑战完成！',
        'challenges.your_reward': '您的奖励：',
        'challenges.great': '好极了！',
        // AI
        'ai.title': 'AI 助手',
        'ai.coming_soon': 'AI 小队即将推出。',
        // Wallet
        'wallet.title': '钱包',
        'wallet.wallet_balance': '钱包余额',
        'wallet.core_balance': '核心余额',
        'wallet.top_up': '充值',
        'wallet.transfer_to_core': '转到核心',
        'wallet.send': '发送',
        'wallet.receive': '接收',
        'wallet.daily_income': '每日收入',
        'wallet.reinvest': '再投资 %',
        'wallet.level': '等级',
        'wallet.core_growth_calculator': '核心增长计算器',
        'wallet.time_to_target': '达到目标时间',
        'wallet.start_core': '起始核心',
        'wallet.daily_rewards': '每日奖励',
        'wallet.years': '年',
        'wallet.future_core': '未来核心',
        'wallet.target_amount': '目标核心金额',
        'wallet.calculate': '计算',
        'wallet.estimated_time': '预计达到目标时间',
        'wallet.target_date': '目标日期',
        'wallet.transfer_from_wallet': '从钱包转账',
        'wallet.core_history': '核心历史',
        'wallet.loading_history': '加载历史...',
        'wallet.no_operations': '暂无操作',
        'wallet.interest_earned': '赚取利息',
        'wallet.transfer': '转账',
        'wallet.reinvest_op': '再投资',
        'wallet.operation': '操作',
        // Profile
        'profile.title': '个人资料',
        'profile.language': '语言',
        'profile.level': '等级',
        'profile.username': '用户名',
        'profile.telegram_id': 'Telegram ID',
        'profile.reinvest': '再投资',
        'profile.linked_accounts': '关联账户',
        'profile.link_account': '关联',
        'profile.linked': '已关联',
        'profile.not_linked': '未关联',
        'profile.google_telegram_error': 'Telegram 不支持 Google 关联。请先关联电子邮件，在浏览器中打开应用，然后在那里关联 Google。',
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
        // Levels
        'level.level_up_title': '新等级！',
        'level.congratulations': '恭喜！您达到了新等级！',
        'level.previous': '上一级',
        'level.new': '新等级',
        'level.unlock_message': '新等级带来了额外功能和奖金！',
        'level.continue': '继续冒险！',
        // Auth
        'auth.login': '登录',
        'auth.logout': '登出',
        'auth.welcome_subtitle': '登录以开始您的旅程',
        'auth.google': '通过 Google 继续',
        'auth.telegram': '通过 Telegram 继续',
        'auth.telegram_mini_app': '打开 Telegram 小程序',
        'auth.apple': '通过 Apple 继续',
        'auth.email_placeholder': '输入您的电子邮件',
        'auth.send_magic_link': '发送登录链接',
        'auth.or': '或',
        'auth.check_email': '请检查您的电子邮件以获取登录链接',
        'auth.magic_link_sent': '登录链接已发送！',
        // Onboarding
        'onboarding.choose_language': '选择您的语言',
        'onboarding.hero_title': '丰盛效应',
        'onboarding.hero_subtitle': '通往丰盛、自由和自我实现的道路',
        'onboarding.hero_description': '丰盛的生活不是梦想，而是人与自己、他人和世界和谐相处时的自然状态。',
        'onboarding.program_title': '成长计划',
        'onboarding.program_subtitle': '从零到第20级获得您的第一个100万美元。',
        'onboarding.program_description': '循序渐进的计划，明确的行动，支持和您需要的一切。每个级别都带来新的收入和新的机会。了解您可以多快地通过丰盛计划实现您的目标！',
        'onboarding.challenges_title': '完成挑战并获得奖励',
        'onboarding.challenges_description': '收入总是触手可及——独立、灵活。你决定何时赚多少。更高等级——更多收入和影响力。',
        'onboarding.wishes_title': '愿望实现',
        'onboarding.wishes_description': '通过现代技术，愿望的实现变得数十倍容易和快速。了解他人的故事——你梦想的生活已经在等待！',
        'onboarding.ai_core_title': 'AI核心',
        'onboarding.ai_core_description': '不可转移的资本，保证每天产生收入。基础增长：每年+26%，3年x2，10年x10——即使不努力。AI是你的丰盛组织者。',
        'onboarding.success_title': '成功故事和AI导师',
        'onboarding.success_description': '了解他人如何实现你的目标。学习最佳实践，增加收入。AI助手处理例行事务并帮助解决一切。',
        'onboarding.pay_first_title': '先付给自己',
        'onboarding.pay_first_description': '购买时——成为受益人并参与业务收入。不要不可逆转地花钱：投资让它们回来并倍增。',
        'onboarding.values_title': '我们的价值观',
        'onboarding.values_description': '独立、安全、可持续。我们建立一个可持续的人的社会，他们不会为了金钱或权力而伤害世界和彼此。当一个愿望实现——整个世界都会成长。',
        'onboarding.learning_title': '学习与赚取更多',
        'onboarding.learning_description': '访问独家教育内容、策略和见解，最大限度地提高您的收入潜力和个人成长。',
        'onboarding.business_title': '建立您的业务',
        'onboarding.business_description': '培养创业技能，创造多重收入来源，建立可持续的长期成功财富。',
        'onboarding.cta_title': '今天就加入',
        'onboarding.cta_description': '创建您的愿望板，开始通往丰盛的旅程！',
        'onboarding.get_started': '开始',
    },
    es: {
        // Goals
        'goals.title': 'Mis Objetivos',
        'goals.goal': 'Objetivo',
        'goals.add_wish': 'Agregar Deseo',
        'goals.edit_wish': 'Editar Deseo',
        'goals.wish_image': 'Imagen del Deseo',
        'goals.wish_title': 'Título',
        'goals.wish_description': 'Descripción',
        'goals.cost_label': 'Costo $',
        'goals.level_label': 'Nivel',
        'goals.cost_enter_valid': 'Ingresa un costo válido primero',
        'goals.level_thresholds_not_available': 'Los umbrales de nivel no están disponibles',
        'goals.please_log_in': 'Inicia sesión para agregar un deseo',
        'goals.please_enter_title': 'Ingresa un título de deseo',
        'goals.image_failed': 'Fallo al procesar la imagen',
        'goals.please_select_image': 'Selecciona un archivo de imagen',
        'goals.image_url_tab': 'URL',
        'goals.image_upload_tab': 'Subir',
        'goals.pinterest_link': 'Pinterest',
        'goals.enter_image_url': 'Ingresar URL de imagen',
        'goals.choose_image': 'Elegir Imagen',
        'goals.title_placeholder': '¿Qué quieres lograr?',
        'goals.description_placeholder': 'Describe tu deseo...',
        'goals.cost_placeholder': 'ej. $100',
        'goals.level_placeholder': 'Automático o manual',
        'goals.cost_calculator_title': 'Próximamente',
        'goals.calculate_level_from_cost': 'Calcular nivel desde costo',
        'goals.save_wish': 'Guardar Deseo',
        'goals.update_wish': 'Actualizar Deseo',
        'goals.saving_wish': 'Guardando...',
        'goals.image_preview': 'Vista previa de imagen',
        // Challenges
        'challenges.title': 'Desafíos',
        'challenges.page_title': 'Desafíos',
        'challenges.no_active': 'Aún no hay desafíos activos.',
        'challenges.available': 'Desafíos Disponibles',
        'challenges.accepted': 'Desafíos Aceptados',
        'challenges.completed': 'Desafíos Completados',
        'challenges.join': 'Unirse',
        'challenges.check': 'Revisar',
        'challenges.checking': 'Revisando...',
        'challenges.no_challenges_yet': 'Aún no hay desafíos',
        'challenges.completed_title': '¡Desafío Completado!',
        'challenges.your_reward': 'Tu recompensa:',
        'challenges.great': '¡Excelente!',
        // AI
        'ai.title': 'Asistente de IA',
        'ai.coming_soon': 'Escuadrón de IA próximamente.',
        // Wallet
        'wallet.title': 'Billetera',
        'wallet.wallet_balance': 'Saldo de Billetera',
        'wallet.core_balance': 'Saldo de Core',
        'wallet.top_up': 'Recargar',
        'wallet.transfer_to_core': 'A Core',
        'wallet.send': 'Enviar',
        'wallet.receive': 'Recibir',
        'wallet.daily_income': 'Ingreso Diario',
        'wallet.reinvest': 'Reinversión %',
        'wallet.level': 'Nivel',
        'wallet.core_growth_calculator': 'Calculadora de Crecimiento Core',
        'wallet.time_to_target': 'Tiempo hasta Objetivo',
        'wallet.start_core': 'Core Inicial',
        'wallet.daily_rewards': 'Recompensas Diarias',
        'wallet.years': 'Años',
        'wallet.future_core': 'Core Futuro',
        'wallet.target_amount': 'Cantidad Core Objetivo',
        'wallet.calculate': 'Calcular',
        'wallet.estimated_time': 'Tiempo estimado para alcanzar objetivo',
        'wallet.target_date': 'Fecha objetivo',
        'wallet.transfer_from_wallet': 'Transferir desde Billetera',
        'wallet.core_history': 'Historial Core',
        'wallet.loading_history': 'Cargando historial...',
        'wallet.no_operations': 'Aún no hay operaciones',
        'wallet.interest_earned': 'Interés Ganado',
        'wallet.transfer': 'Transferencia',
        'wallet.reinvest_op': 'Reinversión',
        'wallet.operation': 'Operación',
        // Profile
        'profile.title': 'Perfil',
        'profile.language': 'Idioma',
        'profile.level': 'Nivel',
        'profile.username': 'Nombre de usuario',
        'profile.telegram_id': 'ID de Telegram',
        'profile.reinvest': 'Reinversión',
        'profile.linked_accounts': 'Cuentas Vinculadas',
        'profile.link_account': 'Vincular',
        'profile.linked': 'Vinculado',
        'profile.not_linked': 'No Vinculado',
        'profile.google_telegram_error': 'La vinculación con Google no es compatible en Telegram. Vincula primero el correo electrónico, abre la aplicación en el navegador y vincula Google allí.',
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
        'auth.email_placeholder': 'Ingresa tu correo electrónico',
        'auth.send_magic_link': 'Enviar enlace mágico',
        'auth.or': 'O',
        'auth.check_email': 'Revisa tu correo para el enlace de inicio de sesión',
        'auth.magic_link_sent': '¡Enlace mágico enviado!',
        // Onboarding
        'onboarding.choose_language': 'Elige tu idioma',
        'onboarding.hero_title': 'Efecto Abundancia',
        'onboarding.hero_subtitle': 'Camino hacia la abundancia, libertad y autorrealización',
        'onboarding.hero_description': 'Vivir en abundancia no es un sueño, sino el estado natural de una persona cuando está en armonía consigo misma, con los demás y con el mundo.',
        'onboarding.program_title': 'Programa de Crecimiento',
        'onboarding.program_subtitle': 'De cero a tu primer $1,000,000 en el nivel 20.',
        'onboarding.program_description': 'Programa paso a paso, acciones claras, apoyo y todo lo que necesitas. Cada nivel trae nuevos ingresos y nuevas oportunidades. ¡Descubre qué tan rápido puedes alcanzar tus metas con el programa de abundancia!',
        'onboarding.challenges_title': 'Completa Desafíos y Obtén Recompensas',
        'onboarding.challenges_description': 'El ingreso siempre está a mano - independiente, flexible. Tú decides cuándo y cuánto ganar. Niveles más altos - más ingresos e influencia.',
        'onboarding.wishes_title': 'Cumplimiento de Deseos',
        'onboarding.wishes_description': 'Con tecnología moderna, los deseos se cumplen docenas de veces más fácil y rápido. Aprende historias de otros - ¡tu vida de sueños ya está esperando!',
        'onboarding.ai_core_title': 'Núcleo IA',
        'onboarding.ai_core_description': 'Capital no transferible que está garantizado para generar ingresos diariamente. Crecimiento base: +26% por año, x2 en 3 años, x10 en 10 años - incluso sin esfuerzo. La IA es tu organizador de abundancia.',
        'onboarding.success_title': 'Historias de Éxito y Mentor IA',
        'onboarding.success_description': 'Aprende cómo otros alcanzaron tus objetivos. Aprende mejores prácticas, aumenta ingresos. El asistente de IA se encarga de la rutina y ayuda a entender todo.',
        'onboarding.pay_first_title': 'Págate Primero',
        'onboarding.pay_first_description': 'Al comprar - conviértete en beneficiario y participa en los ingresos del negocio. No gastes dinero irreversiblemente: invierte para que regresen y se multipliquen.',
        'onboarding.values_title': 'Nuestros Valores',
        'onboarding.values_description': 'Independencia, seguridad, sostenibilidad. Construimos una sociedad de personas sostenibles que no dañan al mundo y entre sí por dinero o poder. Cuando un deseo se cumple - todo el mundo crece.',
        'onboarding.learning_title': 'Aprender y Ganar Más',
        'onboarding.learning_description': 'Accede a contenido educativo exclusivo, estrategias e ideas para maximizar tu potencial de ganancias y crecimiento personal.',
        'onboarding.business_title': 'Construye tu Negocio',
        'onboarding.business_description': 'Desarrolla habilidades de emprendimiento, crea múltiples fuentes de ingresos y construye riqueza sostenible para el éxito a largo plazo.',
        'onboarding.cta_title': 'Únete Hoy',
        'onboarding.cta_description': '¡Crea tu tablero de deseos y comienza tu camino hacia la abundancia!',
        'onboarding.get_started': 'Comenzar',
    },
    hi: {
        // Goals
        'goals.title': 'मेरे लक्ष्य',
        'goals.goal': 'लक्ष्य',
        'goals.add_wish': 'इच्छा जोड़ें',
        'goals.edit_wish': 'इच्छा संपादित करें',
        'goals.wish_image': 'इच्छा छवि',
        'goals.wish_title': 'शीर्षक',
        'goals.wish_description': 'विवरण',
        'goals.cost_label': 'लागत $',
        'goals.level_label': 'स्तर',
        'goals.cost_enter_valid': 'पहले मान्य लागत दर्ज करें',
        'goals.level_thresholds_not_available': 'स्तर सीमाएँ उपलब्ध नहीं हैं',
        'goals.please_log_in': 'इच्छा जोड़ने के लिए कृपया लॉग इन करें',
        'goals.please_enter_title': 'कृपया इच्छा शीर्षक दर्ज करें',
        'goals.image_failed': 'छवि संसाधित करने में विफल',
        'goals.please_select_image': 'कृपया एक छवि फ़ाइल चुनें',
        'goals.image_url_tab': 'URL',
        'goals.image_upload_tab': 'अपलोड करें',
        'goals.pinterest_link': 'Pinterest',
        'goals.enter_image_url': 'छवि URL दर्ज करें',
        'goals.choose_image': 'छवि चुनें',
        'goals.title_placeholder': 'आप क्या प्राप्त करना चाहते हैं?',
        'goals.description_placeholder': 'अपनी इच्छा का वर्णन करें...',
        'goals.cost_placeholder': 'उदा. $100',
        'goals.level_placeholder': 'ऑटो या मैनुअल',
        'goals.cost_calculator_title': 'जल्द आ रहा है',
        'goals.calculate_level_from_cost': 'लागत से स्तर की गणना करें',
        'goals.save_wish': 'इच्छा सहेजें',
        'goals.update_wish': 'इच्छा अपडेट करें',
        'goals.saving_wish': 'सहेजा जा रहा है...',
        'goals.image_preview': 'छवि पूर्वावलोकन',
        // Challenges
        'challenges.title': 'चुनौतियाँ',
        'challenges.page_title': 'चुनौतियाँ',
        'challenges.no_active': 'अभी तक कोई सक्रिय चुनौती नहीं।',
        'challenges.available': 'उपलब्ध चुनौतियाँ',
        'challenges.accepted': 'स्वीकृत चुनौतियाँ',
        'challenges.completed': 'पूर्ण चुनौतियाँ',
        'challenges.join': 'जुड़ें',
        'challenges.check': 'जाँचें',
        'challenges.checking': 'जाँच हो रही है...',
        'challenges.no_challenges_yet': 'अभी तक कोई चुनौति नहीं',
        'challenges.completed_title': 'चुनौती पूर्ण!',
        'challenges.your_reward': 'आपका इनाम:',
        'challenges.great': 'शानदार!',
        // AI
        'ai.title': 'AI सहायक',
        'ai.coming_soon': 'AI स्क्वाड जल्द ही आ रहा है।',
        // Wallet
        'wallet.title': 'वॉलेट',
        'wallet.wallet_balance': 'वॉलेट बैलेंस',
        'wallet.core_balance': 'कोर बैलेंस',
        'wallet.top_up': 'टॉप अप',
        'wallet.transfer_to_core': 'कोर में',
        'wallet.send': 'भेजें',
        'wallet.receive': 'प्राप्त करें',
        'wallet.daily_income': 'दैनिक आय',
        'wallet.reinvest': 'पुनर्निवेश %',
        'wallet.level': 'स्तर',
        'wallet.core_growth_calculator': 'कोर वृद्धि कैलकुलेटर',
        'wallet.time_to_target': 'लक्ष्य तक समय',
        'wallet.start_core': 'प्रारंभिक कोर',
        'wallet.daily_rewards': 'दैनिक पुरस्कार',
        'wallet.years': 'वर्ष',
        'wallet.future_core': 'भविष्य कोर',
        'wallet.target_amount': 'लक्ष्य कोर राशि',
        'wallet.calculate': 'गणना करें',
        'wallet.estimated_time': 'लक्ष्य तक पहुंचने का अनुमानित समय',
        'wallet.target_date': 'लक्ष्य तिथि',
        'wallet.transfer_from_wallet': 'वॉलेट से स्थानांतरण',
        'wallet.core_history': 'कोर इतिहास',
        'wallet.loading_history': 'इतिहास लोड हो रहा है...',
        'wallet.no_operations': 'अभी तक कोई ऑपरेशन नहीं',
        'wallet.interest_earned': 'अर्जित ब्याज',
        'wallet.transfer': 'स्थानांतरण',
        'wallet.reinvest_op': 'पुनर्निवेश',
        'wallet.operation': 'ऑपरेशन',
        // Profile
        'profile.title': 'प्रोफ़ाइल',
        'profile.language': 'भाषा',
        'profile.level': 'स्तर',
        'profile.username': 'यूज़रनेम',
        'profile.telegram_id': 'Telegram ID',
        'profile.reinvest': 'पुनर्निवेश',
        'profile.linked_accounts': 'लिंक किए गए खाते',
        'profile.link_account': 'लिंक करें',
        'profile.linked': 'लिंक किया गया',
        'profile.not_linked': 'लिंक नहीं किया गया',
        'profile.google_telegram_error': 'Telegram में Google लिंकिंग समर्थित नहीं है। कृपया पहले ईमेल लिंक करें, ब्राउज़र में ऐप खोलें, और वहां Google लिंक करें।',
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
        'auth.email_placeholder': 'अपना ईमेल दर्ज करें',
        'auth.send_magic_link': 'मैजिक लिंक भेजें',
        'auth.or': 'या',
        'auth.check_email': 'लॉगिन लिंक के लिए अपना ईमेल चेक करें',
        'auth.magic_link_sent': 'मैजिक लिंक भेजा गया!',
        // Onboarding
        'onboarding.choose_language': 'अपनी भाषा चुनें',
        'onboarding.hero_title': 'अबंडेंस इफेक्ट',
        'onboarding.hero_subtitle': 'अबंडेंस, स्वतंत्रता और आत्म-साक्षात्कार की यात्रा',
        'onboarding.hero_description': 'प्रचुरता में जीवन एक सपना नहीं है, बल्कि व्यक्ति की स्वाभाविक स्थिति है जब वह स्वयं, दूसरों और दुनिया के साथ सामंजस्य में होता है।',
        'onboarding.program_title': 'विकास कार्यक्रम',
        'onboarding.program_subtitle': 'शून्य से स्तर 20 पर अपने पहले $1,000,000 तक।',
        'onboarding.program_description': 'चरण-दर-चरण कार्यक्रम, स्पष्ट कार्य, सहायता और जो कुछ भी आपको चाहिए। प्रत्येक स्तर नई आय और नए अवसर लाता है। जानें कि आप प्रचुरता कार्यक्रम के साथ अपने लक्ष्यों को कितनी जल्दी प्राप्त कर सकते हैं!',
        'onboarding.challenges_title': 'चुनौतियाँ पूरी करें और पुरस्कार पाएँ',
        'onboarding.challenges_description': 'आय हमेशा हाथ में रहती है - स्वतंत्र, लचीला। आप तय करते हैं कि कब और कितनी कमाई करनी है। उच्च स्तर - अधिक आय और प्रभाव।',
        'onboarding.wishes_title': 'इच्छा पूर्ति',
        'onboarding.wishes_description': 'आधुनिक तकनीक के साथ, इच्छाएँ दर्जों गुना आसान और तेज़ पूरी होती हैं। दूसरों की कहानियाँ सीखें - आपका सपनों का जीवन पहले से ही इंतज़ार कर रहा है!',
        'onboarding.ai_core_title': 'AI कोर',
        'onboarding.ai_core_description': 'अहस्तांतरणीय पूंजी जो दैनिक आय उत्पन्न करने की गारंटी देती है। बेसिक वृद्धि: प्रति वर्ष +26%, 3 साल में x2, 10 साल में x10 - बिना कोई प्रयास के। AI आपका अबंडेंस आयोजक है।',
        'onboarding.success_title': 'सफलता की कहानियाँ और AI मेंटर',
        'onboarding.success_description': 'जानें कि दूसरों ने आपके लक्ष्यों को कैसे हासिल किया। सर्वोत्तम प्रथाओं को सीखें, आय बढ़ाएँ। AI सहायक दिनचर्या का ख्याल रखता है और सब कुछ समझने में मदद करता है।',
        'onboarding.pay_first_title': 'पहले खुद को भुगतान करें',
        'onboarding.pay_first_description': 'खरीदारी करते समय - एक लाभार्थी बनें और व्यवसाय की आय में भाग लें। पैसा अपरिवर्तनीय रूप से खर्च न करें: निवेश करें ताकि वे वापस आएं और बढ़ें।',
        'onboarding.values_title': 'हमारे मूल्य',
        'onboarding.values_description': 'स्वतंत्रता, सुरक्षा, स्थिरता। हम स्थिर लोगों का समाज बनाते हैं जो पैसे या शक्ति के लिए दुनिया और एक-दूसरे को नुकसान नहीं पहुँचाते। जब एक इच्छा पूरी होती है - पूरी दुनिया बढ़ती है।',
        'onboarding.learning_title': 'सीखना और अधिक कमाना',
        'onboarding.learning_description': 'अपनी कमाई क्षमता और व्यक्तिगत विकास को अधिकतम करने के लिए विशेष शैक्षणिक सामग्री, रणनीतियाँ और अंतर्दृष्टि तक पहुँचें।',
        'onboarding.business_title': 'अपना व्यवसाय बनाएं',
        'onboarding.business_description': 'उद्यमिता कौशल विकसित करें, कई आय स्रोत बनाएं, और दीर्घकालिक सफलता के लिए टिकाऊ संपत्ति का निर्माण करें।',
        'onboarding.cta_title': 'आज ही शामिल हों',
        'onboarding.cta_description': 'अपना इच्छा बोर्ड बनाएं और अबंडेंस की यात्रा शुरू करें!',
        'onboarding.get_started': 'शुरू करें',
    },
    ar: {
        // Goals
        'goals.title': 'أهدافي',
        'goals.goal': 'هدف',
        'goals.add_wish': 'أضف أمنية',
        // Challenges
        'challenges.title': 'التحديات',
        'challenges.page_title': 'التحديات',
        'challenges.no_active': 'لا توجد تحديات نشطة حتى الآن.',
        'challenges.available': 'التحديات المتاحة',
        'challenges.accepted': 'التحديات المقبولة',
        'challenges.completed': 'التحديات المكتملة',
        'challenges.join': 'انضم',
        'challenges.check': 'تحقق',
        'challenges.checking': 'جار التحقق...',
        'challenges.no_challenges_yet': 'لا توجد تحديات حتى الآن',
        'challenges.completed_title': 'تم إكمال التحدي!',
        'challenges.your_reward': 'مكافأتك:',
        'challenges.great': 'ممتاز!',
        // AI
        'ai.title': 'مساعد الذكاء الاصطناعي',
        'ai.coming_soon': 'فريق الذكاء الاصطناعي قريباً.',
        // Wallet
        'wallet.title': 'المحفظة',
        'wallet.wallet_balance': 'رصيد المحفظة',
        'wallet.core_balance': 'رصيد النواة',
        'wallet.top_up': 'إعادة الشحن',
        'wallet.transfer_to_core': 'إلى النواة',
        'wallet.send': 'إرسال',
        'wallet.receive': 'استقبال',
        'wallet.daily_income': 'الدخل اليومي',
        'wallet.reinvest': 'إعادة الاستثمار %',
        'wallet.level': 'المستوى',
        'wallet.core_growth_calculator': 'حاسبة نمو النواة',
        'wallet.time_to_target': 'الوقت حتى الهدف',
        'wallet.start_core': 'النواة الأولية',
        'wallet.daily_rewards': 'المكافآت اليومية',
        'wallet.years': 'سنوات',
        'wallet.future_core': 'النواة المستقبلية',
        'wallet.target_amount': 'مبلغ النواة المستهدف',
        'wallet.calculate': 'احسب',
        'wallet.estimated_time': 'الوقت المقدر للوصول إلى الهدف',
        'wallet.target_date': 'تاريخ الهدف',
        'wallet.transfer_from_wallet': 'تحويل من المحفظة',
        'wallet.core_history': 'تاريخ النواة',
        'wallet.loading_history': 'جاري تحميل التاريخ...',
        'wallet.no_operations': 'لا توجد عمليات بعد',
        'wallet.interest_earned': 'الفائدة المكتسبة',
        'wallet.transfer': 'تحويل',
        'wallet.reinvest_op': 'إعادة استثمار',
        'wallet.operation': 'عملية',
        // Profile
        'profile.title': 'الملف الشخصي',
        'profile.language': 'لغة',
        'profile.level': 'المستوى',
        'profile.username': 'اسم المستخدم',
        'profile.telegram_id': 'معرف Telegram',
        'profile.reinvest': 'إعادة الاستثمار',
        'profile.linked_accounts': 'الحسابات المرتبطة',
        'profile.link_account': 'ربط',
        'profile.linked': 'مرتبط',
        'profile.not_linked': 'غير مرتبط',
        'profile.google_telegram_error': 'ربط Google غير مدعوم في Telegram. يرجى ربط البريد الإلكتروني أولاً، ثم فتح التطبيق في المتصفح وربط Google هناك.',
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
        // Levels
        'level.level_up_title': 'ترقية المستوى!',
        'level.congratulations': 'تهانينا! لقد وصلت إلى مستوى جديد!',
        'level.previous': 'السابق',
        'level.new': 'مستوى جديد',
        'level.unlock_message': 'المستوى الجديد يجلب ميزات إضافية ومكافآت!',
        'level.continue': 'استمر في المغامرة!',
        // Auth
        'auth.login': 'تسجيل الدخول',
        'auth.logout': 'تسجيل الخروج',
        'auth.welcome_subtitle': 'سجل الدخول لبدء رحلتك',
        'auth.google': 'تواصل مع Google',
        'auth.telegram': 'تواصل مع Telegram',
        'auth.telegram_mini_app': 'افتح تطبيق Telegram المصغر',
        'auth.apple': 'تواصل مع Apple',
        'auth.email_placeholder': 'أدخل بريدك الإلكتروني',
        'auth.send_magic_link': 'إرسال الرابط السحري',
        'auth.or': 'أو',
        'auth.check_email': 'تحقق من بريدك الإلكتروني للحصول على رابط تسجيل الدخول',
        'auth.magic_link_sent': 'تم إرسال الرابط السحري!',
        // Onboarding
        'onboarding.choose_language': 'اختر لغتك',
        'onboarding.hero_title': 'تأثير الوفرة',
        'onboarding.hero_subtitle': 'طريق إلى الوفرة والحرية وتحقيق الذات',
        'onboarding.hero_description': 'العيش في وفرة ليس حلماً، بل هو الحالة الطبيعية للإنسان عندما يكون في انسجام مع نفسه والآخرين والعالم.',
        'onboarding.program_title': 'برنامج النمو',
        'onboarding.program_subtitle': 'من الصفر إلى أول مليون دولار في المستوى 20.',
        'onboarding.program_description': 'برنامج خطوة بخطوة، إجراءات واضحة، دعم وكل ما تحتاجه. كل مستوى يجلب دخلاً جديداً وفرصاً جديدة. اكتشف مدى سرعة تحقيق أهدافك مع برنامج الوفرة!',
        'onboarding.challenges_title': 'أكمل التحديات واحصل على المكافآت',
        'onboarding.challenges_description': 'الدخل دائماً في متناول يدك - مستقل، مرن. أنت تقرر متى وكم تربح. المستويات الأعلى - دخل أكثر vlتأثير أكثر.',
        'onboarding.wishes_title': 'تحقيق الأمنيات',
        'onboarding.wishes_description': 'مع التكنولوجيا الحديثة، تتحقق الأمنيات بسهولة وسرعة أكبر عشرات المرات. تعلم قصص الآخرين - حياة أحلامك تنتظرك بالفعل!',
        'onboarding.ai_core_title': 'النواة الذكية',
        'onboarding.ai_core_description': 'رأس مال غير قابل للتحويل مضمون لتوليد دخل يومياً. النمو الأساسي: +26% سنوياً، x2 في 3 سنوات، x10 في 10 سنوات - حتى دون جهد. الذكاء الاصطناعي هو منظم وفرك.',
        'onboarding.success_title': 'قصص النجاح والمعلم الذكي',
        'onboarding.success_description': 'تعلم كيف حقق الآخرون أهدافك. تعلم أفضل الممارسات، ازدد الدخل. المساعد الذكي يتولى الروتين ويساعد في فهم كل شيء.',
        'onboarding.pay_first_title': 'ادفع لنفسك أولاً',
        'onboarding.pay_first_description': 'عند الشراء - كن مستفيداً وشارك في دخل الأعمال. لا تنفق المال بشكل لا رجعة فيه: استثمر ليعود ويتضاعف.',
        'onboarding.values_title': 'قيمنا',
        'onboarding.values_description': 'الاستقلالية، الأمان، الاستدامة. نبني مجتمع أشخاص مستدامين لا يضرون العالم وبعضهم البعض من أجل المال أو السلطة. عندما تتحقق أمنية - ينمو العالم كله.',
        'onboarding.learning_title': 'التعلم وكسب المزيد',
        'onboarding.learning_description': 'الوصول إلى محتوى تعليمي حصري واستراتيجيات ورؤى لتعظيم إمكانات ربحك ونموك الشخصي.',
        'onboarding.business_title': 'ابنِ أعمالك',
        'onboarding.business_description': 'طور مهارات ريادة الأعمال وابني مصادر دخل متعددة وابني ثروة مستدامة للنجاح طويل المدى.',
        'onboarding.cta_title': 'انضم اليوم',
        'onboarding.cta_description': 'اصنع لوحة أمنياتك وابدأ رحلتك نحو الوفرة!',
        'onboarding.get_started': 'ابدأ',
    },
    ru: {
        // Goals
        'goals.title': 'Мои Цели',
        'goals.goal': 'Цель',
        'goals.add_wish': 'Добавить Желание',
        'goals.edit_wish': 'Редактировать Желание',
        'goals.wish_image': 'Изображение Желания',
        'goals.wish_title': 'Заголовок',
        'goals.wish_description': 'Описание',
        'goals.cost_label': 'Стоимость $',
        'goals.level_label': 'Уровень',
        'goals.cost_enter_valid': 'Сначала введите корректную стоимость',
        'goals.level_thresholds_not_available': 'Пороги уровня недоступны',
        'goals.please_log_in': 'Пожалуйста, войдите в систему, чтобы добавить желание',
        'goals.please_enter_title': 'Пожалуйста, введите заголовок желания',
        'goals.image_failed': 'Не удалось обработать изображение',
        'goals.please_select_image': 'Пожалуйста, выберите файл изображения',
        'goals.image_url_tab': 'URL',
        'goals.image_upload_tab': 'Загрузить',
        'goals.pinterest_link': 'Pinterest',
        'goals.enter_image_url': 'Введите URL изображения',
        'goals.choose_image': 'Выбрать Изображение',
        'goals.title_placeholder': 'Чего вы хотите достичь?',
        'goals.description_placeholder': 'Опишите ваше желание...',
        'goals.cost_placeholder': 'например, $100',
        'goals.level_placeholder': 'Авто или вручную',
        'goals.cost_calculator_title': 'Скоро',
        'goals.calculate_level_from_cost': 'Рассчитать уровень по стоимости',
        'goals.save_wish': 'Сохранить Желание',
        'goals.update_wish': 'Обновить Желание',
        'goals.saving_wish': 'Сохранение...',
        'goals.image_preview': 'Предпросмотр изображения',
        'goals.recommended_for_you': 'Рекомендовано для Вас',
        'goals.completed_wishes': 'Выполненные Желания',
        // Challenges
        'challenges.title': 'Челленджи',
        'challenges.page_title': 'Челленджи',
        'challenges.no_active': 'Пока нет активных челленджей.',
        'challenges.available': 'Доступные Челленджи',
        'challenges.accepted': 'Принятые Челленджи',
        'challenges.completed': 'Завершенные Челленджи',
        'challenges.join': 'Присоединиться',
        'challenges.check': 'Проверить',
        'challenges.checking': 'Проверка...',
        'challenges.no_challenges_yet': 'Пока нет челленджей',
        'challenges.completed_title': 'Челлендж выполнен!',
        'challenges.your_reward': 'Ваша награда:',
        'challenges.great': 'Отлично!',
        // AI
        'ai.title': 'AI Ассистент',
        'ai.coming_soon': 'AI Команда скоро.',
        // Wallet
        'wallet.title': 'Кошелёк',
        'wallet.wallet_balance': 'Баланс Кошелька',
        'wallet.core_balance': 'Баланс Ядра',
        'wallet.top_up': 'Пополнить',
        'wallet.transfer_to_core': 'В Ядро',
        'wallet.send': 'Отправить',
        'wallet.receive': 'Получить',
        'wallet.daily_income': 'Ежедневный Доход',
        'wallet.reinvest': 'Реинвестиция %',
        'wallet.level': 'Уровень',
        'wallet.core_growth_calculator': 'Калькулятор Роста Ядра',
        'wallet.time_to_target': 'Время до Цели',
        'wallet.start_core': 'Начальное Ядро',
        'wallet.daily_rewards': 'Ежедневные Награды',
        'wallet.years': 'Лет',
        'wallet.future_core': 'Будущее Ядро',
        'wallet.target_amount': 'Целевая Сумма Ядра',
        'wallet.calculate': 'Рассчитать',
        'wallet.estimated_time': 'Ориентировочное время достижения цели',
        'wallet.target_date': 'Дата достижения',
        'wallet.transfer_from_wallet': 'Перевести из Кошелька',
        'wallet.core_history': 'История Ядра',
        'wallet.loading_history': 'Загрузка истории...',
        'wallet.no_operations': 'Пока нет операций',
        'wallet.interest_earned': 'Заработанные Проценты',
        'wallet.transfer': 'Перевод',
        'wallet.reinvest_op': 'Реинвестиция',
        'wallet.operation': 'Операция',
        // Profile
        'profile.title': 'Профиль',
        'profile.language': 'Язык',
        'profile.level': 'Уровень',
        'profile.username': 'Имя пользователя',
        'profile.telegram_id': 'Telegram ID',
        'profile.reinvest': 'Реинвестиция',
        'profile.linked_accounts': 'Привязанные аккаунты',
        'profile.link_account': 'Привязать',
        'profile.linked': 'Привязано',
        'profile.not_linked': 'Не привязано',
        'profile.google_telegram_error': 'Google нельзя привязать внутри Telegram. Привяжите Email, откройте приложение в браузере и привяжите Google там.',
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
        // Levels
        'level.level_up_title': 'Новый уровень!',
        'level.congratulations': 'Поздравляем! Вы достигли нового уровня!',
        'level.previous': 'Предыдущий',
        'level.new': 'Новый уровень',
        'level.unlock_message': 'Новый уровень приносит дополнительные функции и бонусы!',
        'level.continue': 'Продолжайте приключение!',
        // Auth
        'auth.login': 'Войти',
        'auth.logout': 'Выйти',
        'auth.welcome_subtitle': 'Войдите, чтобы начать свой путь',
        'auth.google': 'Войти через Google',
        'auth.telegram': 'Войти через Telegram',
        'auth.telegram_mini_app': 'Открыть Telegram Mini App',
        'auth.apple': 'Войти через Apple',
        'auth.email_placeholder': 'Введите ваш email',
        'auth.send_magic_link': 'Отправить ссылку для входа',
        'auth.or': 'ИЛИ',
        'auth.check_email': 'Проверьте почту для входа',
        'auth.magic_link_sent': 'Ссылка отправлена!',
        // Onboarding
        'onboarding.choose_language': 'Выберите ваш язык',
        'onboarding.hero_title': 'Эффект Изобилия',
        'onboarding.hero_subtitle': 'Путь к изобилию, свободе и самореализации',
        'onboarding.hero_description': 'Жизнь в изобилии — это не мечта, а естественное состояние человека, когда он в гармонии с собой, другими и миром.',
        'onboarding.program_title': 'Программа Роста',
        'onboarding.program_subtitle': 'С нуля до первого $1.000.000 уже на 20 уровне.',
        'onboarding.program_description': 'Пошаговая программа, понятные действия, помощь и всё необходимое. Каждый уровень новый доход и новые возможности. Узнай как быстро можно достичь своих целей с программой изобилия!',
        'onboarding.challenges_title': 'Выполняй Челленджи и Получай Награды',
        'onboarding.challenges_description': 'Доход всегда под рукой — независимый, гибкий. Ты сам решаешь, когда и сколько зарабатывать. Выше уровни — больше доход и влияния.',
        'onboarding.wishes_title': 'Исполнение Желаний',
        'onboarding.wishes_description': 'С современными технологиями желания исполняются в десятки раз проще и быстрее. Узнай истории других — твоя жизнь мечты уже ждёт!',
        'onboarding.ai_core_title': 'AI Ядро',
        'onboarding.ai_core_description': 'Неотчуждаемый капитал, который гарантированно генерирует доход ежедневно. Базовый рост: +26% в год, х2 за 3 года, х10 за 10 лет — даже без усилий. AI — твой организатор изобилия.',
        'onboarding.success_title': 'Истории Успеха и AI-Наставник',
        'onboarding.success_description': 'Узнай, как другие достигли твоих целей. Учись лучшим практикам, повышай доход. AI-ассистент берёт рутину на себя и помогает разобраться во всём.',
        'onboarding.pay_first_title': 'Заплати Сначала Себе',
        'onboarding.pay_first_description': 'Покупая — становись бенефициаром и участвуй в доходе бизнеса. Не трать деньги безвозвратно: инвестируй, чтобы они возвращались и умножались.',
        'onboarding.values_title': 'Наши Ценности',
        'onboarding.values_description': 'Независимость, безопасность, устойчивость. Мы строим общество устойчивых людей, которые не вредят миру и друг другу ради денег или власти. Когда одно желание исполняется — весь мир растёт.',
        'onboarding.learning_title': 'Обучение и Больше Заработка',
        'onboarding.learning_description': 'Получите доступ к эксклюзивному образовательному контенту, стратегиям и инсайтам для максимизации вашего потенциала заработка и личностного роста.',
        'onboarding.business_title': 'Создайте Свой Бизнес',
        'onboarding.business_description': 'Развивайте предпринимательские навыки, создавайте множественные источники дохода и стройте устойчивое богатство для долгосрочного успеха.',
        'onboarding.cta_title': 'Присоединяйся Сегодня',
        'onboarding.cta_description': 'Создай доску желаний и начни путь к изобилию!',
        'onboarding.get_started': 'Начать',
        'onboarding.level_1': 'Уровень 1', // MISSING: all languages
        'onboarding.level_20': 'Уровень 20', // MISSING: all languages
        'onboarding.first_step': 'Первый шаг', // MISSING: all languages
        'onboarding.financial_stress': 'Финансовый стресс', // MISSING: all languages
        'onboarding.freedom_joy': 'Свобода и радость', // MISSING: all languages
        'onboarding.challenges_subtitle': 'Доход всегда под рукой', // MISSING: all languages
        'onboarding.daily_challenges': 'Ежедневные челленджи', // MISSING: all languages
        'onboarding.achievements': 'Достижения', // MISSING: all languages
        'onboarding.rare_rewards': 'Ценные награды', // MISSING: all languages
        'onboarding.streaks': 'Прогресс серий', // MISSING: all languages
        'onboarding.ai_core_subtitle': 'Ежедневный % доход', // MISSING: all languages
        'onboarding.lifelong_income': 'Пожизненный доход', // MISSING: all languages
        'onboarding.always_working': 'Капитал работает всегда', // MISSING: all languages
        'onboarding.annual_growth': 'Гарантированный годовой прирост', // MISSING: all languages
        'onboarding.success_subtitle': 'Следуй за теми кто уже сделал', // MISSING: all languages
        'onboarding.success_stories': 'Истории успеха', // MISSING: all languages
        'onboarding.ai_mentor': 'Ai Наставник', // MISSING: all languages
        'onboarding.wishes_subtitle': 'Жизнь мечты теперь доступна', // MISSING: all languages
        'onboarding.define_dreams': 'Определи свои Желания', // MISSING: all languages
        'onboarding.what_you_want': 'Чего ты действительно хочешь?', // MISSING: all languages
        'onboarding.track_progress': 'Отслежай прогрес', // MISSING: all languages
        'onboarding.track_daily': 'Делай шаг каждый день', // MISSING: all languages
        'onboarding.business_subtitle': 'Система нового поколения', // MISSING: all languages
        'onboarding.business': 'Продажи', // MISSING: all languages
        'onboarding.insights_analytics': 'Клиенты уже ждут', // MISSING: all languages
        'onboarding.automation': 'Автоматизация', // MISSING: all languages
        'onboarding.pay_first_subtitle': 'Каждая покупка - это инвестиция', // MISSING: all languages
        'onboarding.invest_earn_grow': 'Покупка → Участие → Рост',// MISSING: all languages
        'onboarding.values_subtitle': 'Независимость. Безопасность. Устойчивость.', // MISSING: all languages
        'onboarding.value_security': 'Безопасность', // MISSING: all languages
        'onboarding.value_sustainability': 'Устойчивость', // MISSING: all languages
        'onboarding.value_independence': 'Независимость', // MISSING: all languages
        'onboarding.exclusive_content': 'Подробные инструкции', // MISSING: all languages
        'onboarding.proven_strategies': 'Работающие практики', // MISSING: all languages
        'onboarding.expert_insights': 'Реальные данные', // MISSING: all languages
        'onboarding.continue': 'Вперед!', // MISSING: all languages
    },
};
