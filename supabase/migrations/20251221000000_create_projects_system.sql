-- ============================================================================
-- MIGRATION: Create Projects System
-- ============================================================================

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title jsonb NOT NULL DEFAULT '{}'::jsonb, -- Multi-language support
  description jsonb DEFAULT '{}'::jsonb,
  instructions jsonb DEFAULT '{}'::jsonb,
  requirements jsonb DEFAULT '{}'::jsonb,
  category text, -- business, development, charity, etc.
  level integer DEFAULT 1,
  max_participants integer DEFAULT 0, -- 0 = unlimited
  current_participants integer DEFAULT 0,
  deadline timestamp with time zone,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_name text,
  image_url text,
  is_active boolean DEFAULT true,
  priority integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create project_applications table
CREATE TABLE IF NOT EXISTS public.project_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
  message text, -- Optional message from user when applying
  applied_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (project_id, user_id)
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
DROP POLICY IF EXISTS "Everyone can view active projects" ON public.projects;
CREATE POLICY "Everyone can view active projects"
  ON public.projects FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Users can create projects" ON public.projects;
CREATE POLICY "Users can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Owners can update their projects" ON public.projects;
CREATE POLICY "Owners can update their projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = owner_id);

-- RLS Policies for project_applications
DROP POLICY IF EXISTS "Users can view their own applications" ON public.project_applications;
CREATE POLICY "Users can view their own applications"
  ON public.project_applications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners can view applications for their projects" ON public.project_applications;
CREATE POLICY "Owners can view applications for their projects"
  ON public.project_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_applications.project_id
      AND projects.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can apply for projects" ON public.project_applications;
CREATE POLICY "Users can apply for projects"
  ON public.project_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own application" ON public.project_applications;
CREATE POLICY "Users can update their own application"
  ON public.project_applications FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_active ON public.projects(is_active, priority DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_applications_user ON public.project_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_project_applications_project ON public.project_applications(project_id);

-- Updated at triggers
CREATE OR REPLACE FUNCTION public.handle_projects_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_projects_updated_at();

CREATE TRIGGER handle_project_applications_updated_at
  BEFORE UPDATE ON public.project_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_projects_updated_at();

-- Insert sample projects
INSERT INTO public.projects (title, description, category, level, owner_name, image_url, priority)
VALUES 
(
  '{"en": "Community Content Creator", "ru": "Создатель контента для сообщества"}'::jsonb,
  '{"en": "Help us create engaging content for our social media channels and blog.", "ru": "Помогите нам создавать увлекательный контент для наших соцсетей и блога."}'::jsonb,
  'content', 1, 'System', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072', 10
),
(
  '{"en": "Beta Tester Group", "ru": "Группа бета-тестеров"}'::jsonb,
  '{"en": "Join our elite group of beta testers to try out new features before everyone else.", "ru": "Присоединяйтесь к нашей элитной группе бета-тестеров, чтобы пробовать новые функции раньше всех."}'::jsonb,
  'dev', 2, 'System', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070', 20
);
