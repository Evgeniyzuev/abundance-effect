-- Setup daily cleanup of old Plisio callbacks
-- This cron job will run every day at 2:00 AM UTC to clean up callbacks older than 7 days

-- Create a direct SQL function to clean up old callbacks
CREATE OR REPLACE FUNCTION cleanup_old_plisio_callbacks()
RETURNS JSON AS $
DECLARE
  cutoff_date TIMESTAMP WITH TIME ZONE;
  deleted_count INTEGER;
  result JSON;
BEGIN
  -- Calculate date 7 days ago
  cutoff_date := NOW() - INTERVAL '7 days';
  
  -- Delete old callbacks and get count
  WITH deleted_rows AS (
    DELETE FROM plisio_callbacks 
    WHERE received_at < cutoff_date
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted_rows;
  
  -- Return result
  result := json_build_object(
    'success', true,
    'deleted_count', deleted_count,
    'cutoff_date', cutoff_date,
    'message', format('Cleaned up %s callbacks older than %s', deleted_count, cutoff_date)
  );
  
  RAISE NOTICE 'Cleanup completed: %', result;
  
  RETURN result;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated and service role users
GRANT EXECUTE ON FUNCTION cleanup_old_plisio_callbacks() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_plisio_callbacks() TO service_role;

-- Remove existing cron job if it exists
SELECT cron.unschedule('cleanup-plisio-callbacks');

-- Create the cron job using pg_cron extension (updated approach)
SELECT cron.schedule(
  'cleanup-plisio-callbacks',
  '0 2 * * *', -- Every day at 2:00 AM UTC
  'SELECT cleanup_old_plisio_callbacks();'
);

-- Verify the cron job was created
SELECT * FROM cron.job WHERE jobname = 'cleanup-plisio-callbacks';

-- Create a wrapper function for manual triggering
CREATE OR REPLACE FUNCTION trigger_callback_cleanup()
RETURNS JSON AS $
BEGIN
  RETURN cleanup_old_plisio_callbacks();
END;
$ LANGUAGE plpgsql SECURITY DEFINER;