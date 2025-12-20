-- Migration: Add "Calculate Time to Goal" Challenge
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.challenges
        WHERE verification_logic = 'calculate_time_to_goal'
    ) THEN
      INSERT INTO public.challenges (
        title,
        description,
        instructions,
        requirements,
        type,
        category,
        level,
        reward_core,
        verification_type,
        verification_logic,
        owner_name,
        image_url,
        priority
      ) VALUES (
        '{"en": "Calculate Time to Goal", "ru": "Рассчитать срок до цели"}'::jsonb,
        '{"en": "Your life tomorrow is the result of your financial goals today. Calculate how soon you will become financially free with the help of AI and the Abundance system. Your future starts with one calculation.", "ru": "Твоя прошлая жизнь была уроком, а будущее — это чистый холст, который ты начинаешь закрашивать золотом прямо сейчас. Рассчитай дату, когда твой капитал начнет работать на тебя 24/7, обеспечивая свободу передвижения, лучшие отели мира и возможность помогать близким. Это не просто цифры, это план твоего триумфа в программе Изобилия."}'::jsonb,
        '{"en": "1. Go to Wallet tab\n2. Open Core section\n3. Enter your target capital amount\n4. Click Calculate button", "ru": "1. Перейдите во вкладку Кошелек\n2. Откройте раздел Ядро\n3. Введите сумму вашего целевого капитала\n4. Нажмите кнопку Рассчитать"}'::jsonb,
        '{"en": "Use the calculator in the Wallet Core section", "ru": "Воспользуйтесь калькулятором в разделе Ядро Кошелька"}'::jsonb,
        'system',
        'finance',
        1,
        '"1$"'::jsonb,
        'auto',
        'calculate_time_to_goal',
        'System',
        'https://i.pinimg.com/736x/8d/f3/d9/8df3d97c385b03517c5b6574f2d7298d.jpg',
        90
      );
    END IF;
END $$;
