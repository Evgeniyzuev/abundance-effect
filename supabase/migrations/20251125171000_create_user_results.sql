create table public.user_results (
  user_id uuid references auth.users not null primary key,
  inventory jsonb default '[]'::jsonb, -- Array of {slot: number, itemId: string, count: number}
  knowledge jsonb default '[]'::jsonb,
  unlocked_achievements jsonb default '[]'::jsonb, -- Array of achievementIds
  selected_base_id text,
  selected_character_id text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_results enable row level security;

create policy "Users can view their own results" on public.user_results for select using (auth.uid() = user_id);
create policy "Users can update their own results" on public.user_results for update using (auth.uid() = user_id);
create policy "Users can insert their own results" on public.user_results for insert with check (auth.uid() = user_id);
