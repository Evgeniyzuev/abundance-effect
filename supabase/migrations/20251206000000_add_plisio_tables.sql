-- ============================================================================
-- MIGRATION: Add plisio_invoices and plisio_callbacks tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.plisio_invoices (
  id SERIAL PRIMARY KEY,
  txn_id TEXT,
  order_number TEXT UNIQUE,
  order_name TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount_usd DECIMAL(10,2),
  currency TEXT,
  status TEXT,
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_plisio_order_number ON public.plisio_invoices(order_number);
CREATE INDEX idx_plisio_user ON public.plisio_invoices(user_id);

CREATE TABLE IF NOT EXISTS public.plisio_callbacks (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER REFERENCES public.plisio_invoices(id) ON DELETE SET NULL,
  payload JSONB,
  headers JSONB,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_plisio_callbacks_invoice ON public.plisio_callbacks(invoice_id);

-- Enable RLS
ALTER TABLE public.plisio_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plisio_callbacks ENABLE ROW LEVEL SECURITY;

-- Policies for plisio_invoices
CREATE POLICY "Users can view their own invoices"
  ON public.plisio_invoices
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own invoices"
  ON public.plisio_invoices
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- No public policies for plisio_callbacks (service_role only)

