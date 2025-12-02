-- ============================================================================
-- MIGRATION: Create wallet operations table
-- ============================================================================

-- Create wallet_operations table
CREATE TABLE IF NOT EXISTS public.wallet_operations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL, -- Positive for inflows, negative for outflows
  type text NOT NULL CHECK (type IN ('topup', 'transfer', 'debit', 'send')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  description text, -- Optional description for the operation
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.wallet_operations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their own wallet operations" ON public.wallet_operations;
CREATE POLICY "Users can view their own wallet operations"
  ON public.wallet_operations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own wallet operations" ON public.wallet_operations;
CREATE POLICY "Users can insert their own wallet operations"
  ON public.wallet_operations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_wallet_operations_user_id ON public.wallet_operations(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_operations_created_at ON public.wallet_operations(created_at DESC);
