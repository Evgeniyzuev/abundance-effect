-- Phase 2: Universal User Hierarchy Bonus Trigger
-- This trigger ensures that whenever ANY user's aicore_balance increases, 
-- their Lead (referrer_id) automatically receives a 1% bonus of that increase.

-- 1. Ensure core_operations supports 'referral_bonus' type
ALTER TABLE public.core_operations DROP CONSTRAINT IF EXISTS core_operations_type_check;
ALTER TABLE public.core_operations ADD CONSTRAINT core_operations_type_check CHECK (type IN ('interest', 'transfer', 'reinvest', 'referral_bonus'));

-- 2. Create the trigger function
CREATE OR REPLACE FUNCTION public.on_aicore_balance_increase_award_bonus()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    increase_amount numeric;
    bonus_amount numeric;
BEGIN
    -- Check if balance actually increased and user has a Lead
    IF NEW.aicore_balance > OLD.aicore_balance AND NEW.referrer_id IS NOT NULL THEN
        -- Calculate the difference
        increase_amount := NEW.aicore_balance - OLD.aicore_balance;
        
        -- Calculate 1% bonus
        bonus_amount := (increase_amount * 0.01)::numeric(20,10);
        
        -- If bonus is significant (more than 0), award it to the Lead
        IF bonus_amount > 0 THEN
            -- UPDATE Lead's balance (This will trigger this function again for the Lead's Lead, etc.)
            UPDATE public.users 
            SET aicore_balance = (aicore_balance + bonus_amount)::numeric(20,10)
            WHERE id = NEW.referrer_id;

            -- Log the operation for transparency
            INSERT INTO public.core_operations (user_id, amount, type)
            VALUES (NEW.referrer_id, bonus_amount, 'referral_bonus');
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- 3. Create the trigger on the users table
DROP TRIGGER IF EXISTS trigger_user_hierarchy_bonus ON public.users;
CREATE TRIGGER trigger_user_hierarchy_bonus
    AFTER UPDATE OF aicore_balance ON public.users
    FOR EACH ROW
    WHEN (NEW.aicore_balance > OLD.aicore_balance)
    EXECUTE PROCEDURE public.on_aicore_balance_increase_award_bonus();

-- Note: This trigger handles all kinds of growth: 
-- Daily interest, manual rewards, transfers, and even cascading recruitment bonuses.
