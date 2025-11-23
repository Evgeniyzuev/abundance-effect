import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase Admin Client (requires SERVICE_ROLE_KEY)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        console.log('[API] /api/auth/telegram-user called');
        const body = await request.json();
        const { telegramUser, initData } = body;
        console.log('[API] Telegram user:', telegramUser);

        if (!telegramUser?.id) {
            console.error('[API] Missing Telegram user data');
            return NextResponse.json({ error: 'Missing Telegram user data' }, { status: 400 });
        }

        const telegramId = telegramUser.id;

        // 1. Check if user already exists in public table
        console.log('[API] Checking for existing user with telegram_id:', telegramId);
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('telegram_id', telegramId)
            .maybeSingle();

        if (existingUser) {
            console.log('[API] Existing user found:', existingUser.id);

            // For existing users, we need to reset their password so they can sign in
            const newPassword = crypto.randomBytes(16).toString('hex');

            console.log('[API] Updating password for existing user...');
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                existingUser.id,
                { password: newPassword }
            );

            if (updateError) {
                console.error('[API] Error updating password:', updateError);
                return NextResponse.json({ error: 'Password update failed' }, { status: 500 });
            }

            console.log('[API] Password updated successfully');
            return NextResponse.json({
                success: true,
                user: existingUser,
                auth_user_id: existingUser.id,
                password: newPassword
            });
        }

        // 2. Create new Supabase Auth User
        console.log('[API] Creating new user...');
        const email = `telegram_${telegramId}@abundance-effect.app`;
        const password = crypto.randomBytes(16).toString('hex');

        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                telegram_id: telegramId,
                username: telegramUser.username,
                first_name: telegramUser.first_name,
                last_name: telegramUser.last_name,
                avatar_url: telegramUser.photo_url
            }
        });

        if (authError) {
            console.error('[API] Error creating auth user:', authError);
            throw authError;
        }

        console.log('[API] Auth user created:', authUser.user.id);

        // 3. Wait a bit for the trigger to create the user record
        console.log('[API] Waiting for trigger to create user record...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 4. Fetch the created user
        const { data: newUser, error: dbError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', authUser.user.id)
            .single();

        if (dbError) {
            console.error('[API] Error fetching created user:', dbError);
            return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
        }

        console.log('[API] New user created successfully:', newUser.id);
        return NextResponse.json({
            success: true,
            user: newUser,
            auth_user_id: authUser.user.id,
            password: password
        });

    } catch (error: any) {
        console.error('[API] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
