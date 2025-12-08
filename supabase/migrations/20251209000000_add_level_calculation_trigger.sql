-- Add level calculation function and trigger

-- Create function to calculate user level based on aicore_balance
CREATE OR REPLACE FUNCTION calculate_user_level(aicore_balance numeric)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    threshold_record RECORD;
    calculated_level integer := 0;
BEGIN
    -- Find the highest level the user qualifies for
    FOR threshold_record IN
        SELECT level, core_required
        FROM level_thresholds
        ORDER BY level DESC
    LOOP
        IF aicore_balance >= threshold_record.core_required THEN
            calculated_level := threshold_record.level;
            EXIT; -- Exit loop when we find the highest qualifying level
        END IF;
    END LOOP;

    RETURN calculated_level;
END;
$$;

-- Create trigger function to update level when aicore_balance changes
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only update level if aicore_balance changed or this is a new user
    IF (TG_OP = 'INSERT') OR
       (TG_OP = 'UPDATE' AND OLD.aicore_balance IS DISTINCT FROM NEW.aicore_balance) THEN
        NEW.level := calculate_user_level(NEW.aicore_balance);
    END IF;

    RETURN NEW;
END;
$$;

-- Create trigger on users table
DROP TRIGGER IF EXISTS trigger_update_user_level ON users;
CREATE TRIGGER trigger_update_user_level
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_user_level();

-- Update existing users' levels
UPDATE users
SET level = calculate_user_level(aicore_balance)
WHERE aicore_balance > 0;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION calculate_user_level(numeric) TO service_role;
GRANT EXECUTE ON FUNCTION update_user_level() TO service_role;
