-- Add preferred_image_model to avatar_settings
ALTER TABLE public.avatar_settings 
ADD COLUMN IF NOT EXISTS preferred_image_model text DEFAULT 'flux';
