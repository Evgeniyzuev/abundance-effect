-- Phase 1: User Hierarchy Logic
-- This migration adds functions to manage Lead-Follower relationships based on levels.

-- 1. Function to find the first ancestor with a level strictly higher than a target level
CREATE OR REPLACE FUNCTION public.find_higher_level_ancestor(start_user_id uuid, target_level integer)
RETURNS uuid 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_referrer_id uuid;
    referrer_level integer;
BEGIN
    -- Start from the current lead of the user
    SELECT referrer_id INTO current_referrer_id FROM public.users WHERE id = start_user_id;
    
    WHILE current_referrer_id IS NOT NULL LOOP
        SELECT level INTO referrer_level FROM public.users WHERE id = current_referrer_id;
        
        -- If we found someone with a higher level, return them
        IF referrer_level > target_level THEN
            RETURN current_referrer_id;
        END IF;
        
        -- Otherwise, move up the chain to the Lead of this Lead
        SELECT referrer_id INTO current_referrer_id FROM public.users WHERE id = current_referrer_id;
    END LOOP;
    
    -- If no higher lead is found, return NULL (Abundance AI)
    RETURN NULL;
END;
$$;

-- 2. Trigger function to handle lead reassignment when a user's level increases
CREATE OR REPLACE FUNCTION public.reassign_lead_if_needed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    lead_level integer;
    new_lead_id uuid;
BEGIN
    -- Logic for Catch-up rule:
    -- If NEW.level >= lead.level, then NEW.referrer_id = find_higher_level_ancestor(...)
    
    IF NEW.referrer_id IS NOT NULL THEN
        SELECT level INTO lead_level FROM public.users WHERE id = NEW.referrer_id;
        
        -- Use >= because the rule says "if catches up" (догоняет), usually meaning level becomes equal or greater
        IF NEW.level >= lead_level THEN
            -- Find the first person up the chain who has a level > NEW.level
            new_lead_id := public.find_higher_level_ancestor(NEW.id, NEW.level);
            NEW.referrer_id := new_lead_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- 3. Create the trigger
-- Trigger should run BEFORE update/insert so we can modify NEW.referrer_id
DROP TRIGGER IF EXISTS on_user_level_update_reassign_lead ON public.users;
CREATE TRIGGER on_user_level_update_reassign_lead
    BEFORE UPDATE OF level ON public.users
    FOR EACH ROW
    WHEN (NEW.level > OLD.level)
    EXECUTE PROCEDURE public.reassign_lead_if_needed();

-- Note: We only trigger on level increase as levels in Abundance usually don't decrease.
-- If we need to handle initial inserts with low-level referrers, we could add OR INSERT and a different WHEN.
