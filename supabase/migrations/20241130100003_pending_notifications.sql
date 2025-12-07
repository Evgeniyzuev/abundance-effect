-- Alternative solution for Telegram notifications using queue table
-- Instead of direct HTTP calls from PostgreSQL, use a queue that Edge Function processes

-- Create pending notifications table
CREATE TABLE IF NOT EXISTS pending_notifications (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    telegram_id bigint NOT NULL,
    message_type text NOT NULL CHECK (message_type IN ('daily_interest')),
    message_data jsonb NOT NULL, -- Contains interest_amount, current_balance, etc.
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    processed_at timestamp with time zone NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    retry_count integer DEFAULT 0,
    error_message text NULL,

    PRIMARY KEY (id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS pending_notifications_user_id_idx ON pending_notifications(user_id);
CREATE INDEX IF NOT EXISTS pending_notifications_status_idx ON pending_notifications(status);
CREATE INDEX IF NOT EXISTS pending_notifications_created_at_idx ON pending_notifications(created_at);

-- Enable RLS
ALTER TABLE pending_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Service role can manage notifications" ON pending_notifications FOR ALL WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON pending_notifications TO service_role;

-- Modified notification function that queues messages instead of sending immediately
CREATE OR REPLACE FUNCTION queue_daily_interest_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_record RECORD;
    interest_amount DECIMAL;
    current_core_balance DECIMAL;
    notification_data jsonb;
BEGIN
    -- Process each user with telegram_id
    FOR user_record IN
        SELECT
            u.id,
            u.telegram_id,
            u.aicore_balance,
            COALESCE(SUM(CASE WHEN co.type = 'interest' AND DATE(co.created_at) = CURRENT_DATE THEN co.amount ELSE 0 END), 0) as todays_interest
        FROM users u
        LEFT JOIN core_operations co ON co.user_id = u.id
        WHERE u.telegram_id IS NOT NULL
        GROUP BY u.id, u.telegram_id, u.aicore_balance
        HAVING COALESCE(SUM(CASE WHEN co.type = 'interest' AND DATE(co.created_at) = CURRENT_DATE THEN co.amount ELSE 0 END), 0) > 0
    LOOP
        -- Get today's interest total for the user
        interest_amount := user_record.todays_interest;
        current_core_balance := user_record.aicore_balance;

        -- Create notification data
        notification_data := jsonb_build_object(
            'interest_amount', interest_amount,
            'current_balance', current_core_balance,
            'date', CURRENT_DATE
        );

        -- Queue the notification
        INSERT INTO pending_notifications (
            user_id,
            telegram_id,
            message_type,
            message_data
        ) VALUES (
            user_record.id,
            user_record.telegram_id,
            'daily_interest',
            notification_data
        );

        RAISE NOTICE 'Queued notification for user % (telegram_id: %)', user_record.id, user_record.telegram_id;
    END LOOP;

    RAISE NOTICE 'Daily interest notifications queued';
END;
$$;

-- Modified cron function to use queue instead of direct sending
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

    -- Queue notifications after interest payment (instead of direct sending)
    PERFORM queue_daily_interest_notifications();

    RAISE NOTICE 'Daily interest notifications queued';

EXCEPTION WHEN OTHERS THEN
    -- Log any errors but don't fail the entire process
    RAISE WARNING 'Error in daily cron job: %', SQLERRM;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION queue_daily_interest_notifications() TO service_role;

-- For manual testing
-- SELECT queue_daily_interest_notifications();

-- To check queued notifications
-- SELECT * FROM pending_notifications WHERE status = 'pending' ORDER BY created_at DESC;
