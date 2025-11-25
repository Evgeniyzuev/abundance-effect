-- Add image_url field to personal_tasks
alter table public.personal_tasks 
add column if not exists image_url text null;

-- Add daily_completions field to track individual day completions
alter table public.personal_tasks 
add column if not exists daily_completions jsonb default '[]'::jsonb;

-- Add comments for documentation
comment on column public.personal_tasks.image_url is 'URL of the task image (can be external URL or local:// reference)';
comment on column public.personal_tasks.daily_completions is 'Array of ISO date strings when task was completed each day';
