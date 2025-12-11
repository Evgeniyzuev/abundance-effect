-- Add onboarding knowledge item to game_items table
INSERT INTO public.game_items (id, type, title, description, image, sort_order, is_active)
VALUES 
  ('onboarding_guide', 'book', 'Welcome to Abundance Effect', 'Your complete guide to transforming your financial life. Click to revisit the onboarding experience.', '📚', 99, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;