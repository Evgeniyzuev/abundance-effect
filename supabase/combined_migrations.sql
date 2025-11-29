-- ============================================================================
-- ABUNDANCE EFFECT - COMBINED MIGRATIONS
-- ============================================================================
-- This file combines all migrations from supabase/migrations/
-- Execute this in Supabase Dashboard > SQL Editor
-- Project: jxtlhholfhkdrcfwlywl
-- Generated: 2025-11-27
-- ============================================================================

-- ============================================================================
-- MIGRATION 0000: Init Users Table
-- ============================================================================

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  telegram_id bigint,
  username text,
  first_name text,
  last_name text,
  avatar_url text,
  phone_number text,
  wallet_balance numeric DEFAULT 0,
  aicore_balance numeric DEFAULT 0,
  level integer DEFAULT 0,
  reinvest_setup numeric DEFAULT 100,
  referrer_id bigint,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;
CREATE POLICY "Public profiles are viewable by everyone" ON public.users
  FOR SELECT USING (true);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, first_name, avatar_url, username)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'user_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================================
-- MIGRATION 0001: Create Wishes Tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_wishes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text,
  estimated_cost text,
  difficulty_level integer DEFAULT 1,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.recommended_wishes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  category text,
  estimated_cost text,
  difficulty_level integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

-- RLS policies
ALTER TABLE public.user_wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommended_wishes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own wishes" ON public.user_wishes;
CREATE POLICY "Users can view their own wishes" ON public.user_wishes
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own wishes" ON public.user_wishes;
CREATE POLICY "Users can insert their own wishes" ON public.user_wishes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own wishes" ON public.user_wishes;
CREATE POLICY "Users can update their own wishes" ON public.user_wishes
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own wishes" ON public.user_wishes;
CREATE POLICY "Users can delete their own wishes" ON public.user_wishes
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view recommended wishes" ON public.recommended_wishes;
CREATE POLICY "Anyone can view recommended wishes" ON public.recommended_wishes
  FOR SELECT USING (true);

-- Insert sample recommended wishes
INSERT INTO public.recommended_wishes (title, description, category, image_url, estimated_cost, difficulty_level)
VALUES
  ('Visit Japan', 'Experience the culture, food, and cherry blossoms of Japan.', 'Travel', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop', '$3000', 3),
  ('Learn Spanish', 'Master the Spanish language to communicate with millions.', 'Education', 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1000&auto=format&fit=crop', 'Free', 2),
  ('Run a Marathon', 'Train for and complete a full 42km marathon.', 'Health', 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=1000&auto=format&fit=crop', '$100', 5),
  ('Buy a House', 'Purchase my dream home for my family.', 'Finance', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop', '$500,000', 5),
  ('Learn to Surf', 'Catch the waves and enjoy the ocean.', 'Sports', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1000&auto=format&fit=crop', '$500', 2),
  ('Write a Book', 'Publish my own novel or non-fiction book.', 'Creativity', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1000&auto=format&fit=crop', 'Free', 4)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MIGRATION 0002: Add Recommended Source ID
-- ============================================================================

ALTER TABLE public.user_wishes 
ADD COLUMN IF NOT EXISTS recommended_source_id uuid REFERENCES public.recommended_wishes(id) ON DELETE SET NULL;

-- ============================================================================
-- MIGRATION 0003: Create Notes Tables
-- ============================================================================

-- Create custom_lists table
CREATE TABLE IF NOT EXISTS public.custom_lists (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon text DEFAULT '📝',
  color text DEFAULT '#007AFF',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create user_notes table
CREATE TABLE IF NOT EXISTS public.user_notes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  list_id uuid REFERENCES public.custom_lists(id) ON DELETE SET NULL,
  is_completed boolean DEFAULT false,
  scheduled_date date,
  scheduled_time time,
  tags text,
  priority text DEFAULT 'none',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

-- RLS policies for custom_lists
ALTER TABLE public.custom_lists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own lists" ON public.custom_lists;
CREATE POLICY "Users can view their own lists" ON public.custom_lists
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own lists" ON public.custom_lists;
CREATE POLICY "Users can insert their own lists" ON public.custom_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own lists" ON public.custom_lists;
CREATE POLICY "Users can update their own lists" ON public.custom_lists
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own lists" ON public.custom_lists;
CREATE POLICY "Users can delete their own lists" ON public.custom_lists
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for user_notes
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notes" ON public.user_notes;
CREATE POLICY "Users can view their own notes" ON public.user_notes
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own notes" ON public.user_notes;
CREATE POLICY "Users can insert their own notes" ON public.user_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notes" ON public.user_notes;
CREATE POLICY "Users can update their own notes" ON public.user_notes
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own notes" ON public.user_notes;
CREATE POLICY "Users can delete their own notes" ON public.user_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON public.user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_list_id ON public.user_notes(list_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_scheduled_date ON public.user_notes(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_custom_lists_user_id ON public.custom_lists(user_id);

-- ============================================================================
-- MIGRATION 20240524000000: Create Personal Tasks
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.personal_tasks (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL DEFAULT auth.uid(),
    title text NOT NULL,
    description text NULL,
    type text NOT NULL CHECK (type IN ('one_time', 'streak', 'daily')),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'canceled')),
    streak_goal integer NULL,
    streak_current integer NULL DEFAULT 0,
    progress_percentage integer NULL DEFAULT 0,
    last_completed_at timestamptz NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT personal_tasks_pkey PRIMARY KEY (id),
    CONSTRAINT personal_tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.personal_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.personal_tasks;
CREATE POLICY "Users can view their own tasks"
    ON public.personal_tasks FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own tasks" ON public.personal_tasks;
CREATE POLICY "Users can insert their own tasks"
    ON public.personal_tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own tasks" ON public.personal_tasks;
CREATE POLICY "Users can update their own tasks"
    ON public.personal_tasks FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.personal_tasks;
CREATE POLICY "Users can delete their own tasks"
    ON public.personal_tasks FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    new.updated_at = now();
    RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger
DROP TRIGGER IF EXISTS handle_updated_at ON public.personal_tasks;
CREATE TRIGGER handle_updated_at 
    BEFORE UPDATE ON public.personal_tasks
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- MIGRATION 20240525000000: Add Task Images
-- ============================================================================

-- Add image_url field to personal_tasks
ALTER TABLE public.personal_tasks 
ADD COLUMN IF NOT EXISTS image_url text NULL;

-- Add daily_completions field to track individual day completions
ALTER TABLE public.personal_tasks 
ADD COLUMN IF NOT EXISTS daily_completions jsonb DEFAULT '[]'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN public.personal_tasks.image_url IS 'URL of the task image (can be external URL or local:// reference)';
COMMENT ON COLUMN public.personal_tasks.daily_completions IS 'Array of ISO date strings when task was completed each day';

-- ============================================================================
-- MIGRATION 20250126: Create Level Thresholds
-- ============================================================================

-- Create level_thresholds table
CREATE TABLE IF NOT EXISTS public.level_thresholds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    level INTEGER NOT NULL UNIQUE,
    core_required DECIMAL(20, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.level_thresholds ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read level thresholds
DROP POLICY IF EXISTS "Level thresholds are viewable by everyone" ON public.level_thresholds;
CREATE POLICY "Level thresholds are viewable by everyone"
    ON public.level_thresholds
    FOR SELECT
    USING (true);

-- Insert level thresholds (1-40)
INSERT INTO public.level_thresholds (level, core_required) VALUES
    (1, 2),
    (2, 4),
    (3, 8),
    (4, 16),
    (5, 32),
    (6, 64),
    (7, 128),
    (8, 250),
    (9, 500),
    (10, 1000),
    (11, 2000),
    (12, 4000),
    (13, 8000),
    (14, 16000),
    (15, 32000),
    (16, 64000),
    (17, 128000),
    (18, 250000),
    (19, 500000),
    (20, 1000000),
    (21, 2000000),
    (22, 4000000),
    (23, 8000000),
    (24, 16000000),
    (25, 32000000),
    (26, 64000000),
    (27, 128000000),
    (28, 250000000),
    (29, 500000000),
    (30, 1000000000),
    (31, 2000000000),
    (32, 4000000000),
    (33, 8000000000),
    (34, 16000000000),
    (35, 32000000000),
    (36, 64000000000),
    (37, 128000000000),
    (38, 250000000000),
    (39, 500000000000),
    (40, 1000000000000)
ON CONFLICT (level) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_level_thresholds_core 
    ON public.level_thresholds(core_required);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS update_level_thresholds_updated_at ON public.level_thresholds;
CREATE TRIGGER update_level_thresholds_updated_at 
    BEFORE UPDATE ON public.level_thresholds 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION 20251125171000: Create User Results
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_results (
  user_id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  inventory jsonb DEFAULT '[]'::jsonb, -- Array of {slot: number, itemId: string, count: number}
  knowledge jsonb DEFAULT '[]'::jsonb,
  unlocked_achievements jsonb DEFAULT '[]'::jsonb, -- Array of achievementIds
  selected_base_id text,
  selected_character_id text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own results" ON public.user_results;
CREATE POLICY "Users can view their own results" ON public.user_results FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own results" ON public.user_results;
CREATE POLICY "Users can update their own results" ON public.user_results FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own results" ON public.user_results;
CREATE POLICY "Users can insert their own results" ON public.user_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- MIGRATION 20251125192500: Create Game Items
-- ============================================================================

-- Create game_items table to store all game content (achievements, items, books, backgrounds)
CREATE TABLE IF NOT EXISTS public.game_items (
  id text PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('achievement', 'item', 'book', 'base', 'character')),
  title text NOT NULL,
  description text,
  image text NOT NULL, -- URL or Emoji
  subtitle text, -- For achievements
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.game_items ENABLE ROW LEVEL SECURITY;

-- Everyone can read game items (they are public game content)
DROP POLICY IF EXISTS "Game items are viewable by everyone" ON public.game_items;
CREATE POLICY "Game items are viewable by everyone" ON public.game_items FOR SELECT USING (is_active = true);

-- Create index for faster queries by type
CREATE INDEX IF NOT EXISTS game_items_type_idx ON public.game_items(type, sort_order);

-- Insert initial data from constants/results.ts
-- Achievements
INSERT INTO public.game_items (id, type, title, subtitle, description, image, sort_order) VALUES
  ('ach_1', 'achievement', 'First Step', 'Begin your journey', 'Created your first account.', '🏁', 1),
  ('ach_2', 'achievement', 'Dreamer', 'Add 5 wishes', 'Added 5 wishes to your wishboard.', '💭', 2),
  ('ach_3', 'achievement', 'Go Getter', 'Complete 1 goal', 'Marked a goal as completed.', '🎯', 3),
  ('ach_4', 'achievement', 'Socialite', 'Connect Telegram', 'Linked your Telegram account.', '📱', 4),
  ('ach_5', 'achievement', 'Wealthy Mind', 'Read 1 book', 'Finished reading a book from the library.', '🧠', 5)
ON CONFLICT (id) DO NOTHING;

-- Inventory Items
INSERT INTO public.game_items (id, type, title, description, image, sort_order) VALUES
  ('item_1', 'item', 'Starter Pack', 'Basic supplies for a new journey.', '🎒', 1),
  ('item_2', 'item', 'Map', 'A map of the known world.', '🗺️', 2),
  ('item_3', 'item', 'Compass', 'Always points north.', '🧭', 3),
  ('item_4', 'item', 'Notebook', 'For writing down your thoughts.', '📓', 4)
ON CONFLICT (id) DO NOTHING;

-- Knowledge Items (Books)
INSERT INTO public.game_items (id, type, title, description, image, sort_order) VALUES
  ('book_1', 'book', 'The Alchemist', 'A story about following your dreams.', '📖', 1),
  ('book_2', 'book', 'Atomic Habits', 'Tiny changes, remarkable results.', '📘', 2),
  ('book_3', 'book', 'Rich Dad Poor Dad', 'What the rich teach their kids about money.', '📗', 3)
ON CONFLICT (id) DO NOTHING;

-- Base Backgrounds
INSERT INTO public.game_items (id, type, title, description, image, sort_order) VALUES
  ('base_1', 'base', 'Cozy Room', 'A small but comfortable room.', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2057&auto=format&fit=crop', 1),
  ('base_2', 'base', 'Modern Apartment', 'Sleek and stylish.', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop', 2),
  ('base_3', 'base', 'Penthouse', 'Luxury living at its finest.', 'https://images.unsplash.com/photo-1512918760383-5658fa63a363?q=80&w=2070&auto=format&fit=crop', 3)
ON CONFLICT (id) DO NOTHING;

-- Character Backgrounds
INSERT INTO public.game_items (id, type, title, description, image, sort_order) VALUES
  ('char_1', 'character', 'Casual', 'Ready for a relaxed day.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop', 1),
  ('char_2', 'character', 'Business', 'Dressed for success.', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2190&auto=format&fit=crop', 2),
  ('char_3', 'character', 'Traveler', 'Prepared for adventure.', 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1974&auto=format&fit=crop', 3)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- MIGRATION 20251125225000: Seed Game Items (Update)
-- ============================================================================

INSERT INTO public.game_items (id, type, title, subtitle, description, image, sort_order, is_active)
VALUES
    ('ach_1', 'achievement', 'First Step', 'Begin your journey', 'Created your first account.', '🏁', 1, true),
    ('ach_2', 'achievement', 'Dreamer', 'Add 5 wishes', 'Added 5 wishes to your wishboard.', '💭', 2, true),
    ('ach_3', 'achievement', 'Go Getter', 'Complete 1 goal', 'Marked a goal as completed.', '🎯', 3, true),
    ('ach_4', 'achievement', 'Socialite', 'Connect Telegram', 'Linked your Telegram account.', '📱', 4, true),
    ('ach_5', 'achievement', 'Wealthy Mind', 'Read 1 book', 'Finished reading a book from the library.', '🧠', 5, true),
    ('item_1', 'item', 'Starter Pack', NULL, 'Basic supplies for a new journey.', '🎒', 1, true),
    ('item_2', 'item', 'Map', NULL, 'A map of the known world.', '🗺️', 2, true),
    ('item_3', 'item', 'Compass', NULL, 'Always points north.', '🧭', 3, true),
    ('item_4', 'item', 'Notebook', NULL, 'For writing down your thoughts.', '📓', 4, true),
    ('book_1', 'book', 'The Alchemist', NULL, 'A story about following your dreams.', '📖', 1, true),
    ('book_2', 'book', 'Atomic Habits', NULL, 'Tiny changes, remarkable results.', '📘', 2, true),
    ('book_3', 'book', 'Rich Dad Poor Dad', NULL, 'What the rich teach their kids about money.', '📗', 3, true),
    ('base_1', 'base', 'Cozy Room', NULL, 'A small but comfortable room.', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2057&auto=format&fit=crop', 1, true),
    ('base_2', 'base', 'Modern Apartment', NULL, 'Sleek and stylish.', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop', 2, true),
    ('base_3', 'base', 'Penthouse', NULL, 'Luxury living at its finest.', 'https://images.unsplash.com/photo-1512918760383-5658fa63a363?q=80&w=2070&auto=format&fit=crop', 3, true),
    ('char_1', 'character', 'Casual', NULL, 'Ready for a relaxed day.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop', 1, true),
    ('char_2', 'character', 'Business', NULL, 'Dressed for success.', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2190&auto=format&fit=crop', 2, true),
    ('char_3', 'character', 'Traveler', NULL, 'Prepared for adventure.', 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1974&auto=format&fit=crop', 3, true)
ON CONFLICT (id) DO UPDATE SET
    type = EXCLUDED.type,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active;

-- ============================================================================
-- MIGRATION 20251126000000: Update Referrer ID
-- ============================================================================

-- Change referrer_id to uuid if it's not already
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'users'
        AND column_name = 'referrer_id'
        AND data_type != 'uuid'
    ) THEN
        ALTER TABLE public.users
        ALTER COLUMN referrer_id TYPE uuid USING referrer_id::text::uuid;
    END IF;
END $$;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'users_referrer_id_fkey'
        AND table_name = 'users'
    ) THEN
        ALTER TABLE public.users
        ADD CONSTRAINT users_referrer_id_fkey
        FOREIGN KEY (referrer_id)
        REFERENCES public.users(id);
    END IF;
END $$;

-- Update handle_new_user function to include referrer_id and other missing fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, first_name, last_name, avatar_url, username, telegram_id, referrer_id)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'user_name'),
    (new.raw_user_meta_data->>'telegram_id')::bigint,
    CASE 
      WHEN new.raw_user_meta_data->>'referrer_id' IS NOT NULL AND new.raw_user_meta_data->>'referrer_id' != '' 
      THEN (new.raw_user_meta_data->>'referrer_id')::uuid 
      ELSE NULL 
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- MIGRATION 20251129100000: Create Challenges System
-- ============================================================================

-- Create challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title jsonb NOT NULL DEFAULT '{}'::jsonb, -- Multi-language support
  description jsonb DEFAULT '{}'::jsonb,
  type text NOT NULL CHECK (type IN ('system', 'user_created', 'event', 'tournament')),
  category text, -- health, education, finance, etc.
  reward_core numeric DEFAULT 0,
  reward_items jsonb DEFAULT '[]'::jsonb, -- Array of item references
  max_participants integer DEFAULT 0, -- 0 = unlimited
  current_participants integer DEFAULT 0,
  deadline timestamp with time zone,
  verification_type text NOT NULL DEFAULT 'auto' CHECK (verification_type IN ('auto', 'manual_peer', 'manual_creator')),
  verification_logic jsonb DEFAULT '{}'::jsonb, -- For auto verification rules
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for system challenges
  owner_name text, -- "System" or username for display
  image_url text,
  is_active boolean DEFAULT true,
  priority integer DEFAULT 0, -- For ordering display
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create challenge_participants table
CREATE TABLE IF NOT EXISTS public.challenge_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'abandoned')),
  progress_data jsonb DEFAULT '{}'::jsonb, -- User's progress tracking
  completed_at timestamp with time zone,
  rewards_claimed jsonb DEFAULT '{}'::jsonb, -- What rewards were claimed
  verification_data jsonb DEFAULT '{}'::jsonb, -- Proof/verification data
  PRIMARY KEY (id),
  UNIQUE (challenge_id, user_id) -- User can only join once per challenge
);

-- Create factions table
CREATE TABLE IF NOT EXISTS public.factions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name jsonb NOT NULL DEFAULT '{}'::jsonb,
  description jsonb DEFAULT '{}'::jsonb,
  mission jsonb DEFAULT '{}'::jsonb,
  goals jsonb DEFAULT '{}'::jsonb,
  values jsonb DEFAULT '{}'::jsonb,
  plan jsonb DEFAULT '{}'::jsonb,
  image_url text,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create faction_members table
CREATE TABLE IF NOT EXISTS public.faction_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  faction_id uuid NOT NULL REFERENCES public.factions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('leader', 'co_leader', 'member')),
  joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (faction_id, user_id) -- User can only be in one faction
);

-- Enable RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.factions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faction_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for challenges (public viewing, owner editing)
DROP POLICY IF EXISTS "Everyone can view active challenges" ON public.challenges;
CREATE POLICY "Everyone can view active challenges"
  ON public.challenges FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Users can create challenges" ON public.challenges;
CREATE POLICY "Users can create challenges"
  ON public.challenges FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Owners can update their challenges" ON public.challenges;
CREATE POLICY "Owners can update their challenges"
  ON public.challenges FOR UPDATE
  USING (auth.uid() = owner_id);

-- RLS Policies for challenge_participants
DROP POLICY IF EXISTS "Users can view their own participations" ON public.challenge_participants;
CREATE POLICY "Users can view their own participations"
  ON public.challenge_participants FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can join challenges" ON public.challenge_participants;
CREATE POLICY "Users can join challenges"
  ON public.challenge_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their participations" ON public.challenge_participants;
CREATE POLICY "Users can update their participations"
  ON public.challenge_participants FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for factions
DROP POLICY IF EXISTS "Everyone can view factions" ON public.factions;
CREATE POLICY "Everyone can view factions"
  ON public.factions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create factions" ON public.factions;
CREATE POLICY "Users can create factions"
  ON public.factions FOR INSERT
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Faction leaders can update their factions" ON public.factions;
CREATE POLICY "Faction leaders can update their factions"
  ON public.factions FOR UPDATE
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.faction_members
      WHERE faction_members.faction_id = factions.id
      AND faction_members.user_id = auth.uid()
      AND faction_members.role IN ('leader', 'co_leader')
    )
  );

-- RLS Policies for faction_members
DROP POLICY IF EXISTS "Users can view faction memberships" ON public.faction_members;
CREATE POLICY "Users can view faction memberships"
  ON public.faction_members FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can join factions" ON public.faction_members;
CREATE POLICY "Users can join factions"
  ON public.faction_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members can leave factions" ON public.faction_members;
CREATE POLICY "Members can leave factions"
  ON public.faction_members FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Leaders can manage members" ON public.faction_members;
CREATE POLICY "Leaders can manage members"
  ON public.faction_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.factions f
      WHERE f.id = faction_members.faction_id
      AND (f.created_by = auth.uid() OR
           EXISTS (
             SELECT 1 FROM public.faction_members fm
             WHERE fm.faction_id = f.id
             AND fm.user_id = auth.uid()
             AND fm.role IN ('leader', 'co_leader')
           ))
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_challenges_active ON public.challenges(is_active, priority DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_challenges_type ON public.challenges(type);
CREATE INDEX IF NOT EXISTS idx_challenges_owner ON public.challenges(owner_id);

CREATE INDEX IF NOT EXISTS idx_challenge_participants_user ON public.challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge ON public.challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_status ON public.challenge_participants(status);

CREATE INDEX IF NOT EXISTS idx_faction_members_faction ON public.faction_members(faction_id);
CREATE INDEX IF NOT EXISTS idx_faction_members_user ON public.faction_members(user_id);

-- Insert sample system challenge: "Add one wish to wishboard"
INSERT INTO public.challenges (
  title,
  description,
  type,
  category,
  reward_core,
  verification_type,
  verification_logic,
  owner_name,
  priority
) VALUES (
  '{"en": "Add Your First Wish", "ru": "Добавьте свое первое желание", "zh": "添加您的第一个愿望"}'::jsonb,
  '{"en": "Create your vision board by adding your first wish. What would you like to achieve?", "ru": "Создайте свою доску желаний, добавив первое желание. Чего вы хотите достичь?", "zh": "通过添加第一个愿望来创建您的愿景板。您想要实现什么？"}'::jsonb,
  'system',
  'goal_setting',
  10,
  'auto',
  '{"action": "add_wish", "table": "user_wishes", "user_id_field": "user_id"}'::jsonb,
  'System',
  100
);

-- Add updated_at trigger for challenges
CREATE OR REPLACE FUNCTION public.handle_challenges_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_challenges_updated_at ON public.challenges;
CREATE TRIGGER handle_challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_challenges_updated_at();

-- Add updated_at trigger for factions
CREATE OR REPLACE FUNCTION public.handle_factions_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_factions_updated_at ON public.factions;
CREATE TRIGGER handle_factions_updated_at
  BEFORE UPDATE ON public.factions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_factions_updated_at();

-- ============================================================================
-- END OF MIGRATIONS
-- ============================================================================
