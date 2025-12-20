-- Update queue_daily_interest_notifications to also insert into in-app notifications
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
    msg_title text;
    msg_body text;
BEGIN
    -- Process each user with telegram_id or users who might want in-app notifications
    -- We can process all users with interest today for in-app, but only those with telegram_id for Telegram
    FOR user_record IN
        SELECT
            u.id,
            u.telegram_id,
            u.aicore_balance,
            COALESCE(SUM(CASE WHEN co.type = 'interest' AND DATE(co.created_at) = CURRENT_DATE THEN co.amount ELSE 0 END), 0) as todays_interest
        FROM users u
        LEFT JOIN core_operations co ON co.user_id = u.id
        GROUP BY u.id, u.telegram_id, u.aicore_balance
        HAVING COALESCE(SUM(CASE WHEN co.type = 'interest' AND DATE(co.created_at) = CURRENT_DATE THEN co.amount ELSE 0 END), 0) > 0
    LOOP
        -- Get today's interest total for the user
        interest_amount := user_record.todays_interest;
        current_core_balance := user_record.aicore_balance;

        -- Create notification data for Telegram
        notification_data := jsonb_build_object(
            'interest_amount', interest_amount,
            'current_balance', current_core_balance,
            'date', CURRENT_DATE
        );

        -- 1. Queue the Telegram notification if telegram_id exists
        IF user_record.telegram_id IS NOT NULL THEN
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
        END IF;

        -- 2. Insert into In-App Notifications
        -- Note: We use static text for now, but in the future we might want language-specific messages
        -- However, the table doesn't store language, so we'll use a generic message or handle translation in UI
        msg_title := 'Daily Interest Received 💰';
        msg_body := format('You received $%s in core interest today. Your current balance is $%s.', 
                           round(interest_amount, 4), 
                           round(current_core_balance, 2));

        INSERT INTO public.notifications (
            user_id,
            title,
            message,
            type,
            data
        ) VALUES (
            user_record.id,
            msg_title,
            msg_body,
            'reward',
            notification_data
        );

        RAISE NOTICE 'Queued notifications for user %', user_record.id;
    END LOOP;

    RAISE NOTICE 'Daily interest notifications completed';
END;
$$;
