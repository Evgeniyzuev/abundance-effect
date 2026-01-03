'use server';

import { createClient } from '@/utils/supabase/server';
import { logger } from '@/utils/logger';

/**
 * Fetches the user's hierarchy: their Lead and their Team members.
 */
export async function fetchHierarchyAction() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        // 1. Fetch current user with referrer_id
        const { data: currentUser, error: userError } = await supabase
            .from('users')
            .select('*, referrer_id')
            .eq('id', user.id)
            .single();

        if (userError) {
            logger.error('Error fetching current user for hierarchy:', userError);
            return { success: false, error: userError.message };
        }

        // 2. Fetch Lead details if exists
        let lead = null;
        if (currentUser.referrer_id) {
            const { data: leadData, error: leadError } = await supabase
                .from('users')
                .select('*')
                .eq('id', currentUser.referrer_id)
                .single();

            if (!leadError) {
                lead = leadData;
            } else {
                logger.warn('Could not fetch lead data even though referrer_id is present:', leadError);
            }
        }

        // 3. Fetch Team (direct referrals)
        const { data: team, error: teamError } = await supabase
            .from('users')
            .select('*')
            .eq('referrer_id', user.id)
            .order('created_at', { ascending: false });

        if (teamError) {
            logger.error('Error fetching team members:', teamError);
            return { success: false, error: teamError.message };
        }

        return {
            success: true,
            data: {
                lead,
                team: team || []
            }
        };
    } catch (error) {
        logger.error('Error in fetchHierarchyAction:', error);
        return { success: false, error: 'Internal server error' };
    }
}

/**
 * Broadcasts a message to all direct team members via the notification system.
 */
export async function broadcastToTeamAction(message: string) {
    if (!message || message.trim().length === 0) {
        return { success: false, error: 'Message cannot be empty' };
    }

    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        // 1. Get sender details
        const { data: sender } = await supabase
            .from('users')
            .select('first_name, username')
            .eq('id', user.id)
            .single();

        const senderName = sender?.first_name || sender?.username || 'Ваш Лид';

        // 2. Get team member IDs
        const { data: teamMembers, error: teamError } = await supabase
            .from('users')
            .select('id')
            .eq('referrer_id', user.id);

        if (teamError) {
            logger.error('Error checking team size for broadcast:', teamError);
            return { success: false, error: teamError.message };
        }

        if (!teamMembers || teamMembers.length === 0) {
            return { success: false, error: 'У вас пока нет команды для рассылки' };
        }

        // 3. Create notifications
        const notifications = teamMembers.map(member => ({
            user_id: member.id,
            title: `Сообщение от Лида (${senderName})`,
            message: message.trim(),
            type: 'info',
            data: { from_lead_id: user.id }
        }));

        const { error: notifyError } = await supabase
            .from('notifications')
            .insert(notifications);

        if (notifyError) {
            logger.error('Error inserting broadcast notifications:', notifyError);
            return { success: false, error: notifyError.message };
        }

        logger.info(`Lead ${user.id} broadcasted a message to ${teamMembers.length} members`);

        return {
            success: true,
            message: `Сообщение успешно отправлено команде (${teamMembers.length} чел.)`
        };
    } catch (error) {
        logger.error('Error in broadcastToTeamAction:', error);
        return { success: false, error: 'Internal server error' };
    }
}
