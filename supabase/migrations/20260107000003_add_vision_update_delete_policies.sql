-- ============================================================================
-- MIGRATION: Add UPDATE and DELETE policies for avatar_visions
-- ============================================================================

-- Add UPDATE policy
CREATE POLICY "Users can update their own visions"
    ON public.avatar_visions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Add DELETE policy
CREATE POLICY "Users can delete their own visions"
    ON public.avatar_visions FOR DELETE
    USING (auth.uid() = user_id);
