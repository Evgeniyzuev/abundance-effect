-- ============================================================================
-- MIGRATION: Create Invoice and Fulfillment system
-- ============================================================================

-- 1. Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    seller_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount numeric NOT NULL CHECK (amount >= 0),
    title text NOT NULL,
    description text,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'expired')),
    type text NOT NULL DEFAULT 'one_time' CHECK (type IN ('one_time', 'multi_use')),
    payload jsonb DEFAULT '{}'::jsonb, -- Store {itemId: '...', achievementId: '...'}
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at timestamp with time zone,
    PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Sellers can manage their own invoices"
    ON public.invoices FOR ALL
    USING (auth.uid() = seller_id);

CREATE POLICY "Anyone can view an invoice by ID"
    ON public.invoices FOR SELECT
    USING (true);

-- 2. Helper function to grant item to user inventory
CREATE OR REPLACE FUNCTION public.grant_item_to_user(
    p_user_id uuid,
    p_item_id text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Ensure user_results record exists
    INSERT INTO public.user_results (user_id, inventory)
    VALUES (p_user_id, '[]'::jsonb)
    ON CONFLICT (user_id) DO NOTHING;

    -- Update inventory: Add item if not already there or increment? (Usually items are unique id in this system or multiple allowed)
    -- The user_results.inventory expects: Array of {slot: number, itemId: string, count: number}
    -- For simplicity, we add it as a new entry if not exists
    UPDATE public.user_results
    SET inventory = (
        CASE 
            WHEN inventory @> jsonb_build_array(jsonb_build_object('itemId', p_item_id)) 
            THEN (
                SELECT jsonb_agg(
                    CASE 
                        WHEN elem->>'itemId' = p_item_id 
                        THEN jsonb_set(elem, '{count}', ((elem->>'count')::int + 1)::text::jsonb)
                        ELSE elem 
                    END
                )
                FROM jsonb_array_elements(inventory) AS elem
            )
            ELSE inventory || jsonb_build_array(jsonb_build_object('itemId', p_item_id, 'count', 1, 'slot', jsonb_array_length(inventory)))
        END
    ),
    updated_at = now()
    WHERE user_id = p_user_id;
END;
$$;

-- 3. Atomic function to process invoice payment
CREATE OR REPLACE FUNCTION public.complete_invoice_payment(
    p_invoice_id uuid,
    p_buyer_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_invoice RECORD;
    v_buyer_balance numeric;
    v_seller_name text;
    v_buyer_name text;
BEGIN
    -- 1. Get and Lock invoice
    SELECT * INTO v_invoice FROM public.invoices WHERE id = p_invoice_id FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invoice not found';
    END IF;

    IF v_invoice.status != 'pending' THEN
        RAISE EXCEPTION 'Invoice is already processed or cancelled';
    END IF;

    -- 2. Get buyer balance (Locking)
    SELECT wallet_balance INTO v_buyer_balance FROM public.users WHERE id = p_buyer_id FOR UPDATE;
    
    IF v_buyer_balance < v_invoice.amount THEN
        RAISE EXCEPTION 'Insufficient balance';
    END IF;

    -- 3. Perform transfer
    -- Subtract from buyer
    UPDATE public.users 
    SET wallet_balance = wallet_balance - v_invoice.amount 
    WHERE id = p_buyer_id;

    -- Add to seller
    UPDATE public.users 
    SET wallet_balance = wallet_balance + v_invoice.amount 
    WHERE id = v_invoice.seller_id;

    -- 4. Execute fulfillment (Grant item if exists in payload)
    IF v_invoice.payload->>'itemId' IS NOT NULL THEN
        PERFORM public.grant_item_to_user(p_buyer_id, v_invoice.payload->>'itemId');
    END IF;

    -- 5. Update invoice status
    UPDATE public.invoices SET status = 'paid' WHERE id = p_invoice_id;

    -- 6. Log to wallet_operations for both parties
    SELECT COALESCE(TRIM(first_name || ' ' || COALESCE(last_name, '')), username, 'User') INTO v_buyer_name FROM public.users WHERE id = p_buyer_id;
    SELECT COALESCE(TRIM(first_name || ' ' || COALESCE(last_name, '')), username, 'User') INTO v_seller_name FROM public.users WHERE id = v_invoice.seller_id;

    -- For buyer
    INSERT INTO public.wallet_operations (user_id, amount, type, description, status)
    VALUES (p_buyer_id, -v_invoice.amount, 'send', 'Payment for ' || v_invoice.title || ' to ' || v_seller_name, 'completed');

    -- For seller
    INSERT INTO public.wallet_operations (user_id, amount, type, description, status)
    VALUES (v_invoice.seller_id, v_invoice.amount, 'transfer', 'Payment for ' || v_invoice.title || ' from ' || v_buyer_name, 'completed');

END;
$$;
