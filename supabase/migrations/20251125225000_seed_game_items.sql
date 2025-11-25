INSERT INTO public.game_items (id, type, title, subtitle, description, image, sort_order, is_active)
VALUES
    ('ach_1', 'achievement', 'First Step', 'Begin your journey', 'Created your first account.', '🏁', 1, true),
    ('ach_2', 'achievement', 'Dreamer', 'Add 5 wishes', 'Added 5 wishes to your wishboard.', '💭', 2, true),
    ('ach_3', 'achievement', 'Go Getter', 'Complete 1 goal', 'Marked a goal as completed.', '🎯', 3, true),
    ('ach_4', 'achievement', 'Socialite', 'Connect Telegram', 'Linked your Telegram account.', '📱', 4, true),
    ('ach_5', 'achievement', 'Wealthy Mind', 'Read 1 book', 'Finished reading a book from the library.', '🧠', 5, true),
    ('item_1', 'item', 'Starter Pack', NULL, 'Basic supplies for a new journey.', '🎒', 1, true),
    ('item_2', 'item', 'Map', NULL, 'A map of the known world.', '🗺️', 2, true),
    ('item_3', 'item', 'Compass', NULL, 'Always points north.', '🧭', 3, true),
    ('item_4', 'item', 'Notebook', NULL, 'For writing down your thoughts.', '📓', 4, true),
    ('book_1', 'book', 'The Alchemist', NULL, 'A story about following your dreams.', '📖', 1, true),
    ('book_2', 'book', 'Atomic Habits', NULL, 'Tiny changes, remarkable results.', '📘', 2, true),
    ('book_3', 'book', 'Rich Dad Poor Dad', NULL, 'What the rich teach their kids about money.', '📗', 3, true),
    ('base_1', 'base', 'Cozy Room', NULL, 'A small but comfortable room.', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2057&auto=format&fit=crop', 1, true),
    ('base_2', 'base', 'Modern Apartment', NULL, 'Sleek and stylish.', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop', 2, true),
    ('base_3', 'base', 'Penthouse', NULL, 'Luxury living at its finest.', 'https://images.unsplash.com/photo-1512918760383-5658fa63a363?q=80&w=2070&auto=format&fit=crop', 3, true),
    ('char_1', 'character', 'Casual', NULL, 'Ready for a relaxed day.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop', 1, true),
    ('char_2', 'character', 'Business', NULL, 'Dressed for success.', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2190&auto=format&fit=crop', 2, true),
    ('char_3', 'character', 'Traveler', NULL, 'Prepared for adventure.', 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1974&auto=format&fit=crop', 3, true)
ON CONFLICT (id) DO UPDATE SET
    type = EXCLUDED.type,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active;
