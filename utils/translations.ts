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
    | 'challenges.completed_icon'
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
    | 'onboarding.program_title'
    | 'onboarding.program_description'
    | 'onboarding.challenges_title'
    | 'onboarding.challenges_description'
    | 'onboarding.wishes_title'
    | 'onboarding.wishes_description'
    | 'onboarding.ai_core_title'
    | 'onboarding.ai_core_description'
    | 'onboarding.learning_title'
    | 'onboarding.learning_description'
    | 'onboarding.business_title'
    | 'onboarding.business_description'
    | 'onboarding.cta_title'
    | 'onboarding.cta_description'
    | 'onboarding.get_started';

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
        'challenges.completed_icon': '✓',
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
        'onboarding.hero_subtitle': 'Journey to Abundance! From 0 to $1M in 20 levels',
        'onboarding.program_title': '20-Level Growth Program',
        'onboarding.program_description': 'Structured progression system with clear milestones. Each level unlocks new features, higher earning potential, and exclusive rewards.',
        'onboarding.challenges_title': 'Challenges & Rewards',
        'onboarding.challenges_description': 'Complete exciting challenges to earn rewards and unlock achievements. Turn your goals into fun, trackable experiences.',
        'onboarding.wishes_title': 'Wish Fulfillment',
        'onboarding.wishes_description': 'Transform your dreams into achievable goals. Set wishes, track progress, and celebrate every milestone on your journey.',
        'onboarding.ai_core_title': 'AI Core - Your Lifelong Partner',
        'onboarding.ai_core_description': 'Non-transferable AI companion that grows with you. Generate lifelong daily income that cannot be taken away from you.',
        'onboarding.learning_title': 'Learning & Earning More',
        'onboarding.learning_description': 'Access exclusive educational content, strategies, and insights to maximize your earning potential and personal growth.',
        'onboarding.business_title': 'Build Your Business',
        'onboarding.business_description': 'Develop entrepreneurship skills, create multiple income streams, and build sustainable wealth for long-term success.',
        'onboarding.cta_title': 'Ready to Start Your Journey?',
        'onboarding.cta_description': 'Join thousands of others on the path to abundance. Your transformation begins now.',
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
        'onboarding.hero_subtitle': '通往丰盛的旅程！从0到100万美元20个等级',
        'onboarding.program_title': '20级成长计划',
        'onboarding.program_description': '结构化的进阶系统，明确的里程碑。每个等级解锁新功能、更高的收入潜力和独家奖励。',
        'onboarding.challenges_title': '挑战与奖励',
        'onboarding.challenges_description': '完成令人兴奋的挑战以获得奖励并解锁成就。将您的目标转化为有趣、可追踪的体验。',
        'onboarding.wishes_title': '愿望实现',
        'onboarding.wishes_description': '将您的梦想转化为可实现的目标。设定愿望、跟踪进度，并庆祝旅程中的每一个里程碑。',
        'onboarding.ai_core_title': 'AI核心 - 您的终身伙伴',
        'onboarding.ai_core_description': '不可转移的AI伴侣，与您共同成长。产生终身每日收入，无法被夺走。',
        'onboarding.learning_title': '学习与赚取更多',
        'onboarding.learning_description': '访问独家教育内容、策略和见解，最大限度地提高您的收入潜力和个人成长。',
        'onboarding.business_title': '建立您的业务',
        'onboarding.business_description': '培养创业技能，创造多重收入来源，建立可持续的长期成功财富。',
        'onboarding.cta_title': '准备好开始您的旅程了吗？',
        'onboarding.cta_description': '加入数千其他人在通往丰盛的道路上。您的转变从现在开始。',
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
        'onboarding.hero_subtitle': '¡Viaje hacia la abundancia! De 0 a $1M en 20 niveles',
        'onboarding.program_title': 'Programa de Crecimiento de 20 Niveles',
        'onboarding.program_description': 'Sistema de progreso estructurado con hitos claros. Cada nivel desbloquea nuevas funciones, mayor potencial de ganancias y recompensas exclusivas.',
        'onboarding.challenges_title': 'Desafíos y Recompensas',
        'onboarding.challenges_description': 'Completa desafíos emocionantes para ganar recompensas y desbloquear logros. Convierte tus objetivos en experiencias divertidas y rastreables.',
        'onboarding.wishes_title': 'Cumplimiento de Deseos',
        'onboarding.wishes_description': 'Transforma tus sueños en objetivos alcanzables. Establece deseos, rastrea el progreso y celebra cada hito en tu viaje.',
        'onboarding.ai_core_title': 'Núcleo IA - Tu Compañero de por Vida',
        'onboarding.ai_core_description': 'Compañero de IA no transferible que crece contigo. Genera ingresos diarios de por vida que no pueden ser quitados.',
        'onboarding.learning_title': 'Aprender y Ganar Más',
        'onboarding.learning_description': 'Accede a contenido educativo exclusivo, estrategias e ideas para maximizar tu potencial de ganancias y crecimiento personal.',
        'onboarding.business_title': 'Construye tu Negocio',
        'onboarding.business_description': 'Desarrolla habilidades de emprendimiento, crea múltiples fuentes de ingresos y construye riqueza sostenible para el éxito a largo plazo.',
        'onboarding.cta_title': '¿Listo para Comenzar tu Viaje?',
        'onboarding.cta_description': 'Únete a miles de otros en el camino hacia la abundancia. Tu transformación comienza ahora.',
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
        'onboarding.hero_subtitle': 'अबंडेंस की यात्रा! 0 से $1M तक 20 स्तरों में',
        'onboarding.program_title': '20-स्तर विकास कार्यक्रम',
        'onboarding.program_description': 'स्पष्ट मील के पत्थर के साथ संरचित प्रगति प्रणाली। हर स्तर नई सुविधाओं, उच्च कमाई क्षमता और विशेष पुरस्कारों को अनलॉक करता है।',
        'onboarding.challenges_title': 'चुनौतियाँ और पुरस्कार',
        'onboarding.challenges_description': 'पुरस्कार अर्जित करने और उपलब्धियाँ अनलॉक करने के लिए रोमांचक चुनौतियाँ पूरी करें। अपने लक्ष्यों को मज़ेदार, ट्रैक करने योग्य अनुभवों में बदलें।',
        'onboarding.wishes_title': 'इच्छा पूर्ति',
        'onboarding.wishes_description': 'अपने सपनों को प्राप्त लक्ष्यों में बदलें। इच्छाएँ निर्धारित करें, प्रगति ट्रैक करें, और अपनी यात्रा के हर मील का जश्न मनाएं।',
        'onboarding.ai_core_title': 'AI कोर - आपका जीवनभर साथी',
        'onboarding.ai_core_description': 'अहस्तांतरणीय AI साथी जो आपके साथ बढ़ता है। जीवनभर की दैनिक आय उत्पन्न करता है जो आपसे छीनी नहीं जा सकती।',
        'onboarding.learning_title': 'सीखना और अधिक कमाना',
        'onboarding.learning_description': 'अपनी कमाई क्षमता और व्यक्तिगत विकास को अधिकतम करने के लिए विशेष शैक्षणिक सामग्री, रणनीतियाँ और अंतर्दृष्टि तक पहुँचें।',
        'onboarding.business_title': 'अपना व्यवसाय बनाएं',
        'onboarding.business_description': 'उद्यमिता कौशल विकसित करें, कई आय स्रोत बनाएं, और दीर्घकालिक सफलता के लिए टिकाऊ संपत्ति का निर्माण करें।',
        'onboarding.cta_title': 'अपनी यात्रा शुरू करने के लिए तैयार हैं?',
        'onboarding.cta_description': 'अबंडेंस के रास्ते पर हजारों अन्य लोगों के साथ जुड़ें। आपका रूपांतरण अभी शुरू होता है।',
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
        'onboarding.hero_subtitle': 'رحلة نحو الوفرة! من 0 إلى 1 مليون دولار في 20 مستوى',
        'onboarding.program_title': 'برنامج النمو 20 مستوى',
        'onboarding.program_description': 'نظام تقدم منظم مع معالم واضحة. كل مستوى يفتح ميزات جديدة وإمكانيات ربح أعلى ومكافآت حصرية.',
        'onboarding.challenges_title': 'التحديات والمكافآت',
        'onboarding.challenges_description': 'أكمل تحديات مثيرة لكسب المكافآت وفتح الإنجازات. حول أهدافك إلى تجارب ممتعة وقابلة للتتبع.',
        'onboarding.wishes_title': 'تحقيق الأمنيات',
        'onboarding.wishes_description': 'حول أحلامك إلى أهداف قابلة للتحقيق. حدد الأمنيات وتتبع التقدم واحتفل بكل معلم في رحلتك.',
        'onboarding.ai_core_title': 'النواة الذكية - شريكك مدى الحياة',
        'onboarding.ai_core_description': 'رفيق ذكي غير قابل للتحويل ينمو معك. يولد دخلاً يومياً مدى الحياة لا يمكن أن يؤخذ منك.',
        'onboarding.learning_title': 'التعلم وكسب المزيد',
        'onboarding.learning_description': 'الوصول إلى محتوى تعليمي حصري واستراتيجيات ورؤى لتعظيم إمكانات ربحك ونموك الشخصي.',
        'onboarding.business_title': 'ابنِ أعمالك',
        'onboarding.business_description': 'طور مهارات ريادة الأعمال وابني مصادر دخل متعددة وابني ثروة مستدامة للنجاح طويل المدى.',
        'onboarding.cta_title': 'مستعد لبدء رحلتك؟',
        'onboarding.cta_description': 'انضم إلى آلاف آخرين في طريق الوفرة. تحويلك يبدأ الآن.',
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
        'onboarding.hero_subtitle': 'Путь к изобилию! От 0 до $1 млн за 20 уровней',
        'onboarding.program_title': 'Программа Роста 20 Уровней',
        'onboarding.program_description': 'Структурированная система прогресса с четкими вехами. Каждый уровень открывает новые функции, более высокий потенциал заработка и эксклюзивные награды.',
        'onboarding.challenges_title': 'Челленджи и Награды',
        'onboarding.challenges_description': 'Выполняйте захватывающие челленджи, чтобы заработать награды и открыть достижения. Превратите свои цели в увлекательный, отслеживаемый опыт.',
        'onboarding.wishes_title': 'Исполнение Желаний',
        'onboarding.wishes_description': 'Превратите свои мечты в достижимые цели. Устанавливайте желания, отслеживайте прогресс и празднуйте каждую веху на своем пути.',
        'onboarding.ai_core_title': 'AI Ядро - Ваш Спутник на Всю Жизнь',
        'onboarding.ai_core_description': 'Непередаваемый AI-компаньон, который растет вместе с вами. Генерирует пожизненный ежедневный доход, который нельзя отнять.',
        'onboarding.learning_title': 'Обучение и Больше Заработка',
        'onboarding.learning_description': 'Получите доступ к эксклюзивному образовательному контенту, стратегиям и инсайтам для максимизации вашего потенциала заработка и личностного роста.',
        'onboarding.business_title': 'Создайте Свой Бизнес',
        'onboarding.business_description': 'Развивайте предпринимательские навыки, создавайте множественные источники дохода и стройте устойчивое богатство для долгосрочного успеха.',
        'onboarding.cta_title': 'Готовы Начать Свой Путь?',
        'onboarding.cta_description': 'Присоединяйтесь к тысячам других на пути к изобилию. Ваша трансформация начинается сейчас.',
        'onboarding.get_started': 'Начать',
    },
};
