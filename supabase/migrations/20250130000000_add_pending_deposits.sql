-- ============================================================================
-- MIGRATION: Add pending_deposits table for secure deposit processing
-- ============================================================================

-- Table to track pending TON deposits that need blockchain confirmation
CREATE TABLE IF NOT EXISTS public.pending_deposits (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL UNIQUE,
  amount_usd DECIMAL(10,2) NOT NULL CHECK (amount_usd > 0),
  sender_address TEXT NOT NULL, -- TON wallet address of the sender
  expected_ton_value BIGINT NOT NULL CHECK (expected_ton_value > 0), -- in nanotons
  processed_transaction_hash TEXT UNIQUE, -- filled when deposit is confirmed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_pending_user ON pending_deposits(user_id);
CREATE INDEX idx_pending_sender_value ON pending_deposits(sender_address, expected_ton_value);
CREATE INDEX idx_pending_unprocessed ON pending_deposits(processed_transaction_hash) WHERE processed_transaction_hash IS NULL;

-- Enable RLS
ALTER TABLE public.pending_deposits ENABLE ROW LEVEL SECURITY;

-- Users can only access their own pending deposits
CREATE POLICY "Users can view own pending deposits"
ON public.pending_deposits
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own pending deposits"
ON public.pending_deposits
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());
