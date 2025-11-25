-- Create game_items table to store all game content (achievements, items, books, backgrounds)
create table public.game_items (
  id text primary key,
  type text not null check (type in ('achievement', 'item', 'book', 'base', 'character')),
  title text not null,
  description text,
  image text not null, -- URL or Emoji
  subtitle text, -- For achievements
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.game_items enable row level security;

-- Everyone can read game items (they are public game content)
create policy "Game items are viewable by everyone" on public.game_items for select using (is_active = true);

-- Only admins can modify (you can add admin check later)
-- For now, no insert/update/delete policies = only via service role

-- Create index for faster queries by type
create index game_items_type_idx on public.game_items(type, sort_order);

-- Insert initial data from constants/results.ts
-- Achievements
insert into public.game_items (id, type, title, subtitle, description, image, sort_order) values
  ('ach_1', 'achievement', 'First Step', 'Begin your journey', 'Created your first account.', '🏁', 1),
  ('ach_2', 'achievement', 'Dreamer', 'Add 5 wishes', 'Added 5 wishes to your wishboard.', '💭', 2),
  ('ach_3', 'achievement', 'Go Getter', 'Complete 1 goal', 'Marked a goal as completed.', '🎯', 3),
  ('ach_4', 'achievement', 'Socialite', 'Connect Telegram', 'Linked your Telegram account.', '📱', 4),
  ('ach_5', 'achievement', 'Wealthy Mind', 'Read 1 book', 'Finished reading a book from the library.', '🧠', 5);

-- Inventory Items
insert into public.game_items (id, type, title, description, image, sort_order) values
  ('item_1', 'item', 'Starter Pack', 'Basic supplies for a new journey.', '🎒', 1),
  ('item_2', 'item', 'Map', 'A map of the known world.', '🗺️', 2),
  ('item_3', 'item', 'Compass', 'Always points north.', '🧭', 3),
  ('item_4', 'item', 'Notebook', 'For writing down your thoughts.', '📓', 4);

-- Knowledge Items (Books)
insert into public.game_items (id, type, title, description, image, sort_order) values
  ('book_1', 'book', 'The Alchemist', 'A story about following your dreams.', '📖', 1),
  ('book_2', 'book', 'Atomic Habits', 'Tiny changes, remarkable results.', '📘', 2),
  ('book_3', 'book', 'Rich Dad Poor Dad', 'What the rich teach their kids about money.', '📗', 3);

-- Base Backgrounds
insert into public.game_items (id, type, title, description, image, sort_order) values
  ('base_1', 'base', 'Cozy Room', 'A small but comfortable room.', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2057&auto=format&fit=crop', 1),
  ('base_2', 'base', 'Modern Apartment', 'Sleek and stylish.', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop', 2),
  ('base_3', 'base', 'Penthouse', 'Luxury living at its finest.', 'https://images.unsplash.com/photo-1512918760383-5658fa63a363?q=80&w=2070&auto=format&fit=crop', 3);

-- Character Backgrounds
insert into public.game_items (id, type, title, description, image, sort_order) values
  ('char_1', 'character', 'Casual', 'Ready for a relaxed day.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop', 1),
  ('char_2', 'character', 'Business', 'Dressed for success.', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2190&auto=format&fit=crop', 2),
  ('char_3', 'character', 'Traveler', 'Prepared for adventure.', 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1974&auto=format&fit=crop', 3);
