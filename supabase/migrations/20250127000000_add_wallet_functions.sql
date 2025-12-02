-- ============================================================================
-- MIGRATION: Add wallet functions
-- ============================================================================

-- Function to top up user wallet and return new balance
CREATE OR REPLACE FUNCTION public.top_up_wallet(
  p_user_id uuid,
  p_amount numeric
) RETURNS numeric AS $$
DECLARE
  new_balance numeric;
BEGIN
  -- Update wallet_balance for the user
  UPDATE public.users
  SET wallet_balance = wallet_balance + p_amount
  WHERE id = p_user_id;

  -- Get and return the new balance
  SELECT wallet_balance INTO new_balance
  FROM public.users
  WHERE id = p_user_id;

  RETURN new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission if needed (usually handled by RLS)
-- GRANT EXECUTE ON FUNCTION public.top_up_wallet(uuid, numeric) TO authenticated;
