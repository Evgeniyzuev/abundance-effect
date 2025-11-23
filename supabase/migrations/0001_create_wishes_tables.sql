create table if not exists public.user_wishes (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  image_url text,
  estimated_cost text,
  difficulty_level integer default 1,
  is_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);

create table if not exists public.recommended_wishes (
  id uuid not null default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  category text,
  estimated_cost text,
  difficulty_level integer default 1,
  created_at timestamptz default now(),
  primary key (id)
);

-- RLS policies
alter table public.user_wishes enable row level security;
alter table public.recommended_wishes enable row level security;

create policy "Users can view their own wishes" on public.user_wishes
  for select using (auth.uid() = user_id);

create policy "Users can insert their own wishes" on public.user_wishes
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own wishes" on public.user_wishes
  for update using (auth.uid() = user_id);

create policy "Users can delete their own wishes" on public.user_wishes
  for delete using (auth.uid() = user_id);

create policy "Anyone can view recommended wishes" on public.recommended_wishes
  for select using (true);

-- Insert some sample recommended wishes
insert into public.recommended_wishes (title, description, category, image_url, estimated_cost, difficulty_level)
values
  ('Visit Japan', 'Experience the culture, food, and cherry blossoms of Japan.', 'Travel', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop', '$3000', 3),
  ('Learn Spanish', 'Master the Spanish language to communicate with millions.', 'Education', 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1000&auto=format&fit=crop', 'Free', 2),
  ('Run a Marathon', 'Train for and complete a full 42km marathon.', 'Health', 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=1000&auto=format&fit=crop', '$100', 5),
  ('Buy a House', 'Purchase my dream home for my family.', 'Finance', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop', '$500,000', 5),
  ('Learn to Surf', 'Catch the waves and enjoy the ocean.', 'Sports', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1000&auto=format&fit=crop', '$500', 2),
  ('Write a Book', 'Publish my own novel or non-fiction book.', 'Creativity', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1000&auto=format&fit=crop', 'Free', 4);
