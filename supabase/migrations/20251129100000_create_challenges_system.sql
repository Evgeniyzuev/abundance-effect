-- ============================================================================
-- MIGRATION: Create Challenges System
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
