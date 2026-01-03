-- ============================================================================
-- MIGRATION: Create P2P Transfers system
-- ============================================================================

-- Create p2p_transfers table
CREATE TABLE IF NOT EXISTS public.p2p_transfers (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    sender_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount numeric NOT NULL CHECK (amount > 0),
    comment text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.p2p_transfers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own sent transfers"
    ON public.p2p_transfers FOR SELECT
    USING (auth.uid() = sender_id);

CREATE POLICY "Users can view their own received transfers"
    ON public.p2p_transfers FOR SELECT
    USING (auth.uid() = receiver_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_p2p_transfers_sender_id ON public.p2p_transfers(sender_id);
CREATE INDEX IF NOT EXISTS idx_p2p_transfers_receiver_id ON public.p2p_transfers(receiver_id);
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON public.users(phone_number) WHERE phone_number IS NOT NULL;

-- Function to execute P2P transfer atomically
CREATE OR REPLACE FUNCTION public.execute_p2p_transfer(
    p_sender_id uuid,
    p_receiver_id uuid,
    p_amount numeric,
    p_comment text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    sender_balance numeric;
    sender_name text;
    receiver_name text;
BEGIN
    -- 0. Fetch names for history
    SELECT COALESCE(TRIM(first_name || ' ' || COALESCE(last_name, '')), username, 'User') INTO sender_name FROM public.users WHERE id = p_sender_id;
    SELECT COALESCE(TRIM(first_name || ' ' || COALESCE(last_name, '')), username, 'User') INTO receiver_name FROM public.users WHERE id = p_receiver_id;

    -- 1. Check sender's balance (Locking for update)
    SELECT wallet_balance INTO sender_balance FROM public.users WHERE id = p_sender_id FOR UPDATE;
    
    IF sender_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient balance';
    END IF;

    -- 2. Subtract from sender
    UPDATE public.users 
    SET wallet_balance = wallet_balance - p_amount 
    WHERE id = p_sender_id;

    -- 3. Add to receiver
    UPDATE public.users 
    SET wallet_balance = wallet_balance + p_amount 
    WHERE id = p_receiver_id;

    -- 4. Record the P2P transfer
    INSERT INTO public.p2p_transfers (sender_id, receiver_id, amount, comment)
    VALUES (p_sender_id, p_receiver_id, p_amount, p_comment);

    -- 5. Add records to wallet_operations for history consistency
    -- Sender side (outflow)
    INSERT INTO public.wallet_operations (user_id, amount, type, description, status)
    VALUES (p_sender_id, -p_amount, 'send', 'To ' || receiver_name || COALESCE(': ' || p_comment, ''), 'completed');

    -- Receiver side (inflow)
    INSERT INTO public.wallet_operations (user_id, amount, type, description, status)
    VALUES (p_receiver_id, p_amount, 'transfer', 'From ' || sender_name || COALESCE(': ' || p_comment, ''), 'completed');

END;
$$;
