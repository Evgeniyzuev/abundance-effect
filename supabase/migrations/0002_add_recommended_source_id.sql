alter table public.user_wishes 
add column if not exists recommended_source_id uuid references public.recommended_wishes(id) on delete set null;

-- Update RLS if needed (existing policies should cover the new column, but good to verify)
-- No changes needed for standard CRUD if the user owns the row.
