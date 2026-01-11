-- ============================================================================
-- MIGRATION: Create Avatar/Vision System
-- ============================================================================

-- 1. Create avatar_settings table
CREATE TABLE IF NOT EXISTS public.avatar_settings (
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    base_type text, -- 'man', 'woman', 'professional_man', etc.
    style text DEFAULT 'realistic', -- 'realistic', 'cyberpunk', 'cartoon', etc.
    avatar_photo_url text, -- User's uploaded photo for personalization
    avatar_wallet numeric NOT NULL DEFAULT 0, -- Virtual currency (Real Wallet x 100)
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id)
);

-- Enable RLS
ALTER TABLE public.avatar_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own avatar settings"
    ON public.avatar_settings FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Avatar settings are viewable by everyone"
    ON public.avatar_settings FOR SELECT
    USING (true);

-- 2. Trigger to credit avatar wallet when real wallet balance increases
CREATE OR REPLACE FUNCTION public.on_wallet_increase_credit_avatar()
RETURNS TRIGGER AS $$
DECLARE
    v_diff numeric;
BEGIN
    -- Calculate difference
    v_diff := NEW.wallet_balance - OLD.wallet_balance;
    
    -- Only credit if balance increased
    IF v_diff > 0 THEN
        -- Upsert to ensure record exists (even if with defaults)
        INSERT INTO public.avatar_settings (user_id, avatar_wallet)
        VALUES (NEW.id, v_diff * 100)
        ON CONFLICT (user_id) DO UPDATE
        SET avatar_wallet = public.avatar_settings.avatar_wallet + (v_diff * 100),
            updated_at = now();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_avatar_wallet_credit ON public.users;
CREATE TRIGGER trigger_avatar_wallet_credit
    AFTER UPDATE OF wallet_balance ON public.users
    FOR EACH ROW
    WHEN (NEW.wallet_balance > OLD.wallet_balance)
    EXECUTE FUNCTION public.on_wallet_increase_credit_avatar();

-- 3. Function to spend avatar wallet (virtual currency)
CREATE OR REPLACE FUNCTION public.spend_avatar_wallet(
    p_user_id uuid,
    p_amount numeric
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_balance numeric;
BEGIN
    -- Get current balance
    SELECT avatar_wallet INTO v_current_balance
    FROM public.avatar_settings
    WHERE user_id = p_user_id;
    
    IF v_current_balance IS NULL OR v_current_balance < p_amount THEN
        RETURN false;
    END IF;
    
    -- Deduct
    UPDATE public.avatar_settings
    SET avatar_wallet = avatar_wallet - p_amount,
        updated_at = now()
    WHERE user_id = p_user_id;
    
    RETURN true;
END;
$$;
