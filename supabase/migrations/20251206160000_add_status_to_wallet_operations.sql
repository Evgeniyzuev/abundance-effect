-- ============================================================================
-- MIGRATION: Add status field to wallet_operations for pending operations tracking
-- ============================================================================

-- Add status field to wallet_operations table
ALTER TABLE public.wallet_operations 
ADD COLUMN status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed'));

-- Create index for status filtering
CREATE INDEX idx_wallet_operations_status ON public.wallet_operations(status);

-- Update existing records to have 'completed' status (they are already processed)
UPDATE public.wallet_operations SET status = 'completed' WHERE status = 'pending';

-- Add comment for documentation
COMMENT ON COLUMN public.wallet_operations.status IS 'Operation status: pending (awaiting confirmation), completed (successfully processed), failed (transaction failed)';