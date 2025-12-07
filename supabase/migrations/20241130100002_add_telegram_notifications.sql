-- Add Telegram notifications functionality for daily interest

-- First, create the notification function
CREATE OR REPLACE FUNCTION send_daily_interest_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_record RECORD;
    interest_amount DECIMAL;
    current_core_balance DECIMAL;
    notification_message TEXT;
    telegram_api_url TEXT;
    response JSONB;
    bot_token TEXT := '8435062997:AAF6P0lc5CUdgtS7-NYReTkPoGk-tFyykpU'; -- Bot token из TELEGRAM_BOT_TOKEN
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

        -- Format message
        notification_message := FORMAT(
            E'Daily Interest earned: %s\nCurrent Core balance: %s',
            TO_CHAR(interest_amount, 'FM9999999999.00000000'),
            TO_CHAR(current_core_balance, 'FM999999999999.00000000')
        );

        -- Escape special characters for HTML
        notification_message := REPLACE(notification_message, '<', '<');
        notification_message := REPLACE(notification_message, '>', '>');
        notification_message := REPLACE(notification_message, '&', '&');

        -- Build Telegram API URL
        telegram_api_url := FORMAT(
            'https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s&parse_mode=HTML',
            bot_token,
            user_record.telegram_id,
            notification_message
        );

        -- Send message using HTTP extension (if available in Supabase)
        BEGIN
            -- Try using extensions.http_get if available
            SELECT content::jsonb INTO response
            FROM extensions.http_get(telegram_api_url);

            IF response->>'ok' = 'true' THEN
                RAISE NOTICE 'Notification sent to user % (telegram_id: %)', user_record.id, user_record.telegram_id;
            ELSE
                RAISE WARNING 'Failed to send notification to user % (telegram_id: %): %', user_record.id, user_record.telegram_id, response;
            END IF;

        EXCEPTION WHEN OTHERS THEN
            -- If HTTP extension not available, log the attempt
            RAISE NOTICE 'Telegram notification could not be sent to user % (telegram_id: %): % (HTTP extension may not be available)', user_record.id, user_record.telegram_id, SQLERRM;
        END;

    END LOOP;

    RAISE NOTICE 'Daily interest notifications processing completed';
END;
$$;

-- Modify the existing cron function to call notifications after interest payment
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

    -- Send notifications after interest payment
    PERFORM send_daily_interest_notifications();

    RAISE NOTICE 'Daily interest notifications sent';

EXCEPTION WHEN OTHERS THEN
    -- Log any errors but don't fail the entire process
    RAISE WARNING 'Error in daily cron job: %', SQLERRM;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION send_daily_interest_notifications() TO service_role;

-- If you want to manually test notifications:
-- SELECT send_daily_interest_notifications();
