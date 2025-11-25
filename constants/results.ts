import { GameItem } from '@/types/supabase';

// NOTE: These are fallback constants. Game items are now stored in the database (game_items table).
// Use the Results component which fetches from the database.
// These constants remain for backward compatibility and initial development.

export type ResultType = 'achievement' | 'item' | 'book' | 'base' | 'character';

export const ACHIEVEMENTS: GameItem[] = [
    { id: 'ach_1', type: 'achievement', title: 'First Step', subtitle: 'Begin your journey', description: 'Created your first account.', image: '🏁', sort_order: 1, is_active: true, created_at: '', updated_at: '' },
    { id: 'ach_2', type: 'achievement', title: 'Dreamer', subtitle: 'Add 5 wishes', description: 'Added 5 wishes to your wishboard.', image: '💭', sort_order: 2, is_active: true, created_at: '', updated_at: '' },
    { id: 'ach_3', type: 'achievement', title: 'Go Getter', subtitle: 'Complete 1 goal', description: 'Marked a goal as completed.', image: '🎯', sort_order: 3, is_active: true, created_at: '', updated_at: '' },
    { id: 'ach_4', type: 'achievement', title: 'Socialite', subtitle: 'Connect Telegram', description: 'Linked your Telegram account.', image: '📱', sort_order: 4, is_active: true, created_at: '', updated_at: '' },
    { id: 'ach_5', type: 'achievement', title: 'Wealthy Mind', subtitle: 'Read 1 book', description: 'Finished reading a book from the library.', image: '🧠', sort_order: 5, is_active: true, created_at: '', updated_at: '' },
];

export const INVENTORY_ITEMS: GameItem[] = [
    { id: 'item_1', type: 'item', title: 'Starter Pack', description: 'Basic supplies for a new journey.', image: '🎒', subtitle: null, sort_order: 1, is_active: true, created_at: '', updated_at: '' },
    { id: 'item_2', type: 'item', title: 'Map', description: 'A map of the known world.', image: '🗺️', subtitle: null, sort_order: 2, is_active: true, created_at: '', updated_at: '' },
    { id: 'item_3', type: 'item', title: 'Compass', description: 'Always points north.', image: '🧭', subtitle: null, sort_order: 3, is_active: true, created_at: '', updated_at: '' },
    { id: 'item_4', type: 'item', title: 'Notebook', description: 'For writing down your thoughts.', image: '📓', subtitle: null, sort_order: 4, is_active: true, created_at: '', updated_at: '' },
];

export const KNOWLEDGE_ITEMS: GameItem[] = [
    { id: 'book_1', type: 'book', title: 'The Alchemist', description: 'A story about following your dreams.', image: '📖', subtitle: null, sort_order: 1, is_active: true, created_at: '', updated_at: '' },
    { id: 'book_2', type: 'book', title: 'Atomic Habits', description: 'Tiny changes, remarkable results.', image: '📘', subtitle: null, sort_order: 2, is_active: true, created_at: '', updated_at: '' },
    { id: 'book_3', type: 'book', title: 'Rich Dad Poor Dad', description: 'What the rich teach their kids about money.', image: '📗', subtitle: null, sort_order: 3, is_active: true, created_at: '', updated_at: '' },
];

export const BASE_BACKGROUNDS: GameItem[] = [
    { id: 'base_1', type: 'base', title: 'Cozy Room', description: 'A small but comfortable room.', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2057&auto=format&fit=crop', subtitle: null, sort_order: 1, is_active: true, created_at: '', updated_at: '' },
    { id: 'base_2', type: 'base', title: 'Modern Apartment', description: 'Sleek and stylish.', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop', subtitle: null, sort_order: 2, is_active: true, created_at: '', updated_at: '' },
    { id: 'base_3', type: 'base', title: 'Penthouse', description: 'Luxury living at its finest.', image: 'https://images.unsplash.com/photo-1512918760383-5658fa63a363?q=80&w=2070&auto=format&fit=crop', subtitle: null, sort_order: 3, is_active: true, created_at: '', updated_at: '' },
];

export const CHARACTER_BACKGROUNDS: GameItem[] = [
    { id: 'char_1', type: 'character', title: 'Casual', description: 'Ready for a relaxed day.', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop', subtitle: null, sort_order: 1, is_active: true, created_at: '', updated_at: '' },
    { id: 'char_2', type: 'character', title: 'Business', description: 'Dressed for success.', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2190&auto=format&fit=crop', subtitle: null, sort_order: 2, is_active: true, created_at: '', updated_at: '' },
    { id: 'char_3', type: 'character', title: 'Traveler', description: 'Prepared for adventure.', image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1974&auto=format&fit=crop', subtitle: null, sort_order: 3, is_active: true, created_at: '', updated_at: '' },
];