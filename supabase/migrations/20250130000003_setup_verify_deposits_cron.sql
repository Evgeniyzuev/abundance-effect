-- ============================================================================
-- CRON JOB: Automatic deposit verification every 1 minute
-- ============================================================================

-- Function to safely call verify-deposits edge function
-- Uses net.http_post which is available in Supabase
CREATE OR REPLACE FUNCTION call_verify_deposits_safe()
RETURNS text AS $$
DECLARE
  result_id BIGINT;
  request_url TEXT;
BEGIN
  -- Build the URL dynamically using current settings
  request_url := current_setting('supabase.supabase_url', true) || '/functions/v1/verify-deposits';

  -- Make HTTP POST request using net.http_post (no auth required - function is public for deposit verification)
  SELECT id INTO result_id
  FROM net.http_post(
    url := request_url,
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := '{}'::jsonb
  );

  RAISE LOG 'Verify deposits cron called, request_id: %', result_id;

  RETURN 'Verify deposits function called successfully, request_id: ' || result_id::text;

EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error calling verify deposits function: %', SQLERRM;
  RETURN 'Error calling verify deposits: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule the cron job to run every minute
DO $$
BEGIN
  -- Remove existing job if it exists
  BEGIN
    PERFORM cron.unschedule('verify-pending-deposits');
  EXCEPTION WHEN OTHERS THEN
    -- Job doesn't exist, continue
  END;

  -- Schedule new job to run every minute
  PERFORM cron.schedule(
    'verify-pending-deposits',
    '* * * * *',  -- every minute
    'SELECT call_verify_deposits_safe();'
  );

  RAISE LOG 'Deposit verification cron job scheduled successfully - runs every minute';
END;
$$;
