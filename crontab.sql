-- Manual daily interest cron setup script
-- Run this in Supabase SQL Editor or psql

-- First, try to enable pg_cron (this might fail if not enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the cron function (same as in migration)
CREATE OR REPLACE FUNCTION daily_interest_cron_job()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_record RECORD;
    daily_rate numeric := 0.000633;
    total_income numeric;
    to_core_amount numeric;
    to_wallet_amount numeric;
    processed_count integer := 0;
    total_interest numeric := 0;
BEGIN
    -- Process each user with core balance > 0
    FOR user_record IN
        SELECT id, aicore_balance, wallet_balance, COALESCE(reinvest_setup, 100) as reinvest_percentage
        FROM users
        WHERE aicore_balance > 0
    LOOP
        -- Calculate total daily income
        total_income := user_record.aicore_balance * daily_rate;

        -- Split based on reinvest percentage
        to_core_amount := total_income * (user_record.reinvest_percentage::numeric / 100);
        to_wallet_amount := total_income * ((100 - user_record.reinvest_percentage)::numeric / 100);

        -- Use high precision calculations
        UPDATE users
        SET
            aicore_balance = (aicore_balance + to_core_amount)::numeric(20,10),
            wallet_balance = (wallet_balance + to_wallet_amount)::numeric(20,10)
        WHERE id = user_record.id;

        -- Log the core interest if any
        IF to_core_amount > 0 THEN
            INSERT INTO core_operations (user_id, amount, type)
            VALUES (user_record.id, to_core_amount::numeric(20,10), 'interest');
        END IF;

        -- Log the wallet interest if any
        IF to_wallet_amount > 0 THEN
            INSERT INTO core_operations (user_id, amount, type)
            VALUES (user_record.id, to_wallet_amount::numeric(20,10), 'interest');
        END IF;

        processed_count := processed_count + 1;
        total_interest := total_interest + total_income;
    END LOOP;

    -- Log the cron job execution
    RAISE NOTICE 'Daily interest cron job completed. Processed: %, Total interest: %', processed_count, total_interest::numeric(20,10);
END;
$$;

-- Uncomment the cron.schedule line below if pg_cron is available
-- SELECT cron.schedule(
--     'daily-interest-cron',
--     '0 0 * * *', -- Daily at midnight UTC
--     'SELECT daily_interest_cron_job();'
-- );

-- Check if pg_cron is working: SELECT * FROM cron.job;

-- To test the function manually: SELECT daily_interest_cron_job();

