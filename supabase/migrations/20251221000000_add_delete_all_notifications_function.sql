-- Function to delete all notifications for a user
CREATE OR REPLACE FUNCTION delete_all_notifications(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.notifications
    WHERE user_id = target_user_id;
END;
$$;
