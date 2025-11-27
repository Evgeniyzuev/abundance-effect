-- Change referrer_id to uuid if it's not already
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'users'
        AND column_name = 'referrer_id'
        AND data_type != 'uuid'
    ) THEN
        ALTER TABLE public.users
        ALTER COLUMN referrer_id TYPE uuid USING referrer_id::text::uuid;
    END IF;
END $$;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'users_referrer_id_fkey'
        AND table_name = 'users'
    ) THEN
        ALTER TABLE public.users
        ADD CONSTRAINT users_referrer_id_fkey
        FOREIGN KEY (referrer_id)
        REFERENCES public.users(id);
    END IF;
END $$;

-- Update handle_new_user function to include referrer_id and other missing fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, first_name, last_name, avatar_url, username, telegram_id, referrer_id)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'user_name'),
    (new.raw_user_meta_data->>'telegram_id')::bigint,
    CASE 
      WHEN new.raw_user_meta_data->>'referrer_id' IS NOT NULL AND new.raw_user_meta_data->>'referrer_id' != '' 
      THEN (new.raw_user_meta_data->>'referrer_id')::uuid 
      ELSE NULL 
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
