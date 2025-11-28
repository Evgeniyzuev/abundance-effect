-- Fix Telegram avatar and data handling
-- This migration updates the trigger function to properly handle both Google OAuth and Telegram auth

-- Drop existing trigger
drop trigger if exists on_auth_user_created on auth.users;

-- Recreate function with better Telegram support
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Extract data from raw_user_meta_data (Google OAuth) or user_metadata (custom auth like Telegram)
  -- Google OAuth format: full_name, avatar_url, user_name
  -- Telegram/Mobile format: first_name, last_name, username, avatar_url, telegram_id

  -- For Google OAuth, we want trigger to work
  -- For Telegram/other, let API handle it (skip if already in user_metadata)
  if new.raw_user_meta_data->>'iss' = 'https://accounts.google.com' then
    -- Google OAuth flow
    insert into public.users (id, username, first_name, avatar_url, email)
    values (
      new.id,
      new.raw_user_meta_data->>'user_name',  -- Google uses 'user_name'
      new.raw_user_meta_data->>'full_name',  -- Google uses 'full_name'
      new.raw_user_meta_data->>'avatar_url',
      new.email
    );
  elsif new.user_metadata->>'telegram_id' is not null then
    -- Telegram/Custom auth - API will handle insertion
    -- Just skip trigger to avoid duplicate insertion
    return new;
  else
    -- Fallback - insert minimal data
    insert into public.users (id, email)
    values (new.id, new.email);
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
