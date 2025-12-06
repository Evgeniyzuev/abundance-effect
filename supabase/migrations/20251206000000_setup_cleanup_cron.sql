-- Setup daily cleanup of old Plisio callbacks
-- This cron job will run every day at 2:00 AM UTC to clean up callbacks older than 7 days

-- Create the cron job using pg_cron extension
SELECT cron.schedule(
  'cleanup-plisio-callbacks',
  '0 2 * * *', -- Every day at 2:00 AM UTC
  $$
  SELECT
    net.http_post(
      url := 'https://njebonpambjndmzpmenk.functions.supabase.co/cleanup-plisio-callbacks',
      headers := jsonb_build_object('Content-Type', 'application/json'),
      body := jsonb_build_object('action', 'cleanup_old_callbacks')
    ) as request_id;
  $$
);

-- Verify the cron job was created
SELECT * FROM cron.job WHERE jobname = 'cleanup-plisio-callbacks';

-- Also create a function to manually trigger cleanup if needed
CREATE OR REPLACE FUNCTION trigger_callback_cleanup()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT
    net.http_post(
      url := 'https://njebonpambjndmzpmenk.functions.supabase.co/cleanup-plisio-callbacks',
      headers := jsonb_build_object('Content-Type', 'application/json'),
      body := jsonb_build_object('action', 'manual_cleanup')
    ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;