-- Create users table
create table public.users (
  id uuid references auth.users not null primary key,
  telegram_id bigint,
  username text,
  first_name text,
  last_name text,
  avatar_url text,
  phone_number text,
  wallet_balance numeric default 0,
  aicore_balance numeric default 0,
  level integer default 0,
  reinvest_setup numeric default 100,
  referrer_id bigint,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Policies
create policy "Users can view own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own data" on public.users
  for update using (auth.uid() = id);

create policy "Public profiles are viewable by everyone" on public.users
  for select using (true);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Extract data from raw_user_meta_data (Google OAuth format) or user_metadata (custom auth)
  -- Google format: full_name, avatar_url, user_name
  -- Telegram format: first_name, last_name, username, avatar_url, telegram_id
  insert into public.users (id, telegram_id, username, first_name, last_name, avatar_url)
  values (
    new.id,
    (new.raw_user_meta_data->>'telegram_id')::bigint,
    coalesce(
      new.raw_user_meta_data->>'username',
      new.user_metadata->>'username',
      new.raw_user_meta_data->>'user_name'
    ),
    coalesce(
      new.raw_user_meta_data->>'first_name',
      new.user_metadata->>'first_name',
      new.raw_user_meta_data->>'full_name'
    ),
    coalesce(
      new.raw_user_meta_data->>'last_name',
      new.user_metadata->>'last_name'
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.user_metadata->>'avatar_url'
    )
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
