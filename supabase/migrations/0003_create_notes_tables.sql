-- Create custom_lists table
create table if not exists public.custom_lists (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon text default '📝',
  color text default '#007AFF',
  created_at timestamptz default now(),
  primary key (id)
);

-- Create user_notes table
create table if not exists public.user_notes (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text,
  list_id uuid references public.custom_lists(id) on delete set null,
  is_completed boolean default false,
  scheduled_date date,
  scheduled_time time,
  tags text,
  priority text default 'none',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);

-- RLS policies for custom_lists
alter table public.custom_lists enable row level security;

create policy "Users can view their own lists" on public.custom_lists
  for select using (auth.uid() = user_id);

create policy "Users can insert their own lists" on public.custom_lists
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own lists" on public.custom_lists
  for update using (auth.uid() = user_id);

create policy "Users can delete their own lists" on public.custom_lists
  for delete using (auth.uid() = user_id);

-- RLS policies for user_notes
alter table public.user_notes enable row level security;

create policy "Users can view their own notes" on public.user_notes
  for select using (auth.uid() = user_id);

create policy "Users can insert their own notes" on public.user_notes
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own notes" on public.user_notes
  for update using (auth.uid() = user_id);

create policy "Users can delete their own notes" on public.user_notes
  for delete using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists idx_user_notes_user_id on public.user_notes(user_id);
create index if not exists idx_user_notes_list_id on public.user_notes(list_id);
create index if not exists idx_user_notes_scheduled_date on public.user_notes(scheduled_date);
create index if not exists idx_custom_lists_user_id on public.custom_lists(user_id);
