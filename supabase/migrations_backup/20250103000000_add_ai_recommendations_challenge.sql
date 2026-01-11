-- Migration: Add "Ask for AI Recommendations" Challenge
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.challenges
        WHERE verification_logic = 'ai_message_sent'
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
        '{"en": "Ask for AI Recommendations", "zh": "向 AI 寻求建议", "es": "Pide recomendaciones a la IA", "hi": "AI से सिफारिशें मांगें", "ar": "اطلب توصيات من الذكاء الاصطناعي", "ru": "Спросить рекомендации у AI"}'::jsonb,
        '{"en": "Take the first step towards abundance by asking our AI assistant for personalized recommendations. The AI Abundance Coordinator is here to help you grow your core capital and achieve your goals.", "zh": "通过向我们的 AI 助手寻求个性化建议来迈向丰盛的第一步。AI 丰盛协调员在这里帮助您增长核心资本并实现目标。", "es": "Da el primer paso hacia la abundancia pidiendo recomendaciones personalizadas a nuestro asistente de IA. El Coordinador de Abundancia de IA está aquí para ayudarte a hacer crecer tu capital central y lograr tus metas.", "hi": "हमारे AI सहायक से व्यक्तिगत सिफारिशें मांगकर समृद्धि की ओर पहला कदम उठाएं। AI एbundance कोऑर्डिनेटर यहां आपकी कोर कैपिटल बढ़ाने और लक्ष्यों को प्राप्त करने में मदद करने के लिए है।", "ar": "خطوة أولى نحو الوفرة من خلال طلب التوصيات الشخصية من مساعد الذكاء الاصطناعي لدينا. منسق الوفرة AI هنا لمساعدتك في تنمية رأس مالك الأساسي وتحقيق أهدافك.", "ru": "Сделайте первый шаг к изобилию, попросив персональные рекомендации у нашего AI-ассистента. AI Координатор Изобилия здесь, чтобы помочь вам увеличить ваш основной капитал и достичь целей."}'::jsonb,
        '{"en": "1. Go to AI tab\n2. Send a message asking for recommendations\n3. Receive AI response", "zh": "1. 转到 AI 选项卡\n2. 发送消息寻求建议\n3. 接收 AI 回复", "es": "1. Ve a la pestaña IA\n2. Envía un mensaje pidiendo recomendaciones\n3. Recibe respuesta de IA", "hi": "1. AI टैब पर जाएं\n2. सिफारिशें मांगने वाला संदेश भेजें\n3. AI प्रतिक्रिया प्राप्त करें", "ar": "1. انتقل إلى علامة التبويب AI\n2. أرسل رسالة تطلب توصيات\n3. احصل على رد AI", "ru": "1. Перейдите во вкладку AI\n2. Отправьте сообщение с просьбой о рекомендациях\n3. Получите ответ от AI"}'::jsonb,
        '{"en": "Send one message to the AI assistant and receive a response", "zh": "向 AI 助手发送一条消息并收到回复", "es": "Envía un mensaje al asistente de IA y recibe una respuesta", "hi": "AI सहायक को एक संदेश भेजें और प्रतिक्रिया प्राप्त करें", "ar": "أرسل رسالة واحدة إلى مساعد الذكاء الاصطناعي واحصل على رد", "ru": "Отправьте одно сообщение AI-ассистенту и получите ответ"}'::jsonb,
        'system',
        'ai_assistant',
        1,
        '"1$"'::jsonb,
        'auto',
        'ai_message_sent',
        'System',
        'https://i.pinimg.com/736x/4a/8b/2c/4a8b2c7f5e6d9a1b2c3d4e5f6g7h8i9j0k.jpg',
        80
      );
    END IF;
END $$;
