-- ============================================================================
-- CRON JOB: Set up periodic deposit verification every 1 minute
-- ============================================================================

-- Function to call the verify-deposits edge function
CREATE OR REPLACE FUNCTION call_verify_deposits()
RETURNS text AS $$
DECLARE
  response_status int;
  response_body text;
BEGIN
  -- Make HTTP request to the edge function
  SELECT status, content INTO response_status, response_body
  FROM http((
    'POST',
    'https://' || split_part(current_setting('supabase.supabase_url', '/'), '//', 2) || '.supabase.co/functions/v1/verify-deposits',
    ARRAY[http_header('Authorization', 'Bearer ' || current_setting('supabase.service_role_key'))],
    'application/json',
    '{}'
  ));

  -- Log the result
  RAISE LOG 'Deposit verification cron: status=% body=%', response_status, response_body;

  RETURN 'Called verify-deposits function: ' || response_status::text;

EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in deposit verification cron: %', SQLERRM;
  RETURN 'Error calling verify-deposits: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule the cron job to run every minute
DO $$
BEGIN
  -- Remove existing job if it exists
  -- PERFORM cron.unschedule('verify-pending-deposits');

  -- Schedule new job to run every minute
  PERFORM cron.schedule(
    'verify-pending-deposits',
    '* * * * *',  -- every minute
    'SELECT call_verify_deposits();'
  );

  RAISE LOG 'Deposit verification cron job scheduled successfully';
END;
$$;
