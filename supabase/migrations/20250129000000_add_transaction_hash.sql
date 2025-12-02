-- ============================================================================
-- MIGRATION: Add transaction_hash column to wallet_operations for duplicate prevention
-- ============================================================================

-- Add transaction_hash column to prevent duplicate operations
ALTER TABLE public.wallet_operations
ADD COLUMN transaction_hash TEXT;

-- Create index for fast lookup and uniqueness
CREATE UNIQUE INDEX idx_wallet_operations_user_hash
ON public.wallet_operations(user_id, transaction_hash)
WHERE transaction_hash IS NOT NULL;
