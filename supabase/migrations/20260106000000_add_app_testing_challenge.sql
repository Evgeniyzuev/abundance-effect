-- ============================================================================
-- MIGRATION: Add App Testing Challenge & Reviews Table
-- ============================================================================

-- Create app_reviews table
CREATE TABLE IF NOT EXISTS public.app_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tested_functions text NOT NULL,
  errors_found text,
  suggestions text,
  ai_thoughts text,
  personal_usage_needs text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.app_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Everyone can view public reviews" ON public.app_reviews;
CREATE POLICY "Everyone can view public reviews"
  ON public.app_reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.app_reviews;
CREATE POLICY "Users can insert their own reviews"
  ON public.app_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Insert system challenge: "Testing Application Functions"
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.challenges
        WHERE verification_logic = 'app_testing'
    ) THEN
      INSERT INTO public.challenges (
        title,
        description,
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
        '{"en": "App Testing", "ru": "Тестирование приложения"}'::jsonb,
        '{"en": "Explore all tabs and write a detailed review to help us improve.", "ru": "Прокликайте все вкладки и напишите развернутый отзыв о приложении."}'::jsonb,
        'system',
        'quality_assurance',
        1,
        '"5$"'::jsonb,
        'auto',
        'app_testing',
        'System',
        'https://i.pinimg.com/736x/8a/34/4d/8a344d5c90b642337777174696593f66.jpg',
        80
      );
    END IF;
END $$;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_app_reviews_user_id ON public.app_reviews(user_id);
