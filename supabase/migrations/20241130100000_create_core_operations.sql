-- Create core_operations table for logging all core-related operations
CREATE TABLE IF NOT EXISTS public.core_operations (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount numeric NOT NULL, -- Can be negative for debits
    type text NOT NULL CHECK (type IN ('interest', 'transfer', 'reinvest')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT core_operations_pkey PRIMARY KEY (id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS core_operations_user_id_idx ON public.core_operations(user_id);
CREATE INDEX IF NOT EXISTS core_operations_type_idx ON public.core_operations(type);
CREATE INDEX IF NOT EXISTS core_operations_created_at_idx ON public.core_operations(created_at);

-- Enable RLS
ALTER TABLE public.core_operations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own core operations" ON public.core_operations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert core operations" ON public.core_operations
    FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT SELECT, INSERT ON public.core_operations TO authenticated;
GRANT SELECT, INSERT ON public.core_operations TO service_role;
