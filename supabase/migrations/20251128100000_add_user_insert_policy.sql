-- Add insert policy for users table to allow authenticated users to insert their own row
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
