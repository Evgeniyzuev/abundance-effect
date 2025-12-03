-- ============================================================================
-- MIGRATION: Add attempts column to pending_deposits for rate limiting
-- ============================================================================

-- Add attempts counter to prevent infinite reprocessing
ALTER TABLE public.pending_deposits
ADD COLUMN attempts INTEGER DEFAULT 0;

-- Update existing records to have attempts = 0
UPDATE public.pending_deposits
SET attempts = 0
WHERE attempts IS NULL;

-- Add constraint to limit attempts
ALTER TABLE public.pending_deposits
ADD CONSTRAINT attempts_limit CHECK (attempts < 50);

-- Update indexing to include attempts
DROP INDEX IF EXISTS idx_pending_unprocessed;
CREATE INDEX idx_pending_to_process ON pending_deposits(processed_transaction_hash, attempts, created_at)
WHERE processed_transaction_hash IS NULL AND attempts < 50;
