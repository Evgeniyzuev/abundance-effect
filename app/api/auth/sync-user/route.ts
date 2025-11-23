import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if public user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        if (existingUser) {
            return NextResponse.json({ success: true, user: existingUser });
        }

        // Create public user if missing
        console.log('Syncing user to public table:', user.id);

        // Extract metadata
        const metadata = user.user_metadata || {};
        const username = metadata.user_name || metadata.username || user.email?.split('@')[0];
        const firstName = metadata.full_name || metadata.name || metadata.first_name || 'User';
        const avatarUrl = metadata.avatar_url || metadata.picture || '';

        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
                id: user.id,
                username,
                first_name: firstName,
                avatar_url: avatarUrl,
                // Add other fields if necessary
            })
            .select()
            .single();

        if (insertError) {
            console.error('Error syncing user:', insertError);
            return NextResponse.json({ error: 'Failed to create user record' }, { status: 500 });
        }

        return NextResponse.json({ success: true, user: newUser });

    } catch (error: any) {
        console.error('Sync user error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
