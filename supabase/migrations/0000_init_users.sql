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
  insert into public.users (id, first_name, avatar_url, username)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'user_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
